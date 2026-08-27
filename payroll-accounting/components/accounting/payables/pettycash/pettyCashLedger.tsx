import React from "react";
import { Button, Card, Col, Row, Statistic, Table, Tag, App } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { ColumnsType } from "antd/es/table";
import { GET_PETTY_CASH_LEDGER } from "@/graphql/payables/petty-cash-queries";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { useDialog } from "@/hooks";
import PettyCashCashInModal, {
  PettyCashCashInRecord,
} from "../dialogs/pettyCashCashInModal";

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

export default function PettyCashLedger() {
  const { message } = App.useApp();
  const cashInModal = useDialog(PettyCashCashInModal);
  const { data, loading, refetch } = useQuery<PettyCashLedgerData>(
    GET_PETTY_CASH_LEDGER,
    {
      fetchPolicy: "cache-and-network",
      onError: () =>
        message.error("Unable to load the petty cash ledger. Please refresh and try again."),
    }
  );
  const ledger = data?.pettyCashLedger;

  const addCashIn = (record?: PettyCashCashInRecord) => {
    cashInModal({ record }, (result: { success?: boolean; message?: string }) => {
      if (result?.success) {
        message.success(result.message);
        refetch();
      }
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
