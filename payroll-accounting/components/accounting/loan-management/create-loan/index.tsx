import { CustomModalPageHeader } from '@/components/accountReceivables/common'
import {
  FormDatePicker,
  FormInput,
  FormInputNumber,
  FormSelect,
} from '@/components/common'
import { Bank } from '@/graphql/gql/graphql'
import { useDialog } from '@/hooks'
import { randomId } from '@/utility/helper'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
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
import { useForm } from 'antd/lib/form/Form'
import dayjs from 'dayjs'
import CommonJournalEntry from '../../commons/dialog/journal-entry'
import { ModalStyles } from '../../commons/style-props'
import LoanAmortization from './loan-amortization'

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

const JOURNAL_ENTRY = gql`
  query ($id: UUID) {
    result: loanMViewPostingEntry(id: $id) {
      payload
      success
      message
    }
  }
`

const JOURNAL_POSTING = gql`
  mutation ($id: UUID, $entries: [Map_String_ObjectScalar]) {
    results: loanMPostEntry(id: $id, entries: $entries) {
      payload
      success
      message
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
            rules={[{ required: true }]}
            propsinputnumber={{}}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col flex={'1 0'}>
          <FormSelect
            label='Bank Account'
            name='bankAccount'
            rules={[{ required: true }]}
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
            rules={[{ required: true }]}
            propsinputnumber={{}}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col flex={'1 0'}>
          <FormSelect
            label='Compound'
            name='compoundType'
            rules={[{ required: true }]}
            propsselect={{ options: compoundType }}
          />
        </Col>
        <Col flex={'1 0'}>
          <FormInputNumber
            label='Loan period in years'
            name='numberOfPeriod'
            rules={[{ required: true }]}
            propsinputnumber={{}}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col flex={'1 0'}>
          <FormDatePicker
            label='Start date of Loan'
            name='startDate'
            rules={[{ required: true }]}
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

  const journalEntryDialog = useDialog(CommonJournalEntry)

  const [onLoadLoanAmortization, { data, loading }] =
    useLazyQuery(LOAN_CALCULATOR)

  const [onCreateLoan, { loading: mutationLoad }] = useMutation(
    LOAN_MUTATION,
    {}
  )

  const [onLoadJournalEntry] = useLazyQuery(JOURNAL_ENTRY)
  const [postPayment, { loading: postLoading }] = useMutation(JOURNAL_POSTING)

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
    form
      .validateFields()
      .then((fieldsValues) => {
        const {
          startDate,
          principalAmount: loanAmount,
          annualInterest: interestRate,
          numberOfPeriod: loanPeriod,
          ...values
        } = fieldsValues

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
          onCompleted: ({ results }) => {
            if (results?.payload?.id)
              onLoadJournalEntry({
                variables: {
                  id: results?.payload?.id,
                },
                onCompleted: ({ result }) => {
                  const defaultAccounts = (result?.payload ?? []).map(
                    (account: any) => ({
                      ...account,
                      id: randomId(),
                    })
                  )
                  journalEntryDialog({ defaultAccounts }, (entries: any[]) => {
                    console.log(entries, 'entries')
                    if (entries.length > 0) {
                      postPayment({
                        variables: {
                          id: results?.payload?.id,
                          entries,
                        },
                        onCompleted: () => {
                          message.success('Successfully created.')
                          props.hide()
                        },
                      })
                    }
                  })
                },
              })
          },
        })
      })
      .catch((errorInfo) => {})
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

      {data?.loanMLoanPayments?.amortize && (
        <>
          <Divider dashed orientation='left' orientationMargin={0}>
            Loan Amortization
          </Divider>
          <LoanAmortization {...{ data, loading }} />
        </>
      )}
    </Modal>
  )
}
