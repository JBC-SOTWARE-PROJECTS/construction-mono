import { FormDateRange, FormInput, FormSelect } from '@/components/common'
// import { ChartOfAccount } from '@/graphql/gql/graphql'
import { PlusOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useQuery } from '@apollo/client'
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
} from 'antd'
import type { TableProps } from 'antd'
import dayjs from 'dayjs'
import numeral from 'numeral'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import Decimal from 'decimal.js'
import { useRouter } from 'next/router'
import { apiUrlPrefix } from '@/shared/settings'
import { getUrlPrefix } from '@/utility/graphql-client'
interface RecordType {
  code: string
  accountName: string
  debit: number
  credit: number
  netAmount: number
}

const GL_GQL = gql`
  query ($accounts: [String], $startDate: String, $endDate: String) {
    generalLedger: generateGeneralLedgerSummary(
      accounts: $accounts
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
  if (amount > 0) return numeral(amount).format('0,0.00')
  else return '(' + numeral(Math.abs(amount)).format('0,0.00') + ')'
}

export default function GeneralLedgerRoute() {
  const router = useRouter()
  const [form] = Form.useForm()

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { data, loading, refetch } = useQuery(GL_GQL, {
    variables: {
      accounts: [] as React.Key[],
      startDate: dayjs().startOf('month').startOf('day').format('YYYY-MM-DD'),
      endDate: dayjs().endOf('month').endOf('day').format('YYYY-MM-DD'),
    },
    nextFetchPolicy: 'network-only',
  })

  const {
    data: coaListData,
    refetch: refetchCoa,
    loading: loadingCoa,
  } = useQuery(COA_GQL, {
    variables: {
      filter: '',
    },
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
    const startDate = dayjs(dateRange[0]).startOf('day').format('YYYY-MM-DD')
    const endDate = dayjs(dateRange[1]).endOf('day').format('YYYY-MM-DD')

    localStorage.setItem(account, JSON.stringify({ startDate, endDate }))
    window.open(
      '/accounting/reports/essential/general-ledger/summary-details/' + account,
      `general-ledger-${account}`
    )
  }

  const columns: TableProps<RecordType>['columns'] = [
    {
      title: 'Code',
      dataIndex: 'code',
      width: 50,
      fixed: 'left',
    },
    {
      title: 'Account',
      dataIndex: 'accountName',
      width: 200,
      fixed: 'left',
      render: (text: string, record: RecordType) => (
        <a onClick={() => onHandleClickAccounts(record.code)}>{text}</a>
      ),
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      align: 'right',
      width: 100,
      render: (text) => (text ? reformatNegativeAmounts(text) : '-'),
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      align: 'right',
      width: 100,
      render: (text) => (text ? reformatNegativeAmounts(text) : '-'),
    },
    {
      title: 'Net Movement',
      dataIndex: 'netAmount',
      align: 'right',
      width: 100,
      render: (text) => (text ? reformatNegativeAmounts(text) : '-'),
    },
  ]

  const onHandleUpdate = () => {
    const { dateRange } = form.getFieldsValue()
    const startDate = dayjs(dateRange[0]).startOf('day').format('YYYY-MM-DD')
    const endDate = dayjs(dateRange[1]).endOf('day').format('YYYY-MM-DD')

    const numberOfCOARecords = (coaListData?.coaListWithFilter ?? []).length
    const numberOfSelectedCOA = (selectedRowKeys ?? []).length
    if (numberOfCOARecords == numberOfSelectedCOA)
      refetch({ accounts: [], startDate, endDate })
    else
      refetch({ accounts: selectedRowKeys as React.Key[], startDate, endDate })
  }

  const onHandleDownloadCSV = () => {
    const { dateRange } = form.getFieldsValue()
    const startDate = dayjs(dateRange[0]).startOf('day').format('YYYY-MM-DD')
    const endDate = dayjs(dateRange[1]).endOf('day').format('YYYY-MM-DD')

    let apiURL =
      '/general-ledger-reports/summary?' +
      'startDate=' +
      startDate +
      '&endDate=' +
      endDate

    const numberOfCOARecords = (coaListData?.coaListWithFilter ?? []).length
    const numberOfSelectedCOA = (selectedRowKeys ?? []).length
    if (numberOfCOARecords !== numberOfSelectedCOA)
      selectedRowKeys.map((keys) => {
        apiURL += `&accounts=${keys}`
      })
    else apiURL += `&accounts=`

    console.log(apiURL, 'apiURL')
    window.open(getUrlPrefix() + apiURL, '_blank')
  }

  const accountColumns: ColumnsType<any> = [
    {
      title: 'Select all',
      dataIndex: 'description',
    },
  ]

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const hasSelected = selectedRowKeys.length > 0

  return (
    <PageContainer content='General Ledger Summary'>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Form
          form={form}
          layout='vertical'
          initialValues={{
            dateRange: [
              dayjs().startOf('month').startOf('day'),
              dayjs().endOf('month').endOf('day'),
            ],
          }}
        >
          <Row justify='start' gutter={[16, 16]}>
            {/* <Col span={6}>
              <FormSelect
                label='Parent Accounts'
                name='accounts'
                propsselect={{
                  placeholder: hasSelected
                    ? `Selected ${selectedRowKeys.length} items`
                    : '',
                  options: [],
                  dropdownRender: (menu: any) => {
                    return (
                      <Table
                        loading={loadingCoa}
                        size='small'
                        rowKey='description'
                        scroll={{ y: 500 }}
                        pagination={false}
                        rowSelection={{
                          type: 'checkbox',
                          ...rowSelection,
                        }}
                        columns={accountColumns}
                        dataSource={coaListData?.coaListWithFilter ?? []}
                      />
                    )
                  },
                }}
              />
            </Col> */}
            <Col span={4}>
              <FormDateRange
                label='Date Range'
                name='dateRange'
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
              <Button onClick={() => onHandleUpdate()} type='primary'>
                Update
              </Button>
              <Button
                onClick={() => onHandleDownloadCSV()}
                type='dashed'
                danger
              >
                Download CSV
              </Button>
            </Space>
          )}
          loading={loading}
          columns={columns}
          scroll={{ x: 1500, y: 500 }}
          rowKey='id'
          size='small'
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
              <Table.Summary fixed={'bottom'}>
                <Table.Summary.Row style={{ paddingRight: '16px' }}>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <b>TOTAL</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align='right'>
                    <b>{reformatNegativeAmounts(totals.totalDebit)}</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align='right'>
                    <b>{reformatNegativeAmounts(totals.totalCredit)}</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align='right'>
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
