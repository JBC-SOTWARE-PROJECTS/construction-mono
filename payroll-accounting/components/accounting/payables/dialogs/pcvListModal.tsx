import React, { useState } from "react";
import { PettyCashAccounting, Query } from "@/graphql/gql/graphql";
import { GET_AP_LIST_POSTED_BY_SUPPLIER } from "@/graphql/payables/queries";
import { DateFormatter, NumberFormater, randomId } from "@/utility/helper";
import { AuditOutlined, SaveOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import {
  App,
  Button,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { GET_POSTED_PETTY_CASH } from "@/graphql/payables/petty-cash-queries";
import { currency } from "@/utility/constant";
import { IDisbursementPCV } from "@/interface/payables/formInterfaces";

interface IProps {
  hide: (hideProps: any) => void;
  payload: IDisbursementPCV[];
}

const { Search } = Input;

export default function PettyCashListSelectorModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, payload } = props;
  const [filter, setFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState<PettyCashAccounting[]>([]);
  const [selectedRowkeys, setSelectedRowkeys] = useState<React.Key[]>([]);
  // ===================== Queries ==============================
  const { data, loading } = useQuery<Query>(GET_POSTED_PETTY_CASH, {
    variables: {
      filter: filter,
    },
    fetchPolicy: "cache-and-network",
  });

  //================== functions ====================

  const onSubmit = () => {
    if (_.isEmpty(selectedItems)) {
      message.warning("Please select PCV");
    } else {
      const alreadyExisted = _.clone(payload);
      const newSelected = selectedItems.map((obj) => {
        return {
          id: randomId(),
          pettyCashAccounting: obj,
          amount: obj.balance,
          isNew: true,
        };
      });
      if (!_.isEmpty(newSelected)) {
        let concatArray = _.concat(
          alreadyExisted,
          newSelected
        ) as IDisbursementPCV[];
        hide(concatArray);
      }
    }
  };

  // ================ columns ================================
  const columns: ColumnsType<PettyCashAccounting> = [
    {
      title: "PCV Date",
      dataIndex: "pcvDate",
      key: "pcvDate",
      width: 110,
      render: (text) => <span>{DateFormatter(text)}</span>,
    },
    {
      title: "PCV No",
      dataIndex: "pcvNo",
      key: "pcvNo",
      width: 110,
    },
    {
      title: "payeeName",
      dataIndex: "payeeName",
      key: "payeeName",
    },
    {
      title: "Reference No",
      dataIndex: "referenceNo",
      key: "referenceNo",
      width: 130,
    },
    {
      title: "Amount Used",
      dataIndex: "amountUsed",
      key: "amountUsed",
      width: 120,
      align: "right",
      render: (amount) => {
        return `${currency} ${NumberFormater(amount)}`;
      },
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 120,
      align: "right",
      render: (amount) => {
        return `${currency} ${NumberFormater(amount)}`;
      },
    },
  ];

  const rowSelection = {
    onSelect: (record: PettyCashAccounting, selected: boolean) => {
      let payloadSelected = _.clone(selectedItems);
      if (selected) {
        // =============== set ======================
        payloadSelected.push(record);
        let mapKeys: React.Key[] = _.map(payloadSelected, "id");
        setSelectedRowkeys(mapKeys);
        setSelectedItems(payloadSelected);
      } else {
        // ================ remove ===============================
        let filtered = _.filter(payloadSelected, function (o) {
          return o.id !== record.id;
        });
        let mapKeys: React.Key[] = _.map(filtered, "id");
        setSelectedRowkeys(mapKeys);
        setSelectedItems(filtered);
      }
    },
    onSelectAll: (
      selected: boolean,
      ____: PettyCashAccounting[],
      changeRows: PettyCashAccounting[]
    ) => {
      let payloadSelected = _.clone(selectedItems);
      if (selected) {
        // =============== set ======================
        let updatedPayloaod = _.concat(payloadSelected, changeRows);
        let mapKeys: React.Key[] = _.map(updatedPayloaod, "id");
        setSelectedRowkeys(mapKeys);
        setSelectedItems(updatedPayloaod);
      } else {
        // ================ remove ===============================
        let filtered = _.filter(payloadSelected, function (o) {
          let findObj = _.find(changeRows, { id: o.id });
          return _.isEmpty(findObj);
        });
        let mapKeys: React.Key[] = _.map(filtered, "id");
        setSelectedRowkeys(mapKeys);
        setSelectedItems(filtered);
      }
    },
    getCheckboxProps: (record: PettyCashAccounting) => ({
      disabled: !_.isEmpty(
        _.find(payload, (obj) => obj.pettyCashAccounting?.id === record.id)
      ),
    }),
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <AuditOutlined /> Posted Petty Cash Voucher
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
            dataSource={data?.postedPettyCash as PettyCashAccounting[]}
          />
        </Col>
      </Row>
    </Modal>
  );
}
