import { FormDateRange, FormInput, FormSelect } from "@/components/common"
// import {
//   ChartOfAccount,
//   GeneralLedgerDetailsListDto,
// } from '@/graphql/gql/graphql'
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
  Table,
} from "antd"
import type { TableProps } from "antd"
import dayjs from "dayjs"
import numeral from "numeral"
import type { ColumnsType } from "antd/es/table"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { getUrlPrefix } from "@/utility/graphql-client"

interface RecordType {
  code: string
  accountName: string
  debit: number
  credit: number
}

const GL_GQL = gql`
  query (
    $filter: String
    $account: String
    $startDate: String
    $endDate: String
  ) {
    generalLedger: generateGeneralLedgerDetails(
      filter: $filter
      account: $account
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      code
      transaction_date: account
      children: content
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

interface DataType {
  transaction_date: string
  description: string
  debit: number
  credit: number
  net_amount: number
  children?: DataType[]
}

function reformatNegativeAmounts(amount: number) {
  if (amount > 0) return numeral(amount).format("0,0.00")
  else return "(" + numeral(Math.abs(amount)).format("0,0.00") + ")"
}

export default function GeneralLedgerRoute() {
  const {
    query: { account },
  } = useRouter()

  const [form] = Form.useForm()
  const [onLoadGL, { data, loading, refetch }] = useLazyQuery(GL_GQL, {
    notifyOnNetworkStatusChange: true,
  })

  const sharedOnCell = (record: any) => {
    if ((record?.children ?? []).length > 0) {
      return { colSpan: 0 }
    }

    return {}
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Date",
      dataIndex: "transaction_date",
      width: 80,
      fixed: "left",
      onCell: (record: any, index) => ({
        colSpan:
          (record?.children ?? []).length > 0
            ? 6
            : record?.description == "TOTAL"
            ? 2
            : 1,
      }),
      render: (text: string, record: any) =>
        (record?.children ?? []).length > 0 ? (
          <b>{`${record?.code} - ${text}`}</b>
        ) : record?.description == "TOTAL" ? (
          <b>{text}</b>
        ) : (
          text
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 200,
      fixed: "left",
      onCell: (record: any, index) => ({
        colSpan:
          (record?.children ?? []).length > 0
            ? 0
            : record?.description == "TOTAL"
            ? 0
            : 1,
      }),
    },
    {
      title: "Reference",
      dataIndex: "reference",
      width: 150,
      onCell: sharedOnCell,
    },
    {
      title: "Debit",
      dataIndex: "debit",
      align: "right",
      width: 100,
      onCell: sharedOnCell,
      render: (text, record) =>
        record?.description == "TOTAL" ? (
          <b>{text ? reformatNegativeAmounts(text) : "-"}</b>
        ) : text ? (
          reformatNegativeAmounts(text)
        ) : (
          "-"
        ),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      align: "right",
      width: 100,
      onCell: sharedOnCell,
      render: (text, record) =>
        record?.description == "TOTAL" ? (
          <b>{text ? reformatNegativeAmounts(text) : "-"}</b>
        ) : text ? (
          reformatNegativeAmounts(text)
        ) : (
          "-"
        ),
    },
    {
      title: "Running Balance",
      dataIndex: "running_balance",
      align: "right",
      width: 100,
      onCell: sharedOnCell,
      render: (text, record) =>
        record?.description == "TOTAL" ? (
          <b>{text ? reformatNegativeAmounts(text) : "-"}</b>
        ) : text ? (
          reformatNegativeAmounts(text)
        ) : (
          "-"
        ),
    },
  ]

  const onHandleUpdate = (filter?: string) => {
    const { dateRange } = form.getFieldsValue()
    const startDate = dayjs(dateRange[0]).startOf("day").format("YYYY-MM-DD")
    const endDate = dayjs(dateRange[1]).endOf("day").format("YYYY-MM-DD")

    onLoadGL({
      variables: {
        filter: filter ?? "",
        account,
        startDate,
        endDate,
      },
      nextFetchPolicy: "network-only",
    })
  }

  const onHandleDownloadCSV = () => {
    const { dateRange } = form.getFieldsValue()
    const startDate = dayjs(dateRange[0]).startOf("day").format("YYYY-MM-DD")
    const endDate = dayjs(dateRange[1]).endOf("day").format("YYYY-MM-DD")

    let apiURL =
      "/general-ledger-reports/ledger-details?" +
      "startDate=" +
      startDate +
      "&endDate=" +
      endDate +
      "&account=" +
      account
    window.open(getUrlPrefix() + apiURL, "_blank")
  }

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
        filter: "",
        account,
        startDate: dateRange?.startDate,
        endDate: dateRange?.endDate,
      },
      nextFetchPolicy: "network-only",
    })
  }, [onLoadGL, account, form])

  return (
    <PageContainer content="General Ledger Details">
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
            <Col span={4}>
              <FormInput
                label="Search"
                name="filter"
                propsinput={{
                  onPressEnter: (e: any) => onHandleUpdate(e.target.value),
                }}
              />
            </Col>
          </Row>
        </Form>
        <Table
          // virtual={true}
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
          rowKey={"id"}
          size="small"
          dataSource={data?.generalLedger ?? []}
          pagination={false}
        />
      </Space>
    </PageContainer>
  )
}
