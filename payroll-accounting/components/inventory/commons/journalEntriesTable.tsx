import React from "react";
import { JournalEntryViewDto } from "@/graphql/gql/graphql";
import { Space, Table } from "antd";
import styled from "styled-components";
import { ColumnsType } from "antd/lib/table";
import { NumberFormater } from "@/utility/helper";
import JournalEntriesSummary from "@/components/accounting/payables/common/journalEntriesSummary";

interface IProps {
  entries: JournalEntryViewDto[];
  loading: boolean;
}

export default function JournaEntriesTable({ entries, loading }: IProps) {
  const columns: ColumnsType<JournalEntryViewDto> = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 200,
      render: (code) => <span>{code}</span>,
    },
    {
      title: "Description",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      align: "right",
      width: 120,
      render: (debit, record) => {
        return <span>{NumberFormater(debit)}</span>;
      },
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      align: "right",
      width: 120,
      render: (credit) => {
        return <span>{NumberFormater(credit)}</span>;
      },
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <TableCSS>
        <Table
          rowKey="code"
          columns={columns}
          dataSource={entries as JournalEntryViewDto[]}
          size="small"
          loading={loading}
          pagination={false}
          summary={() => (
            <JournalEntriesSummary dataSource={entries} autoEntries={true} />
          )}
        />
      </TableCSS>
    </Space>
  );
}

const TableCSS = styled.div`
  th.ant-table-cell {
    background: #fff !important;
    color: #399b53 !important;
    padding-bottom: 6px !important;
    border-bottom: 4px solid #f0f0f0 !important;
  }

  .ant-card .ant-card-head {
    padding: 0px !important;
  }
`;
