import { CardLayout } from '@/components/accountReceivables/common'
import CustomPageTitle from '@/components/accountReceivables/common/customPageTitle'
import { CommonTableCSS } from '@/components/accountReceivables/common/styles'
import CnAllocateCredit from '@/components/accountReceivables/credit-note/dialog/apply-credit'
import CreditNCreateDialog from '@/components/accountReceivables/credit-note/dialog/create'
import {
  CreditNoteStatusColorEnum,
  CreditNoteStatusLabelEnum,
} from '@/constant/accountReceivables'
import { ArCreditNote } from '@/graphql/gql/graphql'
import { useDialog } from '@/hooks'
import {
  FolderOpenOutlined,
  InfoCircleOutlined,
  PrinterOutlined,
} from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useQuery } from '@apollo/client'
import { Button, Pagination, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import numeral from 'numeral'

const CN_PAGE = gql`
  query (
    $customerId: UUID
    $search: String
    $page: Int
    $size: Int
    $status: String
  ) {
    creditNote: findAllCreditNote(
      customerId: $customerId
      search: $search
      page: $page
      size: $size
      status: $status
    ) {
      content {
        id
        creditNoteNo
        arCustomer {
          id
          customerName
        }
        creditNoteType
        creditNoteDate
        totalAmountDue
        status
      }
      totalElements
      number
      totalPages
    }
  }
`

export default function CreditNote() {
  const { data, refetch, loading, fetchMore } = useQuery(CN_PAGE, {
    variables: {
      customerId: null,
      search: '',
      page: 0,
      size: 5,
      status: 'ALL',
    },
    fetchPolicy: 'cache-and-network',
  })

  const creditNoteDialog = useDialog(CreditNCreateDialog)
  const allocateCreditDialog = useDialog(CnAllocateCredit)

  const onNewCreditNote = () => {
    creditNoteDialog({}, () => {})
  }

  const onSearch = (search: string) => {
    // refetch({
    //   search,
    //   page: 0,
    // })
  }

  const handleOpen = (record: ArCreditNote) => {
    switch (record.status) {
      case 'UNAPPLIED':
        allocateCreditDialog({ id: record.id }, () => {
          refetch()
        })
        break
      case 'POSTED':
        // window.open(
        //   apiUrlPrefix + '/arreports/arcreditnote?id=' + record?.id,
        //   'creditnote'
        // )
        break
      default:
        creditNoteDialog(
          {
            id: record.id,
          },
          () => refetch()
        )
        break
    }
  }

  const columns: ColumnsType<ArCreditNote> = [
    {
      title: 'RECORD #',
      dataIndex: 'creditNoteNo',
      width: 150,
    },
    {
      title: 'ACCOUNT',
      dataIndex: ['arCustomer', 'customerName'],
      render: (text: string, record) => (
        <a
          href={`/accounting/accounts-receivable/clients/${record?.arCustomer?.id}/activities`}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'PAYMENT DATE',
      dataIndex: 'creditNoteDate',
      width: 150,
      render: (text) => (text ? dayjs(text).format('YYYY/MM/DD') : '-'),
    },
    {
      title: 'AMOUNT',
      dataIndex: 'totalAmountDue',
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      render: (text) => (
        <Typography.Text
          style={{
            color:
              CreditNoteStatusColorEnum[
                text as keyof typeof CreditNoteStatusColorEnum
              ],
          }}
        >
          <Space align='baseline'>
            <InfoCircleOutlined />
            {
              CreditNoteStatusLabelEnum[
                text as keyof typeof CreditNoteStatusLabelEnum
              ]
            }
          </Space>
        </Typography.Text>
      ),
    },
    {
      title: 'ACTION',
      dataIndex: 'id',
      align: 'right',
      fixed: 'right',
      width: 180,
      render: (text, record) => {
        return (
          <Button type='link' onClick={() => handleOpen(record)}>
            {record?.status == 'POSTED' ? (
              <Space>
                <PrinterOutlined />
                Print
              </Space>
            ) : (
              <Space>
                <FolderOpenOutlined />
                Open
              </Space>
            )}
          </Button>
        )
      },
    },
  ]

  return (
    <PageContainer
      title={
        <CustomPageTitle
          title='Credit Note'
          subTitle='For the Adjustment of Account Balances'
        />
      }
    >
      <CardLayout
        onSearch={onSearch}
        extra={<Button onClick={onNewCreditNote}>New Credit Note</Button>}
      >
        <CommonTableCSS>
          <Table
            rowKey='id'
            columns={columns}
            dataSource={data?.creditNote?.content ?? []}
            size='small'
            loading={false}
            scroll={{ x: 1200 }}
            pagination={false}
            footer={() => (
              <Pagination
                current={data?.creditNote?.number + 1}
                showSizeChanger={false}
                pageSize={10}
                responsive={true}
                total={data?.creditNote?.totalElements}
                onChange={(e) => {
                  // refetch({ page: e - 1 })
                }}
              />
            )}
          />
        </CommonTableCSS>
      </CardLayout>
    </PageContainer>
  )
}
