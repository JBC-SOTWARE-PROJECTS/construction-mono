import React from "react";
import { Button, Card, Col, Popconfirm, Row, Statistic, Table, Tag, App } from "antd";
import { CarryOutOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { ColumnsType } from "antd/es/table";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { useConfirmationPasswordHook, useDialog } from "@/hooks";
import PettyCashCashInModal, {
  PettyCashCashInRecord,
} from "../dialogs/pettyCashCashInModal";
import {
  GET_PETTY_CASH_CASH_INS,
  GET_PETTY_CASH_LEDGER,
  POST_PETTY_CASH_CASH_IN,
  REMOVE_PETTY_CASH_CASH_IN,
} from "@/graphql/payables/petty-cash-queries";

interface PettyCashLedgerEntry {
  id: string;
  transactionDate: string;
  entryType: "CASH_IN" | "PETTY_CASH_VOUCHER";
  referenceNo?: string;
  description?: string;
  cashIn: number;
  cashOut: number;
  runningBalance: number;
}

interface PettyCashLedgerData {
  pettyCashLedger?: {
    cashInTotal: number;
    cashOutTotal: number;
    cashOnHand: number;
    entries: PettyCashLedgerEntry[];
  };
}

interface PettyCashCashInData {
  pettyCashCashIns?: PettyCashCashInRecord[];
}

export default function PettyCashLedger() {
  const { message } = App.useApp();
  const cashInModal = useDialog(PettyCashCashInModal);
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  const { data, loading, refetch } = useQuery<PettyCashLedgerData>(
    GET_PETTY_CASH_LEDGER,
    {
      fetchPolicy: "cache-and-network",
      onError: () =>
        message.error("Unable to load the petty cash ledger. Please refresh and try again."),
    }
  );
  const ledger = data?.pettyCashLedger;
  const { data: cashInData, loading: cashInLoading, refetch: refetchCashIns } =
    useQuery<PettyCashCashInData>(GET_PETTY_CASH_CASH_INS, {
      fetchPolicy: "cache-and-network",
      onError: () => message.error("Unable to load Cash In transactions."),
    });
  const [postCashIn, { loading: postingCashIn }] = useMutation(
    POST_PETTY_CASH_CASH_IN
  );
  const [removeCashIn] = useMutation(REMOVE_PETTY_CASH_CASH_IN);

  const refresh = () => {
    refetch();
    refetchCashIns();
  };

  const addCashIn = (record?: PettyCashCashInRecord) => {
    cashInModal({ record }, (result: { success?: boolean; message?: string }) => {
      if (result?.success) {
        message.success(result.message);
        refresh();
      }
    });
  };

  const postDraftCashIn = (record: PettyCashCashInRecord) => {
    showPasswordConfirmation(() => {
      postCashIn({
        variables: { id: record.id },
        onCompleted: (data) => {
          if (data?.postPettyCashCashIn?.id) {
            message.success("Cash In successfully posted.");
            refresh();
          }
        },
        onError: () => message.error("Unable to post the Cash In entry."),
      });
    });
  };

  const removeDraftCashIn = (record: PettyCashCashInRecord) => {
    removeCashIn({
      variables: { id: record.id },
      onCompleted: (data) => {
        if (data?.removePettyCashCashIn?.id) {
          message.success("Cash In draft removed.");
          refresh();
        }
      },
      onError: () => message.error("Unable to remove the Cash In draft."),
    });
  };

  const columns: ColumnsType<PettyCashLedgerEntry> = [
    {
      title: "Date",
      dataIndex: "transactionDate",
      width: 120,
      render: (date) => DateFormatter(date),
    },
    {
      title: "Type",
      dataIndex: "entryType",
      width: 150,
      render: (type) => (
        <Tag color={type === "CASH_IN" ? "green" : "red"}>
          {type === "CASH_IN" ? "Cash In" : "Posted PCV"}
        </Tag>
      ),
    },
    { title: "Reference No.", dataIndex: "referenceNo", width: 160 },
    { title: "Description / Payee", dataIndex: "description" },
    {
      title: "Cash In",
      dataIndex: "cashIn",
      align: "right",
      width: 140,
      render: (amount) => <span className="text-green">{NumberFormater(amount)}</span>,
    },
    {
      title: "Cash Out",
      dataIndex: "cashOut",
      align: "right",
      width: 140,
      render: (amount) => <span className="text-red">{NumberFormater(amount)}</span>,
    },
    {
      title: "Running Balance",
      dataIndex: "runningBalance",
      align: "right",
      width: 160,
      render: (amount) => <strong>{NumberFormater(amount)}</strong>,
    },
  ];

  const cashInColumns: ColumnsType<PettyCashCashInRecord> = [
    {
      title: "Date",
      dataIndex: "transDate",
      width: 120,
      render: (date) => DateFormatter(date),
    },
    { title: "Reference No.", dataIndex: "referenceNo", width: 160 },
    { title: "Description", dataIndex: "description" },
    {
      title: "Amount",
      dataIndex: "amount",
      align: "right",
      width: 140,
      render: (amount) => NumberFormater(amount),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (status, record) => (
        <Tag color={record.posted ? "green" : "orange"}>
          {status ?? (record.posted ? "POSTED" : "DRAFT")}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) =>
        record.posted ? null : (
          <Row gutter={4} wrap={false}>
            <Col>
              <Button
                type="dashed"
                size="small"
                icon={<EditOutlined />}
                onClick={() => addCashIn(record)}
              />
            </Col>
            <Col>
              <Button
                type="primary"
                size="small"
                loading={postingCashIn}
                icon={<CarryOutOutlined />}
                onClick={() => postDraftCashIn(record)}
              />
            </Col>
            <Col>
              <Popconfirm
                title="Remove Cash In draft?"
                description="This action cannot be undone."
                okText="Remove"
                okButtonProps={{ danger: true }}
                onConfirm={() => removeDraftCashIn(record)}>
                <Button danger type="dashed" size="small" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Col>
          </Row>
        ),
    },
  ];

  return (
    <Card
      className="mt-5"
      title="Petty Cash Ledger"
      extra={
        <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => addCashIn()}>
          Cash In
        </Button>
      }>
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} md={8}>
          <Statistic title="Total Cash In" prefix={currency} value={ledger?.cashInTotal ?? 0} precision={2} />
        </Col>
        <Col xs={24} md={8}>
          <Statistic title="Posted PCV Cash Out" prefix={currency} value={ledger?.cashOutTotal ?? 0} precision={2} />
        </Col>
        <Col xs={24} md={8}>
          <Statistic title="Cash On Hand" prefix={currency} value={ledger?.cashOnHand ?? 0} precision={2} valueStyle={{ color: "#1677ff" }} />
        </Col>
      </Row>
      <Table
        className="mb-5"
        rowKey="id"
        size="small"
        title={() => "Cash In Transactions"}
        loading={cashInLoading}
        columns={cashInColumns}
        dataSource={cashInData?.pettyCashCashIns ?? []}
        pagination={{ pageSize: 5, showSizeChanger: false }}
        scroll={{ x: 850 }}
      />
      <Table
        rowKey={(record) => `${record.entryType}-${record.id}`}
        size="small"
        loading={loading}
        columns={columns}
        dataSource={ledger?.entries ?? []}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 1000 }}
      />
    </Card>
  );
}
