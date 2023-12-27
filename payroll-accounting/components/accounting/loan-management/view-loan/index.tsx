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
import LoanAmortization from './loan-amortization'
import { useState } from 'react'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Bank } from '@/graphql/gql/graphql'
import dayjs from 'dayjs'

const LOAN_QUERY = gql`
  query ($id: UUID) {
    result: loanManagementById(id: $id) {
      payload {
        id
        loanNo
        referenceNo
        bankAccount {
          id
          accountNo
          accountName
          bank {
            id
            bankname
          }
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

interface CreateLoanI {
  hide: () => void
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
            propsinputnumber={{}}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col flex={'1 0'}>
          <FormSelect
            label='Bank Account'
            name='bankAccount'
            propsselect={{
              options:
                data?.banks?.content.map((account: Bank) => ({
                  label: `${account.bankname} - ${account.accountNumber}`,
                  value: account.id,
                })) ?? [],
            }}
          />
        </Col>
        <Col flex={'1 0'}>
          <FormInputNumber
            label='Annual Interest Rate'
            name='annualInterest'
            propsinputnumber={{}}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col flex={'1 0'}>
          <FormSelect
            label='Compound'
            name='compoundType'
            propsselect={{ options: compoundType }}
          />
        </Col>
        <Col flex={'1 0'}>
          <FormInputNumber
            label='Loan period in years'
            name='numberOfPeriod'
            propsinputnumber={{}}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col flex={'1 0'}>
          <FormDatePicker
            label='Start date of Loan'
            name='startDate'
            propsdatepicker={{}}
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

export interface CreateLoanDataType {
  paymentDate: string
}

export default function CreateLoan(props: CreateLoanI) {
  const [form] = useForm()

  const { data, loading } = useQuery(LOAN_QUERY, {
    variables: {
      id,
    },
  })

  const { payload: records } = data?.result || {
    payload: {
      id: '',
      loanNo: '',
      referenceNo: '',
      bankAccount: {
        accountNo: '',
        accountName: '',
        bank: { bankname: '' },
      },
      loanAmount: '',
      numberOfPayments: '',
      loanPeriod: '',
      loanPayment: '',
      totalInterest: '',
      totalCostOfLoan: '',
      startDate: '',
      compoundType: '',
    },
  }

  const { loanNo } = records

  const [onLoadLoanAmortization, { data, loading }] =
    useLazyQuery(LOAN_CALCULATOR)

  const [onCreateLoan, { loading: mutationLoad }] = useMutation(
    LOAN_MUTATION,
    {}
  )

  const onCalculateLoan = () => {
    const {
      principalAmount,
      annualInterest,
      compoundType,
      numberOfPeriod,
      startDate,
    } = form.getFieldsValue()

    onLoadLoanAmortization({
      variables: {
        principalAmount,
        annualInterest,
        compoundType,
        numberOfPeriod,
        startDate: dayjs(startDate).format('YYYY/MM/DD'),
      },
      onCompleted: ({ loanMLoanPayments }) => {
        const { monthlyPayment, numberOfPayments, costOfLoan, totalInterest } =
          loanMLoanPayments ?? {
            monthlyPayment: 0.0,
            numberOfPayments: 0.0,
            costOfLoan: 0.0,
            totalInterest: 0.0,
          }

        form.setFieldsValue({
          monthlyPayment,
          numberOfPayments,
          costOfLoan,
          totalInterest,
        })
      },
    })
  }

  const onHandleCreate = () => {
    const {
      startDate,
      principalAmount: loanAmount,
      annualInterest: interestRate,
      numberOfPeriod: loanPeriod,
      ...values
    } = form.getFieldsValue()

    onCreateLoan({
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
      onCancel={props.hide}
      title={<CustomModalPageHeader label={'New Record'} />}
      width='100%'
      style={ModalStyles.style}
      maskStyle={ModalStyles.maskStyle}
      okText='Create'
      onOk={onHandleCreate}
      okButtonProps={{ loading: mutationLoad }}
      cancelButtonProps={{ loading: mutationLoad }}
    >
      <Row gutter={[8, 8]}>
        <Col flex='1'>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Divider dashed orientation='left' orientationMargin={0}>
              Loan Form Details
            </Divider>
            <LoanFormDetails {...{ form }} />
            <Button type='primary' onClick={onCalculateLoan}>
              Calculate Loan
            </Button>
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
      <LoanAmortization {...{ data, loading }} />
    </Modal>
  )
}
