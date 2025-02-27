import CreateBatchReceipts from "@/components/accounting/cashier/dialog/create-batch-receipts";
import { ReceiptTypeEnum } from "@/constant/cashier";
import { GET_BATCH_RECEIPTS } from "@/graphql/cashier/queries";
import { BatchReceipt } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import {
  EditOutlined,
  MoreOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { useQuery } from "@apollo/client";
import { Button, Input, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { size } from "lodash";
import React from "react";

function BatchReceipts() {
  const createTerminalDialog = useDialog(CreateBatchReceipts);

  const { data, loading, refetch } = useQuery(GET_BATCH_RECEIPTS, {
    variables: {
      filter: "",
      page: 0,
      size: 10,
    },
    fetchPolicy: "cache-and-network",
  });

  const batchReceipts = data?.getBatchReceipts.content || [];

  function onHandleCreate() {
    createTerminalDialog({}, (success: boolean) => {
      if (success) refetch();
    });
  }

  function onHandleEdit(record: BatchReceipt) {
    createTerminalDialog({ record }, (success: boolean) => {
      if (success) refetch();
    });
  }

  const columns: ColumnsType<BatchReceipt> = [
    {
      title: "Batch Code",
      dataIndex: "batchCode",
      key: "batchCode",
    },
    {
      title: "Terminal",
      dataIndex: ["terminal", "description"],
    },
    {
      title: "Receipt Type",
      dataIndex: "receiptType",
      key: "receiptType",
      render: (text) => ReceiptTypeEnum[text as keyof typeof ReceiptTypeEnum],
    },
    {
      title: "Receipt Current No",
      dataIndex: "receiptCurrentNo",
      key: "receiptCurrentNo",
    },
    {
      title: "Range Start",
      dataIndex: "rangeStart",
      key: "rangeStart",
    },
    {
      title: "Range End",
      dataIndex: "rangeEnd",
      key: "rangeEnd",
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (active ? "Yes" : "No"),
    },
    {
      title: <MoreOutlined />,
      dataIndex: "action",
      key: "action",
      align: "center",
      width: 50,
      render: (_: any, record: BatchReceipt) => (
        <span>
          <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onHandleEdit(record)}
          />
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      title="Batch Receipts"
      extra={
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={onHandleCreate}
        >
          New Batch Receipt
        </Button>
      }
    >
      <Space style={{ width: "100%" }} direction="vertical">
        <Input.Search
          placeholder="Search here ..."
          onSearch={(filter) => refetch({ filter, page: 0 })}
        />
        <Table
          loading={loading}
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={batchReceipts}
          pagination={{
            pageSize: 20,
            showSizeChanger: false,
          }}
          scroll={{ x: 1400 }}
        />
      </Space>
    </PageContainer>
  );
}

export default BatchReceipts;
