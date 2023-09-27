import React, { useEffect, useState, useMemo } from "react";
import { AccountsPayable, Query, Supplier } from "@/graphql/gql/graphql";
import { GET_AP_LIST_POSTED_BY_SUPPLIER } from "@/graphql/payables/queries";
import { currency, vatRate } from "@/utility/constant";
import { DateFormatter, NumberFormater, decimalRound2 } from "@/utility/helper";
import { AuditOutlined, SaveOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  App,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { IDisbursementApplication } from "@/interface/payables/formInterfaces";
import _ from "lodash";


interface IProps {
  hide: (hideProps: any) => void;
  supplier: Supplier;
  singleSelect?: boolean;
  payload?: IDisbursementApplication[];
  debitMemo?: boolean;
}

const { Search } = Input;

export default function AccountsPayableListSelectorModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, supplier, singleSelect, payload, debitMemo } = props;
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<AccountsPayable[]>([]);
  const [selectedRowkeys, setSelectedRowkeys] = useState<React.Key[]>([]);
  // ===================== Queries ==============================
  const { data, loading } = useQuery<Query>(GET_AP_LIST_POSTED_BY_SUPPLIER, {
    variables: {
      filter: filter,
      supplier: supplier?.id ?? null,
    },
    fetchPolicy: "cache-and-network",
  });

  //================== functions ====================

  const onSubmit = () => {
    // ============= validate before proceeding =================
    let payloadSelected = _.clone(selected);
    if (_.isEmpty(selected)) {
      return message.error("Please select at least one");
    }
    if (!_.isEmpty(payload)) {
      payloadSelected = _.filter(selected, (obj) => {
        let findSelected = _.find(payload, (e) => {
          return e.payable?.id === obj.id;
        });
        return _.isEmpty(findSelected);
      });
    }
    // ============ end validation =============================
    const mappedData = payloadSelected.map((data: AccountsPayable) => {
      // ==== assuming that all are vat inclusive ==============
      // ====== user can modify it later =======================
      let inclusive = true;
      let rateVat = vatRate;
      let vatAmount = 0;
      if (data.ewtAmount > 0) {
        rateVat = 0;
      } else if (data.ewtAmount <= 0) {
        let decimalVatRate = rateVat / 100;
        if (inclusive) {
          vatAmount = (data.balance / (decimalVatRate + 1)) * decimalVatRate;
        } else {
          vatAmount = data.balance * decimalVatRate;
        }
      }

      return {
        id: data.id,
        payable: data,
        appliedAmount: decimalRound2(data.balance),
        vatRate: rateVat,
        vatInclusive: inclusive,
        vatAmount: decimalRound2(vatAmount),
        ewtDesc: "",
        ewtRate: 0,
        ewtAmount: 0,
        grossAmount: decimalRound2(data.balance),
        discount: 0,
        netAmount: decimalRound2(data.balance),
        isNew: true,
      };
    }) as IDisbursementApplication[];

    if (!_.isEmpty(payload)) {
      let concatArray = _.concat(
        payload,
        mappedData
      ) as IDisbursementApplication[];
      return hide(concatArray);
    }
    return hide(mappedData);
  };

  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: AccountsPayable[]
    ) => {
      if (singleSelect) {
        let size = _.size(selectedRowKeys);
        if (size <= 1) {
          setSelectedRowkeys(selectedRowKeys);
          setSelected(selectedRows);
        } else {
          message.error("Cannot select more than one");
        }
      } else {
        setSelectedRowkeys(selectedRowKeys);
        setSelected(selectedRows);
      }
    },
    getCheckboxProps: (record: AccountsPayable) => {
      let selected = _.find(payload, (e) => {
        return e.payable?.id === record.id;
      });
      return {
        disabled: !_.isEmpty(selected),
      };
    },
  };

  // ================ columns ================================
  const columns: ColumnsType<AccountsPayable> = useMemo(() => {
    let col: ColumnsType<AccountsPayable> = [
      {
        title: "A/P Date",
        dataIndex: "apvDate",
        key: "apvDate",
        width: 125,
        render: (text) => <span>{DateFormatter(text)}</span>,
      },
      {
        title: "A/P #",
        dataIndex: "apNo",
        key: "apNo",
      },
      {
        title: "Invoice #",
        dataIndex: "invoiceNo",
        key: "invoiceNo",
      },
    ];
    if (debitMemo) {
      let dm: ColumnsType<AccountsPayable> = [
        {
          title: "Paid Amount",
          dataIndex: "appliedAmount",
          key: "appliedAmount",
          align: "right",
          render: (amount) => (
            <span>
              <small>{currency} </small>
              {NumberFormater(amount)}
            </span>
          ),
        },
        {
          title: "Debit Memo Amount",
          dataIndex: "debitAmount",
          key: "debitAmount",
          align: "right",
          render: (amount) => (
            <span>
              <small>{currency} </small>
              {NumberFormater(amount)}
            </span>
          ),
        },
        {
          title: "Balance",
          dataIndex: "balance",
          key: "balance",
          align: "right",
          render: (amount) => (
            <span>
              <small>{currency} </small>
              {NumberFormater(amount)}
            </span>
          ),
        },
      ];
      col = [...col, ...dm];
    } else {
      let payables: ColumnsType<AccountsPayable> = [
        {
          title: "Ewt Amount",
          dataIndex: "ewtAmount",
          key: "ewtAmount",
          align: "right",
          render: (amount) => (
            <span>
              <small>{currency} </small>
              {NumberFormater(amount)}
            </span>
          ),
        },
        {
          title: "Balance",
          dataIndex: "balance",
          key: "balance",
          align: "right",
          render: (amount) => (
            <span>
              <small>{currency} </small>
              {NumberFormater(amount)}
            </span>
          ),
        },
      ];
      col = [...col, ...payables];
    }
    return col;
  }, []);

  // ================= load defaults ====================================
  useEffect(() => {
    if (!_.isEmpty(payload)) {
      const mappedSelectedRow = _.map(payload, "payable.id");
      const mapSelectedRow = (payload ?? []).map((obj) => {
        return {
          ...obj.payable,
        };
      });
      setSelectedRowkeys(mappedSelectedRow);
      setSelected(mapSelectedRow);
    }
  }, [payload]);

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <AuditOutlined /> Accounts Payables:
            {supplier && (
              <Tag color="magenta">{supplier?.supplierFullname}</Tag>
            )}
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "1000px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            onClick={onSubmit}>
            Add Selected
          </Button>
        </Space>
      }>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Search onSearch={setFilter} defaultValue={filter} />
        </Col>
        <Col span={24}>
          <Table
            rowSelection={{
              selectedRowKeys: selectedRowkeys,
              ...rowSelection,
            }}
            rowKey="id"
            size="small"
            loading={loading}
            columns={columns}
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
            }}
            dataSource={data?.apListBySupplier as AccountsPayable[]}
          />
        </Col>
      </Row>
    </Modal>
  );
}
