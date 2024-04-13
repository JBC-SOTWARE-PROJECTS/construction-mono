import { HeaderLedger, Ledger } from "@/graphql/gql/graphql"
import { gql, useMutation, useQuery } from "@apollo/client"
import {
  Button,
  Divider,
  Form,
  FormInstance,
  Modal,
  Space,
  Spin,
  Tag,
  message,
} from "antd"
import dayjs from "dayjs"
import Decimal from "decimal.js"
import { useReducer } from "react"
import ManualJournalEntries from "../../features/manual-journal-entries"
import { LoadingOutlined } from "@ant-design/icons"
import SkeletonButton from "@/components/common/custom/skeleton/button"
import CustomModalFooter from "@/components/common/custom/custom-modal-footer"
import { CommonReducer } from "@/components/common/custom/interfaces-types/react-common"

export type JournalType =
  | "ALL"
  | "DISBURSEMENT"
  | "GENERAL"
  | "PURCHASES_PAYABLES"
  | "RECEIPTS"
  | "SALES"

const FIND_ONE_HEADER_WITH_DATE = gql`
  query ($id: UUID, $transactionDateOnly: LocalDate) {
    findOne: findOneHeaderLedgerWithDate(
      id: $id
      transactionDateOnly: $transactionDateOnly
    ) {
      id
      invoiceSoaReference
      docnum
      transactionNo
      referenceNo
      entityName
      particulars
      transactionDate
      transactionDateOnly
      docType
      journalType
      custom
      approvedBy
      ledger {
        id
        journalAccount {
          code
          accountName
        }
        debit
        credit
      }
    }
  }
`

const SUBMIT_GQL = gql`
  mutation (
    $headerGroupId: UUID
    $headerId: UUID
    $status: String
    $fields: Map_String_ObjectScalar
    $entries: [Map_String_ObjectScalar]
  ) {
    editJournalEntry(
      headerGroupId: $headerGroupId
      headerId: $headerId
      status: $status
      fields: $fields
      entries: $entries
    ) {
      payload
      success
      message
    }
  }
`

interface ManualJournalEntriesModalProps {
  hide: (isChange: boolean) => void
  id: string
  headerGroupId: string
  transactionDateOnly: string
  custom?: boolean
  beginningBalance?: boolean
  journalType: Exclude<JournalType, "ALL">
}

type TotalAmountType = { debit: number; credit: number }

export type MJEntriesActions =
  | {
      type: "set-data-source"
      payload: Ledger[]
    }
  | {
      type: "set-headerLedger"
      payload: HeaderLedger
    }
  | {
      type: "set-total-amount"
      payload: TotalAmountType
    }
export interface MJEntriesState {
  dataSource: Ledger[]
  header: HeaderLedger | null
  totalAmount: TotalAmountType
}

const reducer: CommonReducer<MJEntriesState, MJEntriesActions> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case "set-data-source":
      return { ...state, dataSource: payload }
    case "set-headerLedger":
      return { ...state, header: payload }
    case "set-total-amount":
      return { ...state, totalAmount: payload }
    default:
      return state
  }
}

export default function ManualJournalEntriesModal({
  custom,
  beginningBalance,
  ...props
}: ManualJournalEntriesModalProps) {
  const [messageApi, contextHolder] = message.useMessage()
  const [form]: [FormInstance<Omit<HeaderLedger, "ledger">>] = Form.useForm()
  const [state, dispatch] = useReducer(reducer, {
    dataSource: [],
    header: { custom, beginningBalance },
    totalAmount: { debit: 0, credit: 0 },
  })

  const { loading: findHeaderLoading } = useQuery(FIND_ONE_HEADER_WITH_DATE, {
    variables: {
      id: props.id,
      transactionDateOnly: props.transactionDateOnly,
    },
    skip: !props?.id,
    onCompleted: ({ findOne }: { findOne: HeaderLedger }) => {
      form.setFieldsValue({
        ...findOne,
        transactionDate: findOne?.transactionDate
          ? dayjs(findOne?.transactionDate)
          : dayjs(),
      })

      dispatch({ type: "set-headerLedger", payload: findOne ?? null })
      dispatch({
        type: "set-data-source",
        payload: (findOne?.ledger ?? []) as Ledger[],
      })
      dispatch({
        type: "set-total-amount",
        payload: (findOne?.ledger ?? []).reduce(
          (totalAmount, ledger) => {
            const debit = new Decimal(ledger?.debit ?? 0)
            const credit = new Decimal(ledger?.debit ?? 0)
            const totalDebit = new Decimal(totalAmount?.debit).plus(debit)
            const totalCredit = new Decimal(totalAmount?.credit).plus(credit)

            return (totalAmount = {
              debit: parseFloat(totalDebit.toString()),
              credit: parseFloat(totalCredit.toString()),
            })
          },
          { debit: 0, credit: 0 }
        ) as TotalAmountType,
      })
    },
  })

  const [onSubmit, { loading: onSubmitLoading }] = useMutation(SUBMIT_GQL)

  const onHandleSubmit = (status: "DRAFT" | "POSTED") => {
    form
      .validateFields()
      .then((values) => {
        const {
          invoiceSoaReference,
          entityName,
          transactionDate,
          journalType,
          docType,
          particulars,
        } = values

        var totalDebit = new Decimal(0.0)
        var totalCredit = new Decimal(0.0)
        var transactionAmountDebit = new Decimal(state?.totalAmount.debit ?? 0)

        const entries = state.dataSource.map(
          ({ journalAccount, ...source }) => {
            totalDebit = totalDebit.plus(source?.debit ?? 0)
            totalCredit = totalCredit.plus(source?.credit ?? 0)

            return {
              ...source,
              ...journalAccount,
            }
          }
        )

        if (entries.length == 0)
          return message.error("Please add an account for the journal entries.")

        if (!totalDebit.equals(totalCredit))
          return message.error("Debit and credit amounts should be equal.")

        if (!totalDebit.equals(transactionAmountDebit) && !state.header?.custom)
          return message.error(
            "The total amount should be equal to the transaction amount."
          )

        if (status == "DRAFT")
          messageApi.open({
            key: "submitting",
            type: "loading",
            content: "Saving draft...",
          })
        else
          messageApi.open({
            key: "submitting",
            type: "loading",
            content: "Posting journal entries...",
          })

        const variables = {
          headerId: state?.header?.id ?? null,
          headerGroupId: props?.headerGroupId,
          fields: {
            ...state?.header,
            invoiceSoaReference,
            entityName,
            transactionDate,
            journalType,
            docType,
            particulars,
          },
          entries,
          status,
        }

        if (state.header?.id) {
          delete variables.fields.ledger
          delete variables.fields.id
        }

        onSubmit({
          variables,
          onCompleted: (response) => {
            const returnResponse = response?.editJournalEntry
            if (returnResponse?.success) {
              props.hide(true)
            }
          },
        })
      })
      .catch((errorInfo) => {
        const errorFields = errorInfo?.errorFields ?? []

        errorFields.map((fields: { errors: string[] }) => {
          const errors = fields.errors.join("")
          return message.error(errors)
        })
      })
  }

  const loading = {
    findHeader: findHeaderLoading,
  }

  return (
    <Modal
      title={
        <Space>
          {state?.header?.custom ? (
            <b>Manual Journal</b>
          ) : (
            <b>Journal Entries</b>
          )}
          {state?.header?.docnum ? <Tag>{state?.header?.docnum}</Tag> : ""}
        </Space>
      }
      open
      width={"1000px"}
      closable={false}
      footer={
        <CustomModalFooter
          leftSpace={
            !state.header?.approvedBy && (
              <SkeletonButton
                type="primary"
                style={{ background: "#21ba45" }}
                onClick={() => onHandleSubmit("DRAFT")}
                loading={onSubmitLoading}
                skeleton
              >
                Save as Draft
              </SkeletonButton>
            )
          }
          rightSpace={
            <Space>
              {!state.header?.approvedBy && (
                <SkeletonButton
                  type="primary"
                  onClick={() => onHandleSubmit("POSTED")}
                  loading={onSubmitLoading}
                  skeleton
                >
                  Post Journal
                </SkeletonButton>
              )}
              <SkeletonButton
                type="primary"
                danger
                onClick={() => props.hide(false)}
                skeleton
                loading={onSubmitLoading}
              >
                Close
              </SkeletonButton>
            </Space>
          }
          style={{
            marginTop: 50,
          }}
        />
      }
    >
      <Spin spinning={onSubmitLoading} tip={<b>Please wait..</b>} size="large">
        <ManualJournalEntries
          {...{
            form,
            state,
            dispatch,
            messageApi,
            contextHolder,
            loading,
            journalType: props?.journalType,
          }}
        >
          <ManualJournalEntries.Header />
          <Divider dashed style={{ marginBottom: 10 }} />
          <ManualJournalEntries.Table />
          {/* <ManualJournalEntries.Details /> */}
        </ManualJournalEntries>
      </Spin>
    </Modal>
  )
}
