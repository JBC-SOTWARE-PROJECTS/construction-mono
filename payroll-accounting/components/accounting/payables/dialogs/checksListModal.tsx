import React, { useEffect, useState } from "react";
import { DisbursementCheck, Query, Supplier } from "@/graphql/gql/graphql";
import { GET_RECORDS_CHECKS_FILTER } from "@/graphql/payables/release-checks";
import { currency, dateFormat, responsiveColumn2 } from "@/utility/constant";
import {
  DateFormatter,
  NumberFormater,
  stringEndDate,
  stringStartDate,
} from "@/utility/helper";
import { RedEnvelopeOutlined, SaveOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import dayjs, { Dayjs } from "dayjs";
import FormDateRange from "@/components/common/formDateRange/filterDateRange";
import { FormSelect } from "@/components/common";
import { useBanks } from "@/hooks/payables";

interface IProps {
  hide: (hideProps: any) => void;
  supplier: Supplier;
  singleSelect?: boolean;
  payload?: DisbursementCheck[];
}

const { Search } = Input;

export default function ChecksListSelectorModal(props: IProps) {
  const { hide, payload } = props;
  const [filterDates, setFilterDates] = useState({
    start: dayjs(dayjs().startOf("month"), dateFormat),
    end: dayjs(dayjs().endOf("month"), dateFormat),
  });
  const [state, setState] = useState({
    filter: "",
    bank: null,
    page: 0,
    size: 10,
  });

  const [selected, setSelected] = useState<DisbursementCheck[]>([]);
  const [selectedRowkeys, setSelectedRowkeys] = useState<React.Key[]>([]);
  // ===================== Queries ==============================
  const banks = useBanks();
  const { data, loading } = useQuery<Query>(GET_RECORDS_CHECKS_FILTER, {
    variables: {
      filter: state.filter,
      bank: state.bank,
      start: stringStartDate(filterDates.start),
      end: stringEndDate(filterDates.end),
      size: state.size,
      page: state.page,
    },
    fetchPolicy: "cache-and-network",
  });

  //================== functions ====================
  const onRangeChange = (dates: any) => {
    if (dates) {
      setFilterDates((prev) => ({
        ...prev,
        start: dayjs(dates[0], dateFormat),
        end: dayjs(dates[1], dateFormat),
        page: 0,
      }));
    }
  };

  const onSubmit = () => {
    if (!_.isEmpty(selected)) {
      hide(selected);
    }
  };

  const changePage = (e: number) => {
    setState((prev) => ({ ...prev, page: e }));
  };

  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: DisbursementCheck[]
    ) => {
      setSelectedRowkeys(selectedRowKeys);
      setSelected(selectedRows);
    },
    getCheckboxProps: (record: DisbursementCheck) => {
      let selected = _.find(payload, (e) => {
        return e.id === record.id;
      });
      return {
        disabled: !_.isEmpty(selected),
      };
    },
  };

  // ================ columns ================================
  const columns: ColumnsType<DisbursementCheck> = [
    {
      title: "CK No",
      dataIndex: "disNo",
      key: "disNo",
      width: 100,
      render: (text, record) => (
        <span key={text}>{record.disbursement?.disNo}</span>
      ),
    },
    {
      title: "CK Date",
      dataIndex: "disDate",
      key: "disDate",
      width: 110,
      render: (text, record) => (
        <span key={text}>{DateFormatter(record.disbursement?.disDate)}</span>
      ),
    },
    {
      title: "Supplier",
      dataIndex: "disbursement.payeeName",
      key: "disbursement.payeeName",
      width: 500,
      render: (text, record) => (
        <span key={text}>{record.disbursement?.payeeName}</span>
      ),
    },
    {
      title: "Bank",
      dataIndex: "bank.bankname",
      key: "bank.bankname",
      width: 350,
      render: (text, record) => <span key={text}>{record.bank?.bankname}</span>,
    },
    {
      title: "Check Date",
      dataIndex: "checkDate",
      key: "checkDate",
      width: 100,
      render: (text) => <span key={text}>{DateFormatter(text)}</span>,
    },
    {
      title: "Check No",
      dataIndex: "disNo",
      key: "disNo",
      width: 100,
      render: (text, record) => <span key={text}>{record.checkNo}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      fixed: "right",
      width: 130,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
  ];

  // ================= load defaults ====================================
  useEffect(() => {
    if (!_.isEmpty(payload)) {
      const mappedSelectedRow = _.map(payload, "id");
      setSelectedRowkeys(mappedSelectedRow);
      setSelected(payload ?? []);
    }
  }, [payload]);

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <RedEnvelopeOutlined /> Unrelease Checks
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "1500px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            onClick={onSubmit}
          >
            Add Selected
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" className="filter-form">
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Search
              onSearch={(e) =>
                setState((prev) => ({ ...prev, filter: e, page: 0 }))
              }
              defaultValue={state.filter}
              placeholder="Search here ..."
            />
          </Col>
          <Col {...responsiveColumn2}>
            <FormDateRange
              label="Filter Check Date"
              showpresstslist={true}
              propsrangepicker={{
                defaultValue: [filterDates.start, filterDates.end],
                format: dateFormat,
                onChange: onRangeChange,
              }}
            />
          </Col>

          <Col {...responsiveColumn2}>
            <FormSelect
              label="Filter Bank"
              propsselect={{
                showSearch: true,
                value: state.bank,
                options: banks,
                allowClear: true,
                placeholder: "Select Bank",
                onChange: (newValue) => {
                  setState((prev) => ({ ...prev, bank: newValue, page: 0 }));
                },
              }}
            />
          </Col>
        </Row>
      </Form>

      <Row>
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
            pagination={false}
            footer={() => (
              <Pagination
                showSizeChanger={false}
                current={state.page + 1}
                pageSize={state.size}
                responsive={true}
                total={data?.checksFilter?.totalElements || 0}
                onChange={(e) => {
                  changePage(e - 1);
                }}
              />
            )}
            dataSource={data?.checksFilter?.content as DisbursementCheck[]}
          />
        </Col>
      </Row>
    </Modal>
  );
}
