import {
  AppstoreOutlined,
  BarsOutlined,
  PlusCircleOutlined,
  SwapLeftOutlined,
  SwapRightOutlined,
} from "@ant-design/icons"
import type { ButtonProps } from "antd"
import {
  Button,
  Col,
  Divider,
  Layout,
  Row,
  Segmented,
  Space,
  Switch,
  Typography,
} from "antd"
import { useState } from "react"
import { CSSProp } from "styled-components"
import { PaymentQuickOptions } from "../../../data-types/interfaces"
import { useConfirmationPasswordHook, useDialog } from "@/hooks"
import { useMutation } from "@apollo/client"
import SearchPayorMC from "../../../dialog/customer"
import { useRouter } from "next/router"
import { PayorType } from "../../../data-types/types"

const { Sider, Content, Footer } = Layout

const buttonStyle: CSSProp = {
  background: "#115e59",
}

const QuickOptionsBtn = (props: ButtonProps) => {
  return (
    <Button
      type="primary"
      block
      style={{ ...buttonStyle }}
      size="large"
      {...props}
    />
  )
}

const TerminalWindowsQuickOption = (props: PaymentQuickOptions) => {
  const { push } = useRouter()
  const [collapse, setCollapse] = useState(false)
  const payorDialog = useDialog(SearchPayorMC)

  const [showPasswordConfirmation] = useConfirmationPasswordHook()
  // const discountModal = useDialog(AddDiscountModal)

  // const [editRecord, { loading: folioSettingsLoading }] = useMutation(
  //   EDIT_RECORD,
  //   {
  //     ignoreResults: false,
  //     onCompleted: (data) => {
  //       // refetch()
  //       location.reload()
  //     },
  //   }
  // )
  const toggleLockBilling = () => {
    if (props.billing?.locked) {
      alert("Please reconcile any subsidized deductions to the AR personnel")
    }

    showPasswordConfirmation(() => {
      // editRecord({
      //   variables: {
      //     id: props.billing?.id,
      //     fields: {
      //       locked: !props.billing?.locked,
      //       lockedBy: !props.billing?.locked ? props.login : "",
      //     },
      //   },
      // })
    })
  }

  const onAddDiscount = () => {
    // discountModal({ billing: props.billing }, (msg: string) => {
    //   if (msg) {
    //     location.reload()
    //   }
    // })
  }

  const onHandleSelectPayor = () => {
    const payorType = props.payorType
    payorDialog(
      {
        paymentType: props.paymentType,
        defaultPayorType: payorType,
      },
      (params: { id: string; payorType: PayorType }) => {
        if (params.id) {
          push(
            `/accounting/cashier/payments/${props.paymentType}/${params.payorType}/${params.id}`
          )
        }
      }
    )
  }

  // const onAddItems = () => {
  //   const type = props.paymentType
  //   switch (type) {
  //     case "folio-payments":
  //       return quickActionFolioPayments(
  //         folioItemsDialog,
  //         props.state.billing,
  //         props.state.folioItems,
  //         props.dispatch
  //       )
  //     case "miscellaneous-payments":
  //       return quickActionMiscPayments(miscItemsDialog, props.dispatch)
  //     default:
  //       return null
  //   }
  // }

  return (
    <Sider
      theme="light"
      width="180px"
      breakpoint="lg"
      collapsedWidth={0}
      collapsed={collapse}
      onBreakpoint={(broken) => setCollapse(broken)}
      style={{ marginTop: 10, marginRight: 10 }}
    >
      <Row gutter={[8, 8]} style={{ padding: 10 }} justify="center">
        <Col span={19}>
          <Space>
            <Segmented
              options={[
                { label: "OR", value: "OR", icon: <SwapLeftOutlined /> },
                {
                  label: "AR",
                  value: "AR",
                  icon: <SwapRightOutlined />,
                },
              ]}
            />
          </Space>
        </Col>
        <Col span={24} style={{ textAlign: "center" }}>
          <Typography.Text strong>Quick Options</Typography.Text>
        </Col>
        {/* <Col span={24}>
          <QuickOptionsBtn>New Folio</QuickOptionsBtn>
        </Col> */}
        <Col span={24}>
          <QuickOptionsBtn>History</QuickOptionsBtn>
        </Col>
        <Col span={24}>
          <QuickOptionsBtn onClick={onHandleSelectPayor}>
            Select Payor (F2)
          </QuickOptionsBtn>
        </Col>
        <Col span={24}>
          {props.billing?.locked && (
            <QuickOptionsBtn
              onClick={() => props.onAddItems(props.paymentType)}
            >
              Select Item (F3)
            </QuickOptionsBtn>
          )}
        </Col>
        <Col span={24}>
          {!props.billing?.locked && props.billing && (
            <QuickOptionsBtn onClick={toggleLockBilling}>
              Lock Folio
            </QuickOptionsBtn>
          )}
        </Col>
        <Col span={24}>
          {props.billing?.status && (
            <QuickOptionsBtn>Close Folio</QuickOptionsBtn>
          )}
        </Col>

        <Divider dashed />

        <Col span={24}>
          {props.billing?.locked && (
            <QuickOptionsBtn
              icon={<PlusCircleOutlined />}
              onClick={onAddDiscount}
            >
              Apply Discount
            </QuickOptionsBtn>
          )}
        </Col>
        {/* <Col span={24}>
          <QuickOptionsBtn icon={<PlusCircleOutlined />}>Notes</QuickOptionsBtn>
        </Col> */}
      </Row>
    </Sider>
  )
}

export default TerminalWindowsQuickOption
