import { useDialog } from "@/hooks"
import {
  AuditOutlined,
  BankOutlined,
  CreditCardOutlined,
  SolutionOutlined,
  TabletOutlined,
  WalletOutlined,
} from "@ant-design/icons"
import { Button, Col, ColProps, Row, Space, Typography } from "antd"
import Decimal from "decimal.js"
import React, { ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"
import { TerminalWindowsPaymentMethod } from "../../../../data-types/interfaces"
import PaymentMethodCard from "../../../../dialog/payment-method/card"
import PaymentMethodCheck from "../../../../dialog/payment-method/check"
import PaymentMethodBankDeposit from "../../../../dialog/payment-method/bank-deposit"
import PaymentMethodEWallet from "../../../../dialog/payment-method/e-wallet"

type PaymentTypeKeys = any
// type PaymentTypeKeys = keyof typeof PaymentType

const PaymentMethodButtons = (props: {
  type: PaymentTypeKeys
  label: string
  icon: ReactNode
  color?: string
  textColor?: string
  onClick: (type: PaymentTypeKeys) => void
}) => {
  return (
    <Button
      size="large"
      block
      style={{
        height: 55,
        background: props?.color ?? "teal",
        fontSize: "15px",
      }}
      type="primary"
      onClick={() => props.onClick(props.type)}
    >
      <Space>
        {props?.icon}
        <Typography.Text strong style={{ color: props?.textColor ?? "white" }}>
          {props?.label}
        </Typography.Text>
      </Space>
    </Button>
  )
}

const breakpoints: ColProps = {
  lg: 12,
  xl: 8,
}

const TerminalWindowsPaymentMethodButtons = React.memo(
  (props: TerminalWindowsPaymentMethod) => {
    const cardDialog = useDialog(PaymentMethodCard)
    const checkDialog = useDialog(PaymentMethodCheck)
    const bankDepositDialog = useDialog(PaymentMethodBankDeposit)
    const eWalletDialog = useDialog(PaymentMethodEWallet)

    const onTenderAmount = (type: PaymentTypeKeys) => {
      const payload = [...(props?.paymentMethods ?? [])]
      const { amountTendered } = props.form.getFieldsValue()

      if (amountTendered > 0) {
        switch (type) {
          case "Cash":
            const existingCash = payload.findIndex((pm) => pm.type == "Cash")
            if (existingCash >= 0) {
              const existingCashAmount = new Decimal(
                payload[existingCash]?.amount ?? 0
              )

              payload[existingCash].amount = parseFloat(
                new Decimal(amountTendered).plus(existingCashAmount).toString()
              )
            } else {
              payload.push({
                id: uuidv4(),
                type: "CASH",
                amount: amountTendered ?? 0,
              })
            }
            props.form.setFieldValue("amountTendered", 0)
            props.dispatch({ type: "set-payment-methods", payload })
            break
          case "Card":
            console.log(type, "card....")
            cardDialog({ amountTendered }, (card: any) => {
              console.log(card, "card")
              if (card) {
                payload.push({
                  id: uuidv4(),
                  type: "CARD",
                  amount: amountTendered ?? 0,
                })
                props.form.setFieldValue("amountTendered", 0)
                props.dispatch({ type: "set-payment-methods", payload })
              }
            })
            break
          case "Check":
            checkDialog({ amountTendered }, (check: any) => {
              console.log(check, "check")
              if (check) {
                payload.push({
                  id: uuidv4(),
                  type: "CHECK",
                  amount: amountTendered ?? 0,
                })
                props.form.setFieldValue("amountTendered", 0)
                props.dispatch({ type: "set-payment-methods", payload })
              }
            })

            break
          case "Bankdeposit":
            bankDepositDialog({ amountTendered }, (bankDeposit: any) => {
              console.log(bankDeposit, "bankDeposit")
              if (bankDeposit) {
                payload.push({
                  id: uuidv4(),
                  type: "BANK DEPOSIT",
                  amount: bankDeposit?.amount ?? amountTendered,
                })
                props.form.setFieldValue("amountTendered", 0)
                props.dispatch({ type: "set-payment-methods", payload })
              }
            })

            break
          case "Ewallet":
            eWalletDialog({ amountTendered }, (eWallet: any) => {
              console.log(eWallet, "eWallet")
              if (eWallet) {
                payload.push({
                  id: uuidv4(),
                  type: "E-WALLET",
                  amount: amountTendered ?? 0,
                })
                props.form.setFieldValue("amountTendered", 0)
                props.dispatch({ type: "set-payment-methods", payload })
              }
            })

            break
          case "SalaryDeductions":
            payload.push({
              id: uuidv4(),
              type: "SALARY DEDUCTIONS",
              amount: amountTendered ?? 0,
            })
            break
          default:
            return null
        }
      }
    }

    return (
      <Row gutter={[8, 8]}>
        <Col {...breakpoints}>
          <PaymentMethodButtons
            label="Cash"
            type="Cash"
            color="#eab308"
            textColor="black"
            icon={<WalletOutlined style={{ color: "black" }} />}
            onClick={onTenderAmount}
          />
        </Col>
        <Col {...breakpoints}>
          <PaymentMethodButtons
            label="Card"
            type="Card"
            icon={<CreditCardOutlined style={{ color: "black" }} />}
            textColor="black"
            color="#eab308"
            onClick={onTenderAmount}
          />
        </Col>
        <Col {...breakpoints}>
          <PaymentMethodButtons
            label="Check"
            type="Check"
            icon={<AuditOutlined style={{ color: "black" }} />}
            color="#eab308"
            textColor="black"
            onClick={onTenderAmount}
          />
        </Col>
        <Col {...breakpoints}>
          <PaymentMethodButtons
            label="Bank Deposit"
            type="Bankdeposit"
            icon={<BankOutlined style={{ color: "black" }} />}
            color="#eab308"
            textColor="black"
            onClick={onTenderAmount}
          />
        </Col>
        <Col {...breakpoints}>
          <PaymentMethodButtons
            label="E-wallet"
            type="Ewallet"
            icon={<TabletOutlined style={{ color: "black" }} />}
            color="#eab308"
            textColor="black"
            onClick={onTenderAmount}
          />
        </Col>
        <Col {...breakpoints}>
          <PaymentMethodButtons
            type="SalaryDeductions"
            label="Salary Deduction"
            color="#eab308"
            textColor="black"
            icon={<SolutionOutlined style={{ color: "black" }} />}
            onClick={onTenderAmount}
          />
        </Col>
      </Row>
    )
  }
)

TerminalWindowsPaymentMethodButtons.displayName =
  "TerminalWindowsPaymentMethodButtons"
export default TerminalWindowsPaymentMethodButtons
