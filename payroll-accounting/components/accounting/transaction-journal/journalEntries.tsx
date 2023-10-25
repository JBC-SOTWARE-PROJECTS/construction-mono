import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Input,
  Modal,
  Row,
  Space,
  Statistic,
  Table,
  message,
} from 'antd'
import numeral from 'numeral'
import type { ColumnsType } from 'antd/es/table'
import {
  HeaderLedger,
  HeaderLedgerGroupItemsDto,
  Ledger,
  LedgerTotalDebitCredit,
} from '@/graphql/gql/graphql'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { ProCard } from '@ant-design/pro-components'
import LedgerList from './ledgerList'
import moment from 'moment'
import ConfirmationPasswordHook from '@/hooks/promptPassword'

const GET_RECORDS = gql`
  query (
    $filter: String
    $groupId: UUID
    $startDate: Instant
    $endDate: Instant
    $journalType: String
    $fiscalId: UUID
  ) {
    transactionJournal: transactionJournalGroupItemQuery(
      filter: $filter
      groupId: $groupId
      startDate: $startDate
      endDate: $endDate
      journalType: $journalType
      fiscalId: $fiscalId
    ) {
      id
      journalType
      transactionDateOnly
      docType
      docNo
      particulars
      createdBy
      approvedBy
      debit
      credit
    }
  }
`

const APPROVE_LEDGER_WITH_DATE = gql`
  mutation UpdateItem($fields: [Map_String_ObjectScalar]) {
    approveLedgerWithDate(fields: $fields)
  }
`
interface JournalEntriesI {
  hide: () => void
  groupId: string
  entityName: string
  reference: string
  startDate: string
  endDate: string
  journalType: boolean
  fiscalId: boolean
}

interface SelectedI {
  id: string
  transactionDateOnly: string
  debit: number
  credit: number
}

export default function JournalEntries(props: JournalEntriesI) {
  const [selected, setSelected] = useState<SelectedI[]>([])
  const [showPasswordConfirmation] = ConfirmationPasswordHook()
  const [messageApi, contextHolder] = message.useMessage()

  const {
    entityName,
    groupId,
    journalType,
    fiscalId,
    startDate,
    endDate,
    hide,
  } = props

  const { data, loading, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: '',
      groupId,
      startDate,
      endDate,
      journalType,
      fiscalId,
    },
  })

  const [approveLedger, { loading: resultLoading }] = useMutation(
    APPROVE_LEDGER_WITH_DATE,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        messageApi.destroy()
        setSelected([])
        refetch()
      },
    }
  )

  const rowSelection = {
    onSelect: (record: any, isSelected: boolean) => {
      if (isSelected) {
        setSelected([
          ...selected,
          {
            ...record,
          },
        ])
      } else {
        const index = selected.findIndex(({ id }) => id == record?.id)
        setSelected((prevSelected) => {
          const newSel = [...prevSelected]
          newSel.splice(index, 1)
          return newSel
        })
      }
    },
    onSelectAll: (_: any, selectedRows: any) => {
      setSelected([...selectedRows])
    },
    onSelectNone: () => {
      setSelected([])
    },
    getCheckboxProps: (record: HeaderLedgerGroupItemsDto) => ({
      disabled: record?.approvedBy !== '', // Column configuration not to be checked
    }),
  }

  const onHandlePost = () => {
    if (selected.length === 0) {
      message.warning('Please select Entry to approve')
      return
    }

    showPasswordConfirmation(() => {
      messageApi.open({
        type: 'loading',
        content: 'Action in progress..',
        duration: 0,
      })
      approveLedger({
        variables: {
          fields: selected.map((sel) => ({
            id: sel.id,
            transactionDate: sel.transactionDateOnly,
          })),
        },
      })
    })
  }

  const columns: ColumnsType<HeaderLedgerGroupItemsDto> = [
    { title: 'Journal Type', dataIndex: 'journalType' },
    {
      title: 'Date',
      dataIndex: 'transactionDateOnly',
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
    },
    { title: 'Doc Type', dataIndex: 'docType' },
    { title: 'Doc No', dataIndex: 'docNo' },
    { title: 'Particular', dataIndex: 'particulars' },
    { title: 'Created By', dataIndex: 'createdBy' },
    {
      title: 'Total Debit',
      dataIndex: 'debit',
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Total Credit',
      dataIndex: 'credit',
      align: 'right',
      render: (text) => numeral(text).format('0,0.00'),
    },
    { title: 'Posted By', dataIndex: 'approvedBy' },
  ]

  const journalTotal = useMemo(() => {
    return selected.reduce(
      (acc, { debit, credit }) => {
        acc.totalDebit += debit
        acc.totalCredit += credit
        return acc
      },
      { totalDebit: 0, totalCredit: 0 }
    )
  }, [selected])

  const { totalDebit, totalCredit } = journalTotal

  return (
    <Modal
      title='Ledger Overview'
      open
      onCancel={props.hide}
      width='100%'
      style={{ maxWidth: '1600px' }}
      footer={<Button onClick={() => hide()}>Close</Button>}
    >
      <ProCard
        title={
          <Statistic
            title='Entity Name'
            value={entityName}
            valueStyle={{ fontWeight: 'normal' }}
          />
        }
        bordered={false}
        extra={[
          <Space key={1}>
            <Statistic
              title='Total Selected Debit'
              valueStyle={{ color: '#3f8600' }}
              value={numeral(totalDebit).format('0,0.00')}
            />
            <Statistic
              title='Total Selected Credit'
              valueStyle={{ color: '#cf1322' }}
              value={numeral(totalCredit).format('0,0.00')}
              precision={2}
            />
          </Space>,
        ]}
      >
        <Divider dashed />
        <Row gutter={[16, 16]} style={{ marginBottom: 8 }}>
          <Col span={24}>
            {contextHolder}
            <Button
              type='primary'
              onClick={() => onHandlePost()}
              loading={resultLoading}
            >
              Post
            </Button>
            <span style={{ marginLeft: 8 }}>
              {selected.length > 0
                ? `Selected ${selected.length} entrie(s)`
                : ''}
            </span>
          </Col>
          <Col span={24}>
            <Input.Search onSearch={(e) => refetch({ filter: e })} />
          </Col>
        </Row>
        <Table
          rowKey='id'
          loading={loading}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          expandable={{
            expandedRowRender: (record: HeaderLedgerGroupItemsDto) => {
              return <LedgerList headerLedger={record} />
            },
          }}
          columns={columns as any}
          dataSource={data?.transactionJournal ?? []}
          size='small'
        />
      </ProCard>
    </Modal>
  )
}
