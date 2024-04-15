import JournalEntries from "@/components/accounting/transaction-journal/features/transaction-journal-page/journal-entries"
import { FormDateRange } from "@/components/common"
import FormSwitch from "@/components/common/formSwitch/formSwitch"
import { HeaderLedgerGroupDto } from "@/graphql/gql/graphql"
import { useDialog } from "@/hooks"
import ConfirmationPasswordHook from "@/hooks/promptPassword"
import { dateFormat } from "@/utility/constant"
import { gql, useLazyQuery, useMutation } from "@apollo/client"
import {
  App,
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
} from "antd"
import dayjs from "dayjs"
import _ from "lodash"
import numeral from "numeral"
import ManualJournalEntriesModal from "../../dialogs/manual-journal-entries"
import { getTransactionJournalPageCol } from "./utils"
import PageFilterContainer from "@/components/common/custom-components/page-filter-container"

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
      docNo
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

export default function TransactionJournalPage(props: TransactionJournalI) {
  const { journalType, roles } = props
  const [form] = Form.useForm()
  const { message } = App.useApp()

  const [showPasswordConfirmation] = ConfirmationPasswordHook()
  const manualEntriesDialog = useDialog(ManualJournalEntriesModal)

  const isAuditorAdmin = _.some(roles, (item) =>
    _.includes(["ROLE_ACCOUNTING_ADMIN", "ROLE_ADMIN"], item)
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
            ).format("0,0")}`}`
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
          startDate: dayjs(journalDate[0]).startOf("day"),
          endDate: dayjs(journalDate[1]).endOf("day"),
        },
      })
    })
  }

  const onLoadJournalEntries = (filterText?: string) => {
    const { journalDate, showAll } = form.getFieldsValue()
    onLoadJournal({
      variables: {
        showAll,
        filter: filterText ?? "",
        startDate: dayjs(journalDate[0]).startOf("day"),
        endDate: dayjs(journalDate[1]).endOf("day"),
        journalType,
        page: 0,
        size: 50,
      },
    }).then(() => {
      onLoadJournalTotal({
        variables: {
          showAll,
          filter: filterText ?? "",
          startDate: dayjs(journalDate[0]).startOf("day"),
          endDate: dayjs(journalDate[1]).endOf("day"),
          journalType,
        },
      })
    })
  }

  const onPageChange = (page: number) => {
    const { journalDate } = form.getFieldsValue()
    onLoadJournal({
      variables: {
        startDate: dayjs(journalDate[0]).startOf("day"),
        endDate: dayjs(journalDate[1]).endOf("day"),
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
        startDate: dayjs(journalDate[0]).startOf("day"),
        endDate: dayjs(journalDate[1]).endOf("day"),
        journalType,
        isAuditorAdmin,
      },
      () => {
        onLoadJournalEntries()
      }
    )
  }

  const onCreateManualEntries = () => {
    manualEntriesDialog(
      { custom: true, journalType: props.journalType },
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

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
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
            dayjs().startOf("month").startOf("day"),
            dayjs().endOf("month").endOf("day"),
          ],
          showAll: false,
        }}
        style={{ marginBottom: 10 }}
      >
        <Space direction="vertical" style={{ width: "100%", marginBottom: 5 }}>
          <Space align="baseline">
            <FormDateRange
              label="Journal Date"
              name="journalDate"
              showpresstslist={true}
              propsrangepicker={{
                format: dateFormat,
              }}
            />
            <Button onClick={() => onLoadJournalEntries()} type="primary">
              Browse Journal
            </Button>
          </Space>
          <PageFilterContainer
            leftSpace={
              <Space align="baseline">
                <FormSwitch
                  valuePropName="checked"
                  name="showAll"
                  label="Show Posted Entries"
                  switchprops={{
                    defaultChecked: true,
                    onChange: (e) => {
                      onLoadJournalEntries()
                    },
                  }}
                />
                {/* <Dropdown.Button
              menu={{ items }}
              //  onClick={onHandleDownloadAll}
            >
              Generate CSV File
            </Dropdown.Button> */}
              </Space>
            }
            rightSpace={
              <Space>
                <Popconfirm
                  title="Confirm Posting Entries"
                  description="Are you sure you want to post all entries within the selected date range?"
                  onConfirm={onHandlePostByDateRange}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" loading={postByFilterMutationLoading}>
                    Post Entries
                  </Button>
                </Popconfirm>
                <Button onClick={() => onCreateManualEntries()} type="primary">
                  New Manual Entries
                </Button>
              </Space>
            }
          />
        </Space>
      </Form>

      <Table
        rowKey={(record) => `${record?.referenceNo}-${record?.entityName}`}
        title={() => (
          <Input.Search
            placeholder="Search... "
            onSearch={(e) => onLoadJournalEntries(e)}
          />
        )}
        columns={getTransactionJournalPageCol(onHandleShowLedger)}
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
        size="small"
      />
    </>
  )
}
