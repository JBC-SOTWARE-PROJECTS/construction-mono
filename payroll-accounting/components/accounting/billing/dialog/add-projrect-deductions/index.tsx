import { ADD_DEDUCTIONS } from "@/graphql/billing/queries"
import { BillingItem } from "@/graphql/gql/graphql"
import { useMutation } from "@apollo/client"
import { Col, Form, Modal, Row } from "antd"
import { useReducer } from "react"
import DeductionsForm from "./deductions-form"
import DeductionsTable from "./deductions-table"

interface AddProjectDeductionsProps {
  hide: (params?: any) => void
  id: string
  billingId: string
  billingItems: string[]
}

export type DeductionsType = "TAX" | "VAT" | "RECOUPMENT" | "RETENTION"
export type CalculationType = "AUTO" | "CUSTOMIZE"

export interface DeductionState {
  dedType: string
  deduction?: DeductionsType
  calculationType: CalculationType
  deductionItems: BillingItem[]
}

export type DeductionActionType =
  | { type: "set-ded-type"; payload: string }
  | { type: "set-deduction"; payload: DeductionsType }
  | { type: "set-calculation-type"; payload: CalculationType }
  | { type: "set-deduction-items"; payload: BillingItem[] }

const reducer = (
  state: DeductionState,
  { type, payload }: DeductionActionType
): DeductionState => {
  switch (type) {
    case "set-ded-type":
      return { ...state, dedType: payload }
    case "set-deduction":
      return { ...state, deduction: payload }
    case "set-deduction-items":
      return { ...state, deductionItems: payload }
    case "set-calculation-type":
      return { ...state, calculationType: payload }
    default:
      return state
  }
}

const initialValue: DeductionState = {
  dedType: "PERCENTAGE",
  calculationType: "AUTO",
  deductionItems: [],
}

export function AddProjectDeductions(props: AddProjectDeductionsProps) {
  const [form] = Form.useForm()

  const [state, dispatch] = useReducer(reducer, initialValue)

  const [onAddDeductions, { loading }] = useMutation(ADD_DEDUCTIONS)

  const onHandleAdd = () => {
    form
      .validateFields()
      .then((values) => {
        onAddDeductions({
          variables: {
            fields: { ...values },
            id: props.billingId,
            items: state?.deductionItems ?? [],
          },
          onCompleted: () => {
            props.hide()
          },
        })
      })
      .catch((errorInfo) => {})
  }

  return (
    <Modal
      open
      width="80%"
      onCancel={props.hide}
      title={<b>{`New Project's Deductions`}</b>}
      okText="Add Deduction"
      onOk={onHandleAdd}
      okButtonProps={{ loading }}
    >
      <Row gutter={[8, 8]}>
        <Col flex="450px">
          <DeductionsForm {...{ form, state, dispatch }} />
        </Col>
        <Col flex="auto">
          <DeductionsTable {...{ state, dispatch, id: props.billingId }} />
        </Col>
      </Row>
    </Modal>
  )
}
