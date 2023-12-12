import { FormDateRange } from '@/components/common'
import FormSwitch from '@/components/common/formSwitch/formSwitch'
import JournalEntries from '@/components/accounting/transaction-journal/journalEntries'
import { HeaderLedgerGroupDto } from '@/graphql/gql/graphql'
import { useDialog } from '@/hooks'
import ConfirmationPasswordHook from '@/hooks/promptPassword'
import { dateFormat } from '@/utility/constant'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Pagination,
  Popconfirm,
  Space,
  Spin,
  Table,
  App,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import _ from 'lodash'
import numeral from 'numeral'

const GET_RECORDS = gql`
  query (
    $showAll: Boolean
    $filter: String
    $journalType: String
    $startDate: Instant
    $endDate: Instant
    $page: Int
    $size: Int
  ) {
    transactionJournalGroupQuery(
      showAll: $showAll
      filter: $filter
      journalType: $journalType
      startDate: $startDate
      endDate: $endDate
      page: $page
      size: $size
    ) {
      id
      referenceNo
      entityName
      journalType
      otherDetail
      notApproved
      approved
    }
  }
`

const GET_TOTAL_RECORDS = gql`
  query (
    $showAll: Boolean
    $filter: String
    $journalType: String
    $startDate: Instant
    $endDate: Instant
  ) {
    totalElements: transactionJournalGroupQueryTotalPage(
      showAll: $showAll
      filter: $filter
      journalType: $journalType
      startDate: $startDate
      endDate: $endDate
    )
  }
`

const POST_BY_FILTER = gql`
  mutation ($journalType: String, $startDate: String, $endDate: String) {
    data: approveAllLedgerByTypeAndDate(
      journalType: $journalType
      startDate: $startDate
      endDate: $endDate
    ) {
      message
      payload
      returnId
      success
    }
  }
`

export interface TransactionJournalI {
  journalType: string
  roles: string[]
}

interface HeaderLedgerGroupDtoI extends HeaderLedgerGroupDto {
  id: string
}

export default function TransactionJournal(props: TransactionJournalI) {
  const { message } = App.useApp()
  const { journalType, roles } = props
  const [form] = Form.useForm()
  const [showPasswordConfirmation] = ConfirmationPasswordHook()

  const isAuditorAdmin = _.some(roles, (item) =>
    _.includes(['ROLE_ACCOUNTING_ADMIN', 'ROLE_ADMIN'], item)
  )

  const journalEntriesDialog = useDialog(JournalEntries)

  const [onLoadJournal, { loading, data, refetch, fetchMore }] =
    useLazyQuery(GET_RECORDS)

  const [
    onLoadJournalTotal,
    { loading: onLoadTotalLoading, data: onLoadTotal },
  ] = useLazyQuery(GET_TOTAL_RECORDS)

  const [postByFilterMutation, { loading: postByFilterMutationLoading }] =
    useMutation(POST_BY_FILTER, {
      onCompleted: (returnedResult) => {
        if (returnedResult?.data?.success) {
          message.success(
            `${`Updated records ${numeral(
              returnedResult?.data?.payload || 0
            ).format('0,0')}`}`
          )
          refetch()
        } else {
          message.error(returnedResult?.data?.message)
        }
      },
    })

  const onHandlePostByDateRange = () => {
    const { journalDate } = form.getFieldsValue()
    showPasswordConfirmation(() => {
      postByFilterMutation({
        variables: {
          journalType,
          startDate: dayjs(journalDate[0]).startOf('day'),
          endDate: dayjs(journalDate[1]).endOf('day'),
        },
      })
    })
  }

  const onLoadJournalEntries = (filterText?: string) => {
    const { journalDate, showAll } = form.getFieldsValue()
    onLoadJournal({
      variables: {
        showAll,
        filter: filterText ?? '',
        startDate: dayjs(journalDate[0]).startOf('day'),
        endDate: dayjs(journalDate[1]).endOf('day'),
        journalType,
        page: 0,
        size: 50,
      },
    }).then(() => {
      onLoadJournalTotal({
        variables: {
          showAll,
          filter: filterText ?? '',
          startDate: dayjs(journalDate[0]).startOf('day'),
          endDate: dayjs(journalDate[1]).endOf('day'),
          journalType,
        },
      })
    })
  }

  const onPageChange = (page: number) => {
    const { journalDate } = form.getFieldsValue()
    onLoadJournal({
      variables: {
        startDate: dayjs(journalDate[0]).startOf('day'),
        endDate: dayjs(journalDate[1]).endOf('day'),
        journalType,
        page: page - 1,
        size: 50,
      },
    })
  }

  const onHandleShowLedger = (record: HeaderLedgerGroupDtoI) => {
    const { journalDate } = form.getFieldsValue()
    journalEntriesDialog(
      {
        groupId: record.id,
        entityName: record?.entityName,
        startDate: dayjs(journalDate[0]).startOf('day'),
        endDate: dayjs(journalDate[1]).endOf('day'),
        journalType,
        isAuditorAdmin,
      },
      () => {
        onLoadJournalEntries()
      }
    )
  }

  // const onHandleDownloadAll = () => {
  //   const { journalDate } = form.getFieldsValue()
  //   window.open(
  //     getUrlPrefix() +
  //       '/api/ledgerAllDownload?journalType=' +
  //       journalType +
  //       '&fromDate=' +
  //       dayjs(journalDate[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]') +
  //       '&toDate=' +
  //       dayjs(journalDate[1]).endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
  //     '_blank'
  //   )
  // }

  // const onHandleDownloadPosted = () => {
  //   const { journalDate } = form.getFieldsValue()
  //   window.open(
  //     getUrlPrefix() +
  //       '/api/ledgerAllDownload?posted=true&journalType=' +
  //       journalType +
  //       '&fromDate=' +
  //       dayjs(journalDate[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]') +
  //       '&toDate=' +
  //       dayjs(journalDate[1]).endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
  //     '_blank'
  //   )
  // }

  const columns: ColumnsType<HeaderLedgerGroupDtoI> = [
    {
      title: 'Reference No',
      dataIndex: 'referenceNo',
      key: 'referenceNo',
      width: 200,
      fixed: 'left',
      render: (text, record: HeaderLedgerGroupDtoI) => (
        <a onClick={() => onHandleShowLedger(record)}>{text}</a>
      ),
    },
    {
      title: 'Entity Name',
      dataIndex: 'entityName',
      key: 'entityName',
    },
    // {
    //   title: 'OTHER DETAIL',
    //   dataIndex: 'otherDetail',
    //   key: 'otherDetail',
    // },
    {
      title: 'POSTED',
      dataIndex: 'approved',
      key: 'approved',
      width: 120,
    },
    {
      title: 'FOR POSTING',
      dataIndex: 'notApproved',
      key: 'notApproved',
      width: 150,
    },
  ]

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a
          target='_blank'
          // onClick={() => onHandleDownloadPosted()}
        >
          Generate CSV File (Posted Only)
        </a>
      ),
    },
  ]

  return (
    <>
      <Divider style={{ marginTop: 0 }} dashed />
      <Form
        form={form}
        initialValues={{
          journalDate: [
            dayjs().startOf('month').startOf('day'),
            dayjs().endOf('month').endOf('day'),
          ],
          showAll: false,
        }}
      >
        <Space direction='vertical' style={{ width: '100%', marginBottom: 5 }}>
          <Space align='baseline'>
            <FormDateRange
              label='Journal Date'
              name='journalDate'
              showpresstslist={true}
              propsrangepicker={{
                format: dateFormat,
              }}
            />
            <Button onClick={() => onLoadJournalEntries()} type='primary'>
              Browse Journal
            </Button>
            <Popconfirm
              title='Confirm Posting Entries'
              description='Are you sure you want to post all entries within the selected date range?'
              onConfirm={onHandlePostByDateRange}
              okText='Yes'
              cancelText='No'
            >
              <Button type='primary' loading={postByFilterMutationLoading}>
                Post Entries
              </Button>
            </Popconfirm>
          </Space>
          <Space align='baseline'>
            <FormSwitch
              valuePropName='checked'
              name='showAll'
              label='Show Posted Entries'
              switchprops={{
                defaultChecked: true,
                onChange: (e) => {
                  onLoadJournalEntries()
                },
              }}
            />
            <Dropdown.Button
              menu={{ items }}
              //  onClick={onHandleDownloadAll}
            >
              Generate CSV File
            </Dropdown.Button>
          </Space>
        </Space>
      </Form>

      <Table
        rowKey={(record) => `${record?.referenceNo}-${record?.entityName}`}
        title={() => (
          <Input.Search
            placeholder='Search... '
            onSearch={(e) => onLoadJournalEntries(e)}
          />
        )}
        columns={columns}
        loading={loading}
        dataSource={data?.transactionJournalGroupQuery ?? ([] as any)}
        pagination={false}
        footer={() =>
          onLoadTotalLoading ? (
            <Spin />
          ) : (
            <Pagination
              showSizeChanger={false}
              pageSize={50}
              responsive={true}
              total={onLoadTotal?.totalElements ?? 0}
              onChange={(page) => onPageChange(page)}
            />
          )
        }
        scroll={{ y: 400 }}
        size='small'
      />
    </>
  )
}
