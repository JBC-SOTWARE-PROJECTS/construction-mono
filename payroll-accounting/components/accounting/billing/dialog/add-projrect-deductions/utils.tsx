import { BillingItem } from "@/graphql/gql/graphql"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import type { TableProps } from "antd"
import { Button } from "antd"
import numeral from "numeral"

export const getProjectDeductionCol = (
  onHandleDelete: (id: string) => void
) => {
  const columns: TableProps<BillingItem>["columns"] = [
    {
      title: "Record No",
      dataIndex: "recordNo",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Amount",
      dataIndex: "remainingBalance",
      align: "right",
      render: (text) => numeral(text).format("0,0.00"),
    },
    {
      title: <EditOutlined />,
      align: "center",
      dataIndex: "id",
      render: (id) => (
        <Button
          size="small"
          type="text"
          icon={<DeleteOutlined />}
          danger
          onClick={() => onHandleDelete(id)}
        />
      ),
    },
  ]

  return columns
}
