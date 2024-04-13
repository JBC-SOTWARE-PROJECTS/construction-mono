import { HeaderLedgerGroupDto } from "@/graphql/gql/graphql"
import type { ColumnsType } from "antd/es/table"

interface HeaderLedgerGroupDtoI extends HeaderLedgerGroupDto {
  id: string
}

export const getTransactionJournalPageCol = (
  onHandleShowLedger: (record: any) => void
) => {
  const columns: ColumnsType<HeaderLedgerGroupDtoI> = [
    {
      title: "Record No",
      dataIndex: "referenceNo",
      key: "referenceNo",
      width: 200,
      fixed: "left",
      render: (text, record: HeaderLedgerGroupDtoI) => (
        <a onClick={() => onHandleShowLedger(record)}>{text}</a>
      ),
    },
    {
      title: "Entity Name",
      dataIndex: "entityName",
      key: "entityName",
    },
    {
      title: "Reference No",
      dataIndex: "docNo",
      width: 200,
      fixed: "left",
      render: (text, record: HeaderLedgerGroupDtoI) => (
        <a onClick={() => onHandleShowLedger(record)}>{text}</a>
      ),
    },
    {
      title: "POSTED",
      dataIndex: "approved",
      key: "approved",
      width: 120,
    },
    {
      title: "FOR POSTING",
      dataIndex: "notApproved",
      key: "notApproved",
      width: 150,
    },
  ]

  return columns
}
