import { GET_BILLING_ITEMS } from "@/graphql/billing/queries"
import { Billing } from "@/graphql/gql/graphql"
import { DateFormatterWithTime } from "@/utility/helper"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { useQuery } from "@apollo/client"
import { Button, Space, Table } from "antd"

import type { TableColumnsType } from "antd"
import styled from "styled-components"

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
}

type FolioBillingItemType = "SERVICE" | "DEDUCTIONS" | "PAYMENTS"

interface FolioProgressBillingProps {
  billing: Billing
  type: FolioBillingItemType
}

// const columns: ColumnsType<BillingItem> = [
//   {
//     title: "Date/Time",
//     dataIndex: "transDate",
//     key: "transDate",
//     width: 200,
//     render: (transDate, record) => {
//       if (!record.status) {
//         return (
//           <Text type="danger" delete={!record.status}>
//             {DateFormatterWithTime(transDate)}
//           </Text>
//         )
//       } else {
//         return <span>{DateFormatterWithTime(transDate)}</span>
//       }
//     },
//   },
//   {
//     title: "Record No",
//     dataIndex: "recordNo",
//     key: "recordNo",
//     width: 120,
//     render: (recordNo, record) => {
//       if (!record.status) {
//         return (
//           <Text type="danger" delete={!record.status}>
//             {recordNo}
//           </Text>
//         )
//       } else {
//         return <span>{recordNo}</span>
//       }
//     },
//   },
//   {
//     title: "Description",
//     dataIndex: "description",
//     key: "description",
//     render: (description, record) => {
//       let desc = _.toUpper(description)
//       if (!record.status) {
//         return (
//           <Text type="danger" delete={!record.status}>
//             {desc}
//           </Text>
//         )
//       } else {
//         return <span>{desc}</span>
//       }
//     },
//   },
//   {
//     title: "Quantity",
//     dataIndex: "qty",
//     key: "qty",
//     width: 100,
//     render: (qty, record) => {
//       if (!record.status) {
//         return (
//           <Text type="danger" delete={!record.status}>
//             {qty}
//           </Text>
//         )
//       } else {
//         return <span>{qty}</span>
//       }
//     },
//   },
//   {
//     title: "Price",
//     dataIndex: "debit",
//     key: "debit",
//     width: 130,
//     align: "right",
//     fixed: "right",
//     render: (price, record) => {
//       let cost = price
//       if (record.itemType == "DEDUCTIONS" || record.itemType == "PAYMENTS") {
//         cost = record.subTotal
//       }
//       if (!record.status) {
//         return (
//           <Text type={"danger"} delete={!record.status}>
//             {currency + " "}
//             {NumberFormater(cost)}
//           </Text>
//         )
//       } else {
//         return (
//           <span>
//             {currency + " "}
//             {NumberFormater(cost)}
//           </span>
//         )
//       }
//     },
//   },
//   {
//     title: "Sub Total",
//     dataIndex: "subTotal",
//     key: "subTotal",
//     width: 130,
//     align: "right",
//     fixed: "right",
//     render: (subTotal, record) => {
//       if (!record.status) {
//         return (
//           <Text type="danger" delete={!record.status}>
//             {currency + " "}
//             {NumberFormater(subTotal)}
//           </Text>
//         )
//       } else {
//         return (
//           <span>
//             {currency + " "}
//             {NumberFormater(subTotal)}
//           </span>
//         )
//       }
//     },
//   },
//   {
//     title: "Tags",
//     dataIndex: "tag",
//     key: "tag",
//     align: "center",
//     fixed: "right",
//     width: 130,
//     render: (txt, record) => {
//       let object = { color: "red", text: "Cancelled" }
//       let tag = null
//       if (record.status) {
//         object = { color: "green", text: "Active" }
//       }
//       tag = [
//         <Tag key={1} color={object.color} style={{ marginBottom: 5 }}>
//           {object.text}
//         </Tag>,
//         <br key={2} />,
//         <Tag key={3} color="orange">
//           {record.lastModifiedBy}
//         </Tag>,
//       ]
//       return tag
//     },
//   },
//   {
//     title: "#",
//     dataIndex: "action",
//     key: "action",
//     width: 100,
//     align: "center",
//     fixed: "right",
//     render: (_, record) => {
//       if (record.status) {
//         return (
//           <Button
//             type="dashed"
//             size="small"
//             danger
//             onClick={() => onCancelled(record)}
//           >
//             Cancel
//           </Button>
//         )
//       }
//     },
//   },
// ]

export default function FolioProgressBilling(
  props?: FolioProgressBillingProps
) {
  const { data, loading, refetch } = useQuery(GET_BILLING_ITEMS, {
    fetchPolicy: "cache-and-network",
    variables: {
      filter: "",
      id: props?.billing?.id,
      type: props?.type,
    },
    onCompleted: (data) => {
      // let result = data?.billingItemByParentType as BillingItem[]
    },
  })

  const columns: TableColumnsType<DataType> = [
    {
      title: "Date/Time",
      width: 120,
      dataIndex: "transDate",
      fixed: "left",
      render: (text) => DateFormatterWithTime(text),
    },
    {
      title: "Record No.",
      width: 50,
      dataIndex: "recordNo",
      fixed: "left",
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 250,
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      align: "right",
      width: 50,
    },
    {
      title: "Price",
      dataIndex: "debit",
      align: "right",
      width: 80,
    },
    {
      title: "Subtotal",
      dataIndex: "subTotal",
      align: "right",
      width: 120,
    },
    {
      title: "Tags",
      dataIndex: "tag",
      key: "5",
      width: 80,
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

  return (
    <TableCSS>
      <Table
        size="small"
        columns={columns}
        dataSource={data?.billingItemByParentType ?? []}
        scroll={{ x: 1500, y: 300 }}
      />
    </TableCSS>
  )
}

const TableCSS = styled.div`
  .ant-table-header {
    border-radius: 0 !important;
  }

  :where(.css-dev-only-do-not-override-1rdr8rr).ant-table-wrapper
    .ant-table-container
    table
    > thead
    > tr:first-child
    > *:first-child {
    border-radius: 0 !important;
  }
`
