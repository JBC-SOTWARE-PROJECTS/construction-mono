import { BillingItem } from "@/graphql/gql/graphql"
import { currency } from "@/utility/constant"
import { DateFormatterWithTime, NumberFormater } from "@/utility/helper"
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Space, Tag, Typography } from "antd"

import type { TableColumnsType } from "antd"

export const getBillingItemColumns = () => {
  const columns: TableColumnsType<BillingItem> = [
    {
      title: "Date/Time",
      width: 80,
      dataIndex: "transDate",
      fixed: "left",
      render: (text) => DateFormatterWithTime(text),
    },
    {
      title: "Record No.",
      width: 50,
      dataIndex: "recordNo",
      fixed: "left",
      render: (recordNo, record) => {
        if (!record.status) {
          return (
            <Typography.Text type="danger" delete={!record.status}>
              {recordNo}
            </Typography.Text>
          )
        } else {
          return <span>{recordNo}</span>
        }
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 350,
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      align: "right",
      width: 50,
      render: (qty, record) => {
        if (!record.status) {
          return (
            <Typography.Text type="danger" delete={!record.status}>
              {qty}
            </Typography.Text>
          )
        } else {
          return <span>{qty}</span>
        }
      },
    },
    {
      title: "Price",
      dataIndex: "debit",
      align: "right",
      width: 80,
      render: (price, record) => {
        let cost = price
        if (record.itemType == "DEDUCTIONS" || record.itemType == "PAYMENTS") {
          cost = record.subTotal
        }
        if (!record.status) {
          return (
            <Typography.Text type={"danger"} delete={!record.status}>
              {currency + " "}
              {NumberFormater(cost)}
            </Typography.Text>
          )
        } else {
          return (
            <span>
              {currency + " "}
              {NumberFormater(cost)}
            </span>
          )
        }
      },
    },
    {
      title: "Subtotal",
      dataIndex: "subTotal",
      align: "right",
      width: 120,
      render: (subTotal, record) => {
        if (!record.status) {
          return (
            <Typography.Text type="danger" delete={!record.status}>
              {currency + " "}
              {NumberFormater(subTotal)}
            </Typography.Text>
          )
        } else {
          return (
            <span>
              {currency + " "}
              {NumberFormater(subTotal)}
            </span>
          )
        }
      },
    },
    {
      title: "Tags",
      dataIndex: "tag",
      key: "5",
      width: 80,
      align: "center",
      render: (txt, record) => {
        let object = { color: "red", text: "Cancelled" }
        let tag = null
        if (record.status) {
          object = { color: "green", text: "Active" }
        }

        tag = (
          <Space size="small">
            <Tag
              key={1}
              color={object.color}
              style={{ marginBottom: 5 }}
              bordered={false}
            >
              {object.text}
            </Tag>
            <Tag
              key={3}
              color="orange"
              bordered={false}
              icon={<UserOutlined />}
            >
              {record.lastModifiedBy}
            </Tag>
          </Space>
        )
        return tag
      },
    },
    {
      title: <EditOutlined />,
      key: "operation",
      align: "center",
      fixed: "right",
      width: 30,
      render: () => (
        <Space>
          <Button size="small" type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ]

  return columns
}
