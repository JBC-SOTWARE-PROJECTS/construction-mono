import { Button, Col, Modal, Row, message } from 'antd'
import { CnCreateModalProps } from '../create/props'
import { CustomModalPageHeader } from '@/components/accountReceivables/common'
import AllocateCreditTable from './ApplyCreditTable'
import { useState, useMemo } from 'react'
import { useDialog } from '@/hooks'
import PendingInvoices from '../invoiceOutstandingRecords'
import { FIND_ONE_CREDIT_NOTE } from '@/graphql/accountReceivables/creditNote'
import { gql, useMutation, useQuery } from '@apollo/client'
import {
  SubSummary,
  TotalSummary,
} from '@/components/accountReceivables/common/summaryComponent'
import numeral from 'numeral'
import Decimal from 'decimal.js'
import dayjs from 'dayjs'

const SUBMIT = gql`
  mutation ($creditNoteId: UUID, $fields: [Map_String_ObjectScalar]) {
    allocateCreditNote(creditNoteId: $creditNoteId, fields: $fields) {
      success
      response {
        id
      }
    }
  }
`

export interface CnAllocateCreditDataType {
  id: string
  invoiceNo: string
  invoiceDate: string
  dueDate: string
  totalAmount: number
  totalAmountDue: number
  allocatedAmount: number
}

interface CnAllocateCreditI {
  hide: (value: any) => void
  id: string
}

export default function CnAllocateCredit(props: CnAllocateCreditI) {
  const pendingInvoicesDialog = useDialog(PendingInvoices)
  const [dataSource, setDataSource] = useState<CnAllocateCreditDataType[]>([])

  const [onSubmit, { loading }] = useMutation(SUBMIT)

  const {
    data: creditNoteRecordData,
    loading: creditNoteRecordLoading,
    refetch: creditNoteRecordFetch,
  } = useQuery(FIND_ONE_CREDIT_NOTE, {
    variables: {
      id: props.id,
    },
    skip: !props.id,
  })

  const { id, arCustomer, creditNoteNo, totalAmountDue } =
    creditNoteRecordData?.creditNote ?? {
      id: null,
      arCustomer: null,
      creditNoteNo: '',
      totalAmountDue: 0,
    }

  const handleAdd = () => {
    if (totalSummary.amountToCredit !== totalAmountDue)
      return message.error(
        'Total allocate amount does not match total credit note amount.'
      )
    pendingInvoicesDialog(
      {
        selected: dataSource.map((item) => item.id),
        transactions: dataSource,
        customerId: arCustomer?.id,
      },
      (values: CnAllocateCreditDataType[]) => {
        setDataSource(values)
      }
    )
  }

  const handleSubmit = () => {
    const fields = dataSource.map((items) => ({
      creditNoteNo,
      arCustomer,
      arCreditNote: { id },
      invoice: items.id,
      creditNoteDate: dayjs()
        .startOf('day')
        .add(8, 'hours')
        .format('YYYY-MM-DD'),
      invoiceAmountDue: items.totalAmountDue,
      amountAllocate: items.allocatedAmount,
    }))

    onSubmit({
      variables: {
        creditNoteId: props.id,
        fields,
      },
      onCompleted: ({ allocateCreditNote }) => {
        if (allocateCreditNote.success) {
          message.success(allocateCreditNote?.message)
          props.hide(true)
        }
      },
    })
  }

  const totalSummary = useMemo(
    () =>
      (dataSource ?? []).reduce(
        (summary, { allocatedAmount }) => {
          const paymentApplied = new Decimal(allocatedAmount ?? 0)
          summary.amountToCredit = parseFloat(
            new Decimal(summary.amountToCredit).plus(paymentApplied).toString()
          )
          return summary
        },
        {
          amountToCredit: 0,
        } as { amountToCredit: number }
      ),
    [dataSource]
  )

  return (
    <Modal
      {...CnCreateModalProps}
      width={'70%'}
      open
      title={
        <CustomModalPageHeader label={`Allocate Credit - ${creditNoteNo}`} />
      }
      okText='Allocate'
      onOk={handleSubmit}
      onCancel={() => props.hide(false)}
      okButtonProps={{ loading }}
      cancelButtonProps={{ loading }}
    >
      <Button onClick={handleAdd} type='primary' style={{ marginBottom: 16 }}>
        Select Invoice
      </Button>
      <AllocateCreditTable {...{ dataSource, setDataSource }} />
      <div style={{ padding: '20px 24px' }}>
        <Row justify='end'>
          <Col flex='400px'>
            <SubSummary
              {...{
                label: 'Amount for Allocation',
                value: numeral(totalAmountDue).format('0,0.00'),
              }}
            />
          </Col>
        </Row>
        <Row justify='end'>
          <Col flex='400px'>
            <SubSummary
              {...{
                label: 'Amount for Crediting',
                value: numeral(totalSummary.amountToCredit).format('0,0.00'),
              }}
            />
          </Col>
        </Row>
        <Row justify='end'>
          <Col flex='400px'>
            <TotalSummary
              label='TOTAL'
              value={numeral(
                new Decimal(totalAmountDue ?? 0)
                  .minus(new Decimal(totalSummary.amountToCredit))
                  .toString()
              ).format('0,0.00')}
            />
          </Col>
        </Row>
      </div>
    </Modal>
  )
}
