import { FormDateRange, FormInput, FormSelect } from "@/components/common"
// import { ChartOfAccount } from '@/graphql/gql/graphql'
import { PlusOutlined } from "@ant-design/icons"
import { PageContainer } from "@ant-design/pro-components"
import { gql, useLazyQuery, useQuery } from "@apollo/client"
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  List,
  Row,
  Space,
  Switch,
  Table,
} from "antd"
import type { TableProps } from "antd"
import dayjs from "dayjs"
import numeral from "numeral"
import type { ColumnsType } from "antd/es/table"
import { useEffect, useState } from "react"
import Decimal from "decimal.js"
import { useRouter } from "next/router"
import { getUrlPrefix } from "@/utility/graphql-client"

interface RecordType {
  code: string
  accountName: string
  debit: number
  credit: number
  netAmount: number
}

const GL_GQL = gql`
  query ($account: String, $startDate: String, $endDate: String) {
    generalLedger: generateGeneralLedgerDetailedSummary(
      account: $account
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      motherAccount
      code
      accountName
      debit
      credit
      netAmount
    }
  }
`
const COA_GQL = gql`
  query ($filter: String) {
    coaListWithFilter(filter: $filter) {
      id
      description
    }
  }
`

function reformatNegativeAmounts(amount: number) {
  if (amount > 0) return numeral(amount).format("0,0.00")
  else return "(" + numeral(Math.abs(amount)).format("0,0.00") + ")"
}

export default function GeneralLedgerRoute() {
  const {
    query: { account },
  } = useRouter()

  const [form] = Form.useForm()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [onLoadGL, { data, loading, refetch }] = useLazyQuery(GL_GQL)

  const {
    data: coaListData,
    refetch: refetchCoa,
    loading: loadingCoa,
  } = useQuery(COA_GQL, {
    variables: {
      filter: "",
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ coaListWithFilter }) => {
      if (coaListWithFilter) {
        setSelectedRowKeys([
          ...(coaListWithFilter ?? []).map((coa: any) => coa.id),
        ])
      }
    },
  })

  const onHandleClickAccounts = (account: string) => {
    const { dateRange } = form.getFieldsValue()
    const startDate = dayjs(dateRange[0]).startOf("day").format("YYYY-MM-DD")
    const endDate = dayjs(dateRange[1]).endOf("day").format("YYYY-MM-DD")

    localStorage.setItem(account, JSON.stringify({ startDate, endDate }))
    window.open(
      "/accounting/reports/essential/general-ledger/ledger-details/" + account,
      `general-ledger-summary-details-${account}`
    )
  }

  const onHandleDownloadCSV = () => {
    const { dateRange } = form.getFieldsValue()
    const startDate = dayjs(dateRange[0]).startOf("day").format("YYYY-MM-DD")
    const endDate = dayjs(dateRange[1]).endOf("day").format("YYYY-MM-DD")

    let apiURL =
      "/general-ledger-reports/summary-details?" +
      "startDate=" +
      startDate +
      "&endDate=" +
      endDate +
      "&account=" +
      account
    window.open(getUrlPrefix() + apiURL, "_blank")
  }

  const columns: TableProps<RecordType>["columns"] = [
    {
      title: "Code",
      dataIndex: "code",
      width: 50,
      fixed: "left",
    },
    {
      title: "Account",
      dataIndex: "accountName",
      width: 200,
      fixed: "left",
      render: (text: string, record: RecordType) => (
        <a onClick={() => onHandleClickAccounts(record.code)}>{text}</a>
      ),
    },
    {
      title: "Debit",
      dataIndex: "debit",
      align: "right",
      width: 100,
      render: (text) => (text ? reformatNegativeAmounts(text) : "-"),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      align: "right",
      width: 100,
      render: (text) => (text ? reformatNegativeAmounts(text) : "-"),
    },
    {
      title: "Net Movement",
      dataIndex: "netAmount",
      align: "right",
      width: 100,
      render: (text) => (text ? reformatNegativeAmounts(text) : "-"),
    },
  ]

  const onHandleUpdate = () => {
    const { dateRange } = form.getFieldsValue()
    const startDate = dayjs(dateRange[0]).startOf("day").format("YYYY-MM-DD")
    const endDate = dayjs(dateRange[1]).endOf("day").format("YYYY-MM-DD")

    const numberOfCOARecords = (coaListData?.coaListWithFilter ?? []).length
    const numberOfSelectedCOA = (selectedRowKeys ?? []).length
    if (numberOfCOARecords == numberOfSelectedCOA)
      refetch({ startDate, endDate })
    else refetch({ startDate, endDate })
  }
  const accountColumns: ColumnsType<any> = [
    {
      title: "Select all",
      dataIndex: "description",
    },
  ]

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const hasSelected = selectedRowKeys.length > 0

  useEffect(() => {
    const dateRange = JSON.parse(
      localStorage.getItem(account as string) ?? "{}"
    )

    form.setFieldValue("dateRange", [
      dayjs(dateRange?.startDate).startOf("day"),
      dayjs(dateRange?.endDate).endOf("day"),
    ])

    onLoadGL({
      variables: {
        account,
        startDate: dateRange?.startDate,
        endDate: dateRange?.endDate,
      },
      nextFetchPolicy: "network-only",
    })
  }, [onLoadGL, account, form])

  return (
    <PageContainer content="General Ledger Summary Details">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            dateRange: [
              dayjs().startOf("month").startOf("day"),
              dayjs().endOf("month").endOf("day"),
            ],
          }}
        >
          <Row justify="start" gutter={[16, 16]}>
            <Col span={4}>
              <FormDateRange
                label="Date Range"
                name="dateRange"
                showpresstslist={true}
                propsrangepicker={{
                  allowClear: false,
                }}
              />
            </Col>
          </Row>
        </Form>
        <Table
          title={() => (
            <Space>
              <Button onClick={() => onHandleUpdate()} type="primary">
                Update
              </Button>
              <Button
                onClick={() => onHandleDownloadCSV()}
                type="dashed"
                danger
              >
                Download CSV
              </Button>
            </Space>
          )}
          loading={loading}
          columns={columns}
          scroll={{ x: 1500, y: 500 }}
          rowKey="id"
          size="small"
          dataSource={data?.generalLedger ?? []}
          pagination={false}
          summary={(currentData) => {
            const totals = (currentData ?? []).reduce(
              (summary, { debit, credit, netAmount }) => {
                summary.totalDebit = new Decimal(summary.totalDebit)
                  .add(new Decimal(debit))
                  .toNumber()
                summary.totalCredit = new Decimal(summary.totalCredit)
                  .add(new Decimal(credit))
                  .toNumber()
                summary.totalNetAmount = new Decimal(summary.totalNetAmount)
                  .add(new Decimal(netAmount))
                  .toNumber()
                return summary
              },
              { totalDebit: 0, totalCredit: 0, totalNetAmount: 0 }
            )

            return (
              <Table.Summary fixed={"bottom"}>
                <Table.Summary.Row style={{ paddingRight: "16px" }}>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <b>TOTAL</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    <b>{reformatNegativeAmounts(totals.totalDebit)}</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    <b>{reformatNegativeAmounts(totals.totalCredit)}</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="right">
                    <b>{reformatNegativeAmounts(totals.totalNetAmount)}</b>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          }}
        />
      </Space>
    </PageContainer>
  )
}
