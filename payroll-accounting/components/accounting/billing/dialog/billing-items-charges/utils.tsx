import { BillingItem, ProjectCost } from "@/graphql/gql/graphql"
import { REVISIONS_COST, currency } from "@/utility/constant"
import { DateFormatterWithTime, NumberFormater } from "@/utility/helper"
import { Tag, Typography } from "antd"
import { ColumnsType } from "antd/es/table"
import _ from "lodash"

export const getProjectServicesCol = () => {
  const columns: ColumnsType<BillingItem> = [
    {
      title: "Record No.",
      width: 100,
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
    },
    {
      title: "Balance",
      dataIndex: "remainingBalance",
      align: "right",
      width: 150,
      fixed: "right",
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
  ]

  return columns
}
