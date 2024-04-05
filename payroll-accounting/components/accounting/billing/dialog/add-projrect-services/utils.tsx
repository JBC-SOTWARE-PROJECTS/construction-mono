import { ProjectCost } from "@/graphql/gql/graphql"
import { REVISIONS_COST } from "@/utility/constant"
import { DateFormatterWithTime, NumberFormater } from "@/utility/helper"
import { Tag, Typography } from "antd"
import { ColumnsType } from "antd/es/table"
import _ from "lodash"

export const getProjectServicesCol = () => {
  const columns: ColumnsType<ProjectCost> = [
    {
      title: "Item No",
      dataIndex: "itemNo",
      key: "itemNo",
      width: 80,
      align: "center",
      fixed: "left",
      render: (itemNo, record) => {
        if (record.status) {
          return <span>{itemNo}</span>
        } else {
          return (
            <Typography.Text delete type="danger">
              {itemNo}
            </Typography.Text>
          )
        }
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      // width: 200,
      render: (text, record) => {
        if (record.status) {
          return <span>{text}</span>
        } else {
          return (
            <Typography.Text delete type="danger">
              {text}
            </Typography.Text>
          )
        }
      },
    },
    {
      title: "Qty/Unit",
      dataIndex: "qty",
      key: "qty",
      width: 120,
      align: "right",
      render: (qty, record) => {
        if (record.status) {
          return <span>{`${NumberFormater(qty)} [${record.unit}]`}</span>
        } else {
          return (
            <Typography.Text delete type="danger">
              {`${NumberFormater(qty)} [${record.unit}]`}
            </Typography.Text>
          )
        }
      },
    },
    {
      title: "Unit Price",
      dataIndex: "cost",
      key: "cost",
      width: 120,
      align: "right",
      render: (cost, record) => {
        if (record.status) {
          return <span>{NumberFormater(cost)}</span>
        } else {
          return (
            <Typography.Text delete type="danger">
              {NumberFormater(cost)}
            </Typography.Text>
          )
        }
      },
    },
    {
      title: "Tag",
      dataIndex: "tagNo",
      key: "tagNo",
      width: 120,
      align: "center",
      render: (tagNo) => {
        if (tagNo) {
          let obj = _.find(REVISIONS_COST, { value: tagNo })
          return (
            <Tag color="cyan" bordered={false}>
              {obj?.label}
            </Tag>
          )
        } else {
          return "--"
        }
      },
    },
    {
      title: "Total",
      dataIndex: "totalCost",
      key: "totalCost",
      width: 120,
      align: "right",
      render: (totalCost, record) => {
        if (record.status) {
          return <span>{NumberFormater(totalCost)}</span>
        } else {
          return (
            <Typography.Text delete type="danger">
              {NumberFormater(totalCost)}
            </Typography.Text>
          )
        }
      },
    },
    {
      title: "Previous Qty",
      dataIndex: "relativeWeight",
      align: "right",
      width: 100,
    },
    {
      title: "This Period Qty",
      dataIndex: "relativeWeight",
      align: "right",
      width: 120,
      fixed: "right",
    },
    {
      title: "RW (%)",
      dataIndex: "relativeWeight",
      key: "relativeWeight",
      width: 70,
      align: "right",
      fixed: "right",
      render: (relativeWeight, record) => {
        if (record.status) {
          return <span>{NumberFormater(relativeWeight) + "%"}</span>
        } else {
          return (
            <Typography.Text delete type="danger">
              {NumberFormater(relativeWeight) + "%"}
            </Typography.Text>
          )
        }
      },
    },
  ]

  return columns
}
