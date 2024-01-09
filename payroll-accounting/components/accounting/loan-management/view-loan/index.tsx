import { CustomModalPageHeader } from '@/components/accountReceivables/common'
import {
  Button,
  Col,
  Divider,
  Form,
  FormInstance,
  Modal,
  Row,
  Space,
  message,
} from 'antd'
import { ModalStyles } from '../../commons/style-props'
import {
  FormDatePicker,
  FormInput,
  FormInputNumber,
  FormSelect,
} from '@/components/common'
import { useForm } from 'antd/lib/form/Form'
import { useState } from 'react'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Bank, Loan } from '@/graphql/gql/graphql'
import dayjs from 'dayjs'
import LoanAmortization from './loan-amortization'

const LOAN_QUERY = gql`
  query ($id: UUID) {
    result: loanManagementById(id: $id) {
      payload {
        id
        loanNo
        referenceNo
        bankAccount {
          id
          accountNumber
          accountName
          bankname
        }
        numberOfPayments
        interestRate
        compoundType
        loanAmount
        loanPeriod
        loanPayment
        totalInterest
        totalCostOfLoan
        startDate
      }
    }
  }
`

const LOAN_CALCULATOR = gql`
  query (
    $principalAmount: BigDecimal
    $annualInterest: BigDecimal
    $compoundType: String
    $numberOfPeriod: Int
    $startDate: String
  ) {
    loanMLoanPayments(
      principalAmount: $principalAmount
      annualInterest: $annualInterest
      compoundType: $compoundType
      numberOfPeriod: $numberOfPeriod
      startDate: $startDate
    )
  }
`

const LOAN_MUTATION = gql`
  mutation ($fields: Map_String_ObjectScalar) {
    results: loanMAddLoan(fields: $fields) {
      payload {
        id
      }
      success
      message
    }
  }
`

const BANK_PAGE = gql`
  query ($filter: String, $page: Int, $size: Int) {
    banks(filter: $filter, page: $page, size: $size) {
      content {
        id
        bankaccountId
        accountName
        bankname
        branch
        bankAddress
        accountNumber
        acquiringBank
      }
    }
  }
`

interface ViewLoanDetailsI {
  hide: () => void
  id: string
}

interface LoanFormDetails {
  form: FormInstance<any>
}

const compoundType = [
  { label: 'Annually', value: 'annually' },
  { label: 'Monthly', value: 'monthly' },
]

function LoanFormDetails(props: LoanFormDetails) {
  const { data, refetch, loading, fetchMore } = useQuery(BANK_PAGE, {
    variables: {
      filter: '',
      page: 0,
      size: 100,
    },
  })

  return (
    <Form form={props.form} name='form-details' layout='vertical'>
      <Row gutter={[8, 8]}>
        <Col flex={'1 0'}>
          <FormInput label='Reference No' name='referenceNo' />
        </Col>
        <Col flex={'1 0'}>
          <FormInputNumber
            label='Loan Amount'
            name='principalAmount'
            propsinputnumber={{
              readOnly: true,
            }}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col flex={'1 0'}>
          <FormInput label='Bank Account' name='bankAccount' />
        </Col>
        <Col flex={'1 0'}>
          <FormInputNumber
            label='Annual Interest Rate'
            name='annualInterest'
            propsinputnumber={{ readOnly: true }}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col flex={'1 0'}>
          <FormInput
            label='Compound'
            name='compoundType'
            propsinput={{ readOnly: true }}
          />
        </Col>
        <Col flex={'1 0'}>
          <FormInputNumber
            label='Loan period in years'
            name='numberOfPeriod'
            propsinputnumber={{ readOnly: true }}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col flex={'1 0'}>
          <FormInput
            label='Start date of Loan'
            name='startDate'
            propsinput={{
              readOnly: true,
            }}
          />
        </Col>
        <Col flex={'1 0'} />
      </Row>
    </Form>
  )
}

function LoanPaymentDetails(props: LoanFormDetails) {
  return (
    <Form form={props.form} name='form-details' layout='vertical'>
      <Row gutter={[8, 8]}>
        <Col flex={'1 0'}>
          <FormInputNumber
            label='Monthly payment'
            name='monthlyPayment'
            propsinputnumber={{
              readOnly: true,
            }}
          />
        </Col>
        <Col flex={'1 0'}>
          <FormInputNumber
            label='Total Interest'
            name='totalInterest'
            propsinputnumber={{
              readOnly: true,
            }}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col flex={'1 0'}>
          <FormInputNumber
            label='Number of payments'
            name='numberOfPayments'
            propsinputnumber={{
              readOnly: true,
            }}
          />
        </Col>
        <Col flex={'1 0'}>
          <FormInputNumber
            label='Total cost of loan'
            name='costOfLoan'
            propsinputnumber={{
              readOnly: true,
            }}
          />
        </Col>
      </Row>
    </Form>
  )
}

export interface ViewLoanDetailsDataType {
  paymentDate: string
}

export default function ViewLoanDetails(props: ViewLoanDetailsI) {
  const [form] = useForm()

  const { data, loading } = useQuery(LOAN_QUERY, {
    variables: {
      id: props.id,
    },
    onCompleted: ({ result }) => {
      const loan: Loan = result?.payload
      form.setFieldsValue({
        referenceNo: loan?.referenceNo ?? '',
        principalAmount: loan?.loanAmount ?? '',
        bankAccount: loan?.bankAccount
          ? `${loan?.bankAccount?.bankname} ${loan?.bankAccount?.accountNumber}`
          : '',
        annualInterest: loan?.interestRate ?? '',
        compoundType: loan?.compoundType ?? '',
        numberOfPeriod: loan?.loanPeriod ?? '',
        startDate:
          dayjs(loan?.startDate).format('YYYY-MM-DD') ??
          dayjs().format('YYYY-MM-DD'),
        monthlyPayment: loan?.loanPayment ?? '',
        totalInterest: loan?.totalInterest ?? '',
        numberOfPayments: loan?.numberOfPayments ?? '',
        costOfLoan: loan?.totalCostOfLoan ?? '',
      })
    },
  })

  const [onViewLoanDetails, { loading: mutationLoad }] = useMutation(
    LOAN_MUTATION,
    {}
  )

  const onHandleCreate = () => {
    const {
      startDate,
      principalAmount: loanAmount,
      annualInterest: interestRate,
      numberOfPeriod: loanPeriod,
      ...values
    } = form.getFieldsValue()

    onViewLoanDetails({
      variables: {
        fields: {
          ...values,
          loanAmount,
          interestRate,
          loanPeriod,
          startDate: dayjs(startDate).format('YYYY/MM/DD'),
        },
      },
      onCompleted: () => {
        message.success('Successfully created.')
        // props.hide()
      },
    })
  }

  return (
    <Modal
      open
      closable={false}
      title={<CustomModalPageHeader label={'New Record'} />}
      width='100%'
      style={ModalStyles.style}
      maskStyle={ModalStyles.maskStyle}
      footer={
        <Button type='primary' danger onClick={props.hide}>
          Close
        </Button>
      }
    >
      <Row gutter={[8, 8]}>
        <Col flex='1'>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Divider dashed orientation='left' orientationMargin={0}>
              Loan Form Details
            </Divider>
            <LoanFormDetails {...{ form }} />
          </Space>
        </Col>
        <Col flex='1'>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Divider dashed orientation='left' orientationMargin={0}>
              Loan Payment Details
            </Divider>
            <LoanPaymentDetails {...{ form }} />
          </Space>
        </Col>
      </Row>

      <Divider dashed orientation='left' orientationMargin={0}>
        Loan Amortization
      </Divider>
      <LoanAmortization {...{ id: props?.id }} />
    </Modal>
  )
}
