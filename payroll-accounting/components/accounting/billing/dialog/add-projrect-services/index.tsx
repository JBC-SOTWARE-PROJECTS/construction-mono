import {
  GET_PROJECT_OPT,
  GET_PROJECT_WORK_BY_ID,
} from "@/graphql/inventory/project-queries"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { Alert, Col, Form, Modal, Row, Typography, message } from "antd"

import { FormInput, FormInputNumber, FormSelect } from "@/components/common"
import { OptionProps } from "antd/es/select"
import Decimal from "decimal.js"
import { useState } from "react"
import {
  ProjectCost,
  ProjectWorkAccomplishItems,
  QueryProjectByIdArgs,
} from "@/graphql/gql/graphql"
import numeral from "numeral"
import { ADD_BILLING_ITEM_PROJECT_SERVICES } from "@/graphql/billing/queries"
import {
  calculateAmountAccomplish,
  calculateBalance,
  calculatePercentage,
  calculateToDate,
} from "@/components/inventory/project-details/common/work-accomplishments-helpers"

interface AddProjectServicesProps {
  hide: (params?: any) => void
  id: string
  billingId: string
  billingItems: string[]
}
export function AddProjectServices(props: AddProjectServicesProps) {
  const billingItems: string[] = props?.billingItems ?? []

  const [form] = Form.useForm()

  const [projectCost, setProjectCost] = useState<ProjectCost | null>(null)

  const { data, loading, refetch } = useQuery(GET_PROJECT_OPT, {
    variables: {
      filter: "",
      id: props?.id,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  })

  const [onFindOne, { loading: onFindOneLoading }] = useLazyQuery(
    GET_PROJECT_WORK_BY_ID,
    {
      onCompleted: ({ pCostById }: { pCostById: ProjectCost }) => {
        setProjectCost(pCostById)
        form.setFieldValue("qty", 0)
        form.setFieldValue("totalQty", pCostById?.qty ?? 0)
        form.setFieldValue("totalPrice", 0)
        form.setFieldValue(
          "price",
          numeral(pCostById?.cost ?? 0).format("0,0.00")
        )
        form.setFieldValue("billedQty", pCostById?.billedQty ?? 0)
        form.setFieldValue(
          "remainingQty",
          (pCostById?.qty ?? 0) - (pCostById?.billedQty ?? 0)
        )
      },
    }
  )

  const [onSaveService, { loading: onSaveServiceLoading }] = useMutation(
    ADD_BILLING_ITEM_PROJECT_SERVICES
  )

  const pCostByList: OptionProps = data?.pCostByList ?? []

  const onSelectProjectWork = (id: any) => {
    onFindOne({
      variables: {
        id,
      },
    })
  }

  const onInputQty = (value: any) => {
    const qty = new Decimal(projectCost?.qty ?? 0)
    const price = new Decimal(projectCost?.cost ?? 0)
    const billedQty = new Decimal(projectCost?.billedQty ?? 0)
    const currentQty = new Decimal(value ?? 0)
    const remaining = qty.minus(billedQty).minus(currentQty)
    const total = currentQty.times(price)
    form.setFieldValue(
      "totalPrice",
      numeral(parseFloat(total.toString())).format("0,0.00")
    )
    form.setFieldValue("remainingQty", parseFloat(remaining.toString()))
  }

  const validator = (_: any, value: any) => {
    const record = projectCost
    const qty = new Decimal(record?.qty ?? 0)
    const prev = new Decimal(record?.billedQty ?? 0)
    const totalQty = new Decimal(value ?? 0).plus(prev)
    const balance = qty.minus(totalQty)
    const balanceStatus = balance.greaterThanOrEqualTo(0)
    if (!balanceStatus) {
      message.error("Invalid amount")
      return Promise.reject(new Error("Invalid amount"))
    }
    return Promise.resolve()
  }

  const onAddItem = () => {
    const { qty: thisPeriodQty } = form.getFieldsValue()

    var fields: any = {
      ...projectCost,
      prevQty: projectCost?.billedQty,
      thisPeriodQty,
      toDateQty: 0,
      balanceQty: 0,
      projectCost: projectCost?.id,
      project: props?.id,
    }
    fields = calculateToDate(fields)
    fields = calculateBalance(fields)
    fields = calculateAmountAccomplish(fields)
    fields = calculatePercentage(fields)

    delete fields.id

    onSaveService({
      variables: {
        billingId: props.billingId,
        fields,
      },
      onCompleted: ({ addProjectService }) => {
        message.success(addProjectService?.message)
        props.hide()
      },
    })
  }

  return (
    <Modal
      open
      onCancel={props.hide}
      title={<b>New Services</b>}
      okText="Add"
      onOk={onAddItem}
      okButtonProps={{ loading }}
      cancelButtonProps={{ loading }}
    >
      <Row gutter={[8, 8]}>
        <Col flex="100%">
          <Alert
            description={
              <Typography.Text>
                <b>Note:</b> Adding project services to billing affects{" "}
                <Typography.Text mark italic strong>
                  Project Work Accomplishment&apos;s records
                </Typography.Text>
                . Changes made here reflect in current{" "}
                <Typography.Text mark italic strong>
                  Project Work Accomplishment
                </Typography.Text>
                . Ensure accurate billing entries for consistency.
              </Typography.Text>
            }
            type="warning"
          />
        </Col>
        <Col flex="100%">
          <Form form={form} layout="vertical">
            <Row gutter={[4, 4]}>
              <Col span={24}>
                <FormSelect
                  name="projectCostId"
                  label="Bill of Quantities"
                  propsselect={{
                    options: pCostByList.filter(
                      (pCost: OptionProps) =>
                        !billingItems.includes(pCost?.value)
                    ),
                    onSelect: onSelectProjectWork,
                  }}
                />
              </Col>
              <Col span={12}>
                <FormInputNumber
                  name="totalQty"
                  label="Total Quantity"
                  propsinputnumber={{ readOnly: true }}
                />
              </Col>
              <Col span={12}>
                <FormInput
                  name="price"
                  label="Price"
                  propsinput={{ readOnly: true }}
                />
              </Col>
              <Col span={12}>
                <FormInputNumber
                  name="billedQty"
                  label="Billed Quantity"
                  propsinputnumber={{ readOnly: true }}
                />
              </Col>

              <Col span={12}>
                <FormInputNumber
                  name="remainingQty"
                  label="Remaining Quantity"
                  propsinputnumber={{ readOnly: true }}
                />
              </Col>
              <Col span={12}>
                <FormInputNumber
                  name="qty"
                  label="Quantity"
                  rules={[{ validator }]}
                  propsinputnumber={{
                    onChange: onInputQty,
                  }}
                />
              </Col>
              <Col span={12}>
                <FormInput
                  name="totalPrice"
                  label="Total Price"
                  propsinput={{ readOnly: true }}
                />
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  )
}
