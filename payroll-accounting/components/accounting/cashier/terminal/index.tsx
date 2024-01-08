import React, { ReactNode } from 'react'
import axios from 'axios'
import qs from 'querystring'
import { gql, useMutation, useQuery } from '@apollo/client'
import {
  Alert,
  Button,
  Modal,
  ModalProps,
  Result,
  Space,
  Spin,
  message,
} from 'antd'
import { useConfirmationPasswordHook } from '@/hooks'
import TerminalManager from './TerminalManager'
import {
  LoadingOutlined,
  PlusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { TerminalDialogModalProps } from './props'

const OrParamDefault = {
  progresspayment: 'true',
  name: '',
  address: '',
  amountPaid: '',
  tin: '',
  paymentFor: '',
  citizenId: '',
  pwdId: '',
  particulars: '',
  breakdown: '',

  hospitalService: '',
  pfService: '',
  totalSales: '',
  lessVat: '',
  amountNetOfVat: '',
  lessDisc: '',
  totalDue: '',
  lessWitholdingTax: '',

  amountDue: '',

  vatableSales: '',
  vatExemptSales: '',
  zeroRateSales: '',
  vatamount: '',
  vatTotalSales: '',

  checknos: '',
  bank: '',

  chkCash: '',
  chkCheck: '',
  chkCard: '',

  type: 'OR',
  reference: '',
  date: '',
  cashiername: '',
}

const GET_CASHIER_DATA = gql`
  query ($macAddress: String, $type: String) {
    cashierData: getCashierData(macAddress: $macAddress, type: $type) {
      type
      batchReceiptId
      nextAR
      nextOR
      notFound
      terminalId
      terminalName
      shiftId
      terminalCode
      shiftPk
    }
  }
`

const ADD_SHIFTING = gql`
  mutation ($macAddress: String) {
    addShiftingRecord(macAddress: $macAddress) {
      id
    }
  }
`

const CLOSE_SHIFTING = gql`
  mutation ($shiftId: String) {
    closeShiftingRecord(shiftId: $shiftId) {
      id
    }
  }
`

interface PaymentHandlerI {
  type: string
  forRender: any
  macAddress?: string
  terminalLoading?: boolean
}

function PaymentHandler(props: PaymentHandlerI) {
  const { type, forRender, macAddress, terminalLoading } = props
  const [showPasswordConfirmation] = useConfirmationPasswordHook()

  const printReceipt = (orParam: any) => {
    axios
      .post(
        'https://hisd3.lvh.me:4567/printreceipt',
        qs.stringify({
          ...OrParamDefault,
          ...orParam,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((response) => {})
  }

  const { loading, data, refetch } = useQuery(GET_CASHIER_DATA, {
    variables: {
      type,
      macAddress,
    },
  })

  const [addShifting, { loading: loadingAddShifting }] = useMutation(
    ADD_SHIFTING,
    {
      ignoreResults: false,
      onCompleted: () => {
        refetch()
      },
    }
  )

  const [closeShifting, { loading: loadingCloseShifting }] = useMutation(
    CLOSE_SHIFTING,
    {
      ignoreResults: false,
      onCompleted: () => {
        message.info(
          'Shift Successfully Closed. You may now print the Sales Report for that shift'
        )

        refetch()
      },
    }
  )

  const createShiftingRecord = () => {
    showPasswordConfirmation(() => {
      addShifting({
        variables: {
          macAddress,
        },
      })
    })
  }

  if (loading)
    return (
      <Alert
        message={
          <Space>
            <>Please wait..</> <LoadingOutlined spin />
          </Space>
        }
        description="Please don't reload or close this browser."
        type='info'
      />
    )

  if (data && data.cashierData) {
    if (data.cashierData.notFound) {
      return (
        <Result
          status='500'
          title='500'
          subTitle='There were some error'
          extra={
            <Space direction='vertical'>
              <ul style={{ listStyleType: 'none' }}>
                <li>There is no Cashier Terminal with that MAC Address</li>
                <li>
                  There is no Receipt Issues {data.cashierData.type} for that
                  MAC Address
                </li>
              </ul>
              <Button
                type='primary'
                icon={<SyncOutlined />}
                onClick={() => refetch()}
              >
                Refresh
              </Button>
            </Space>
          }
        />
      )
    }

    if (!data?.cashierData?.shiftId) {
      return (
        <Result
          status='500'
          title='500'
          subTitle='There were some error'
          extra={
            <Space direction='vertical'>
              <ul>
                <li>There is no active Shifting Record</li>
              </ul>
              <Button
                type='primary'
                onClick={() => createShiftingRecord()}
                icon={<PlusCircleOutlined />}
              >
                Create a Shifting Record
              </Button>
            </Space>
          }
        />
      )
    }

    return forRender(
      data.cashierData,
      macAddress,
      closeShifting,
      refetch,
      printReceipt
    )
  }

  return <div />
}

export interface CashierDataPropsI {
  batchReceiptId?: string
  shiftId?: string
  nextAR?: string
  nextOR?: string
  notFound?: boolean
  shiftPk?: string
  terminalCode?: string
  terminalId?: string
  terminalName?: string
}

interface TerminalI {
  hide: (values?: any) => void
  title?: string | ReactNode
  loading?: boolean
  children?: any
  macAddress?: any
  terminalLoading?: any
  willRefetch?: any
  forRender?: any
  type?: string
  modalProps?: ModalProps
}

export default function Terminal(props: TerminalI) {
  const { loading, title, type, hide, modalProps } = props
  let forRender = null
  if (typeof props.children !== 'function') {
    forRender = (
      <div>
        Developer Error. Please use a function as a child of Terminals class{' '}
      </div>
    )
  }
  if (typeof props.children === 'function') {
    forRender = props.children
  }

  return (
    <Modal
      title={title || 'Patient Payments'}
      footer={<></>}
      closeIcon={false}
      {...TerminalDialogModalProps}
      {...modalProps}
      open
      // onCancel={() => hide(props?.willRefetch)}
    >
      <TerminalManager>
        <PaymentHandler type={type ?? ''} forRender={forRender} />
      </TerminalManager>
    </Modal>
  )
}

Terminal.defaultProps = {
  loading: false,
}
