import { BillingItem } from "@/graphql/gql/graphql"
import { DeleteOutlined, ExportOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { ColumnProps } from "antd/es/table"
import Decimal from "decimal.js"
import numeral from "numeral"

export const getSelectedItemsColumn = (onDelete: (id: string) => void) => {
  const columns: ColumnProps<BillingItem>[] = [
    {
      title: "Item Type",
      dataIndex: "itemType",
      width: 40,
    },
    {
      title: "Doc #",
      dataIndex: "recordNo",
      width: 30,
    },
    {
      title: "Date",
      dataIndex: "transactionDate",
      width: 35,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 155,
      ellipsis: true,
    },
    {
      title: "Amount",
      dataIndex: "tmpBalance",
      width: 70,
      align: "right",
      fixed: "right",
      render: (_: string, record: any) => {
        const subTotal = new Decimal(record?.subtotal ?? 0)
        const credit = new Decimal(record?.credit ?? 0)
        return numeral(subTotal.minus(credit).toString()).format("0,0.00")
      },
    },
    {
      title: <ExportOutlined />,
      dataIndex: "id",
      width: 20,
      fixed: "right",
      align: "center",
      render: (text) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          size="small"
          danger
          onClick={() => onDelete(text)}
        />
      ),
    },
  ]

  return columns
}

export const getFolioItemsColumn = () => {
  const columns: ColumnProps<BillingItem>[] = [
    {
      title: "Doc #",
      dataIndex: "recordNo",
      width: 40,
    },
    {
      title: "Date",
      dataIndex: "transactionDate",
      width: 50,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 295,
      ellipsis: true,
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      width: 35,
      align: "right",
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 60,
      align: "right",
      render: (text) => numeral(text).format("0,0.00"),
    },
    {
      title: "Amount",
      dataIndex: "subtotal",
      width: 60,
      align: "right",
      render: (text) => numeral(text).format("0,0.00"),
    },
    {
      title: "Deductions",
      dataIndex: "credit",
      width: 60,
      align: "right",
      render: (text) => numeral(text).format("0,0.00"),
    },
    {
      title: "Balance",
      dataIndex: "tmpBalance",
      width: 70,
      align: "right",
      fixed: "right",
      render: (text) => numeral(text).format("0,0.00"),
      // render: (_: string, record: any) => {
      //   const subTotal = new Decimal(record?.subtotal ?? 0)
      //   const credit = new Decimal(record?.credit ?? 0)
      //   return numeral(subTotal.minus(credit).toString()).format("0,0.00")
      // },
    },
  ]

  return columns
}
