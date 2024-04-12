import { ProjectWorkAccomplishItems, Query } from "@/graphql/gql/graphql"
import { gql, useQuery } from "@apollo/client"
import { Table, Typography } from "antd"
import type { ColumnsType } from "antd/es/table"
import Decimal from "decimal.js"
import numeral from "numeral"

const GET_PROJECT_WORK_ACCOMPLISH_ITEMS = gql`
  query ($id: UUID) {
    items: getProjectWorkAccomplishItemsByGroupId(id: $id) {
      id
      itemNo
      unit
      description
      qty
      cost
      payments
      relativeWeight
      prevQty
      thisPeriodQty
      toDateQty
      balanceQty
      prevAmount
      thisPeriodAmount
      toDateAmount
      balanceAmount
      percentage
    }
  }
`
interface WorkAccomplishmentsTableI {
  projectId?: string
}

interface TableSummaryCellI {
  text: string
  index: number
  align?: any
}

export default function WorkAccomplishmentsTable(
  props: WorkAccomplishmentsTableI
) {
  const { data, loading } = useQuery(GET_PROJECT_WORK_ACCOMPLISH_ITEMS, {
    variables: {
      filter: "",
      id: props?.projectId,
    },
    skip: !props?.projectId,
    fetchPolicy: "cache-and-network",
  })

  const columns: ColumnsType<ProjectWorkAccomplishItems> = [
    {
      title: "Item No",
      dataIndex: "itemNo",
      align: "center",
      width: 40,
      fixed: "left",
    },
    {
      title: "Item Description",
      dataIndex: "description",
      width: 100,
      fixed: "left",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      align: "center",
      width: 30,
    },
    {
      title: "ORIGINAL CONTRACT",
      children: [
        {
          title: "Quantity",
          dataIndex: "qty",
          align: "right",
          width: 50,
        },
        {
          title: "Unit Cost",
          dataIndex: "cost",
          align: "right",
          width: 50,
          render: (text: string) => numeral(text).format("0,0.00"),
        },
        {
          title: "Amount",
          dataIndex: "amount",
          align: "right",
          width: 50,
          render: (_: string, record: ProjectWorkAccomplishItems) => {
            const result = new Decimal(record?.qty ?? 0).times(
              new Decimal(record?.cost)
            )

            return numeral(result.toString()).format("0,0.00")
          },
        },
      ],
    },
    {
      title: "RELATIVE WEIGHT",
      dataIndex: "relativeWeight",
      align: "center",
      width: 40,
      render: (text: string) => (text ? `${text}%` : "0%"),
    },
    {
      title: "QUANTITY ACCOMPLISHMENT",
      children: [
        {
          title: "Previous",
          dataIndex: "prevQty",
          align: "right",
          width: 50,
          render: (text: number) => (text > 0 ? text : "-") ?? "-",
        },
        {
          title: "This Period",
          dataIndex: "thisPeriodQty",
          align: "right",
          width: 50,
          render: (text: number) => (text > 0 ? text : "-") ?? "-",
        },
        {
          title: "To Date",
          dataIndex: "toDateQty",
          align: "right",
          width: 50,
          render: (text: number) => (text > 0 ? text : "-") ?? "-",
        },
        {
          title: "Balance",
          dataIndex: "balanceQty",
          align: "right",
          width: 50,
          render: (text: number) => (text > 0 ? text : "-") ?? "-",
        },
      ],
    },
    {
      title: "AMOUNT ACCOMPLISHMENT",
      children: [
        {
          title: "Previous",
          dataIndex: "prevAmount",
          align: "right",
          width: 50,
          render: (text: string) =>
            text ? numeral(text).format("0,0.00") : "-",
        },
        {
          title: "This Period",
          dataIndex: "thisPeriodAmount",
          align: "right",
          width: 50,
          render: (text: string) =>
            text ? numeral(text).format("0,0.00") : "-",
        },
        {
          title: "To Date",
          dataIndex: "toDateAmount",
          align: "right",
          width: 50,
          render: (text: string) =>
            text ? numeral(text).format("0,0.00") : "-",
        },
        {
          title: "Balance",
          dataIndex: "balanceAmount",
          align: "right",
          width: 50,
          render: (text: string) =>
            text ? numeral(text).format("0,0.00") : "-",
        },
      ],
    },
    {
      title: "PERCENTAGE",
      dataIndex: "percentage",
      align: "center",
      width: 50,
      render: (text: string) =>
        text ? `${numeral(text).format("0.00")}%` : "-",
    },
  ]

  const TableSummaryCell = ({ text, index, align }: TableSummaryCellI) => {
    return (
      <Table.Summary.Cell index={index} align={align ?? "right"}>
        <Typography.Text type="success">{text}</Typography.Text>
      </Table.Summary.Cell>
    )
  }

  return (
    <Table
      columns={columns}
      dataSource={data?.items ?? []}
      bordered
      size="small"
      scroll={{ x: "calc(1600px + 50%)" }}
      summary={(pageData) => {
        let totalAmount = 0
        let totalRelativeWeight = 0
        let totalPrevAmount = 0
        let totalToDateAmount = 0
        let totalThisPeriodAmount = 0
        let totalBalanceAmount = 0
        let totalPercentage = 0

        pageData.forEach(
          ({
            cost,
            qty,
            relativeWeight,
            prevAmount,
            thisPeriodAmount,
            toDateAmount,
            balanceAmount,
            percentage,
          }) => {
            const amount = new Decimal(cost).times(new Decimal(qty ?? 0))

            const currentTotalAmount = new Decimal(totalAmount ?? 0)
              .plus(amount)
              .toString()

            const currentRelativeWeight = new Decimal(relativeWeight ?? 0)
              .plus(new Decimal(totalRelativeWeight))
              .toString()

            const currentTotalPrevAmount = new Decimal(prevAmount ?? 0)
              .plus(new Decimal(totalPrevAmount))
              .toString()

            const currentTotalToDateAmount = new Decimal(toDateAmount ?? 0)
              .plus(new Decimal(totalToDateAmount))
              .toString()

            const currentTotalThisPeriodAmount = new Decimal(
              thisPeriodAmount ?? 0
            )
              .plus(new Decimal(totalThisPeriodAmount))
              .toString()

            const currentTotalBalanceAmount = new Decimal(balanceAmount ?? 0)
              .plus(new Decimal(totalBalanceAmount))
              .toString()

            const currentTotalPercentage = new Decimal(percentage ?? 0)
              .plus(new Decimal(totalPercentage))
              .toString()

            totalAmount = parseFloat(currentTotalAmount)
            totalRelativeWeight = parseFloat(currentRelativeWeight)

            totalPrevAmount = parseFloat(currentTotalPrevAmount)
            totalToDateAmount = parseFloat(currentTotalToDateAmount)
            totalThisPeriodAmount = parseFloat(currentTotalThisPeriodAmount)
            totalBalanceAmount = parseFloat(currentTotalBalanceAmount)
            totalPercentage = parseFloat(currentTotalPercentage)
          }
        )

        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2} align={"center"}>
                Total
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} colSpan={3} />
              <TableSummaryCell
                text={numeral(totalAmount).format("0,0.00")}
                index={5}
              />
              <TableSummaryCell
                text={`${numeral(totalRelativeWeight).format("0,0.00")}%`}
                index={6}
                align={"center"}
              />
              <Table.Summary.Cell index={7} colSpan={4} />
              <TableSummaryCell
                text={numeral(totalPrevAmount).format("0,0.00")}
                index={8}
              />
              <TableSummaryCell
                text={numeral(totalThisPeriodAmount).format("0,0.00")}
                index={9}
              />
              <TableSummaryCell
                text={numeral(totalToDateAmount).format("0,0.00")}
                index={10}
              />
              <TableSummaryCell
                text={numeral(totalBalanceAmount).format("0,0.00")}
                index={11}
              />
              <TableSummaryCell
                text={`${numeral(totalPercentage).format("0,0.00")}%`}
                index={12}
                align={"center"}
              />
            </Table.Summary.Row>
          </>
        )
      }}
    />
  )
}
