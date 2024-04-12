import {
  FormInputNumber,
  FormSegment,
  FormSelect,
  FormTextArea,
} from "@/components/common"
import {
  BillingDeductionOpt,
  BillingDeductionTypeOpt,
} from "@/constant/billing"
import { Card, Col, Form, FormInstance, Modal, Row } from "antd"
import { Dispatch, useReducer } from "react"
import { DeductionActionType, DeductionState, DeductionsType } from "."

interface DeductionsFormProps {
  form: FormInstance<any>
  state: DeductionState
  dispatch: Dispatch<DeductionActionType>
}

export default function DeductionsForm(props: DeductionsFormProps) {
  const { state } = props

  const onHandleDeduction = (value: any) => {
    props.dispatch({ type: "set-deduction", payload: value })
    props.form.setFieldValue("deductionAmount", 0)
  }

  const onHandleDeductionType = (value: any) => {
    props.dispatch({ type: "set-ded-type", payload: value })
    props.form.setFieldValue("deductionAmount", 0)
  }

  function getInputAmountLabel(value: string) {
    if (state.deduction == "RECOUPMENT") return "Recoupment amount"
    else if (state.deduction == "RETENTION") return "Retention amount"

    if (value == "FIXED") return "Deduction Amount"
    else return "Deduction Percentage"
  }

  function getInputSpecialDeductionLabel(
    fieldType: "BASE_AMOUNT" | "PERCENTAGE" | "AMOUNT",
    value?: DeductionsType
  ) {
    if (fieldType == "BASE_AMOUNT") {
      if (value == "RECOUPMENT") return "Recoupment base amount"
      else return "Retention base amount"
    }
    if (fieldType == "PERCENTAGE") {
      if (value == "RECOUPMENT") return "Recoupment percentage"
      else return "Retention percentage"
    }
    if (fieldType == "AMOUNT") {
      if (value == "RECOUPMENT") return "Recoupment amount"
      else return "Retention amount"
    }
  }

  return (
    <Card style={{ height: "100%" }}>
      <Form
        form={props.form}
        layout="vertical"
        initialValues={{ dedType: "PERCENTAGE" }}
      >
        <Row gutter={[8, 8]}>
          <Col flex="100%">
            <FormSelect
              label="Deduction"
              name="deduction"
              rules={[{ required: true }]}
              propsselect={{
                options: BillingDeductionOpt,
                onChange: onHandleDeduction,
              }}
            />
          </Col>

          {["RECOUPMENT", "RETENTION"].includes(state?.deduction ?? "") && (
            <Col flex="100%">
              <FormInputNumber
                label={getInputSpecialDeductionLabel(
                  "BASE_AMOUNT",
                  state?.deduction
                )}
                name="baseAmount"
                rules={[{ required: true }]}
                propsinputnumber={{}}
              />
            </Col>
          )}

          <Col flex="100%">
            <FormSegment
              label="Deduction Type"
              name="dedType"
              rules={[{ required: true }]}
              propssegment={{
                options: BillingDeductionTypeOpt,
                onChange: onHandleDeductionType,
              }}
            />
          </Col>

          <Col flex="100%">
            {state?.dedType == "PERCENTAGE" ? (
              <FormInputNumber
                label={getInputSpecialDeductionLabel(
                  "PERCENTAGE",
                  state?.deduction
                )}
                name="percentage"
                rules={[{ required: true }]}
                propsinputnumber={{
                  min: 0,
                  max: 100,
                  formatter: (value) => `${value}%`,
                  parser: (value) => value!.replace("%", ""),
                }}
              />
            ) : (
              <FormInputNumber
                label={getInputAmountLabel(state.dedType)}
                name="deductionAmount"
                rules={[{ required: true }]}
                propsinputnumber={{}}
              />
            )}
          </Col>
          <Col flex="100%">
            <FormTextArea label="Remarks" name="remarks" />
          </Col>
        </Row>
      </Form>
    </Card>
  )
}
