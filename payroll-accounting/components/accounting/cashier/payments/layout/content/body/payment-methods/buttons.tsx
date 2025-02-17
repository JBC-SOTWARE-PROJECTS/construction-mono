import { useDialog } from "@/hooks";
import {
  AuditOutlined,
  BankOutlined,
  CreditCardOutlined,
  SolutionOutlined,
  TabletOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Button, Col, ColProps, Row, Space, Typography } from "antd";
import Decimal from "decimal.js";
import React, { ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { TerminalWindowsPaymentMethod } from "../../../../data-types/interfaces";
import PaymentMethodCard from "../../../../dialog/payment-method/card";
import PaymentMethodCheck from "../../../../dialog/payment-method/check";
import PaymentMethodBankDeposit from "../../../../dialog/payment-method/bank-deposit";
import PaymentMethodEWallet from "../../../../dialog/payment-method/e-wallet";

type PaymentTypeKeys = any;
// type PaymentTypeKeys = keyof typeof PaymentType

const PaymentMethodButtons = (props: {
  type: PaymentTypeKeys;
  label: string;
  icon: ReactNode;
  color?: string;
  textColor?: string;
  onClick: (type: PaymentTypeKeys) => void;
}) => {
  return (
    <Button
      size="large"
      block
      style={{
        height: 45,
        borderRadius: "5px",
        fontWeight: "bold",
        fontSize: "14px",
      }}
      type="primary"
      onClick={() => props.onClick(props.type)}
    >
      {props?.label}
    </Button>
  );
};

const breakpoints: ColProps = {
  lg: 8,
  xl: 6,
  md: 12,
};

const TerminalWindowsPaymentMethodButtons = React.memo(
  (props: TerminalWindowsPaymentMethod) => {
    const cardDialog = useDialog(PaymentMethodCard);
    const checkDialog = useDialog(PaymentMethodCheck);
    const bankDepositDialog = useDialog(PaymentMethodBankDeposit);
    const eWalletDialog = useDialog(PaymentMethodEWallet);

    const onTenderAmount = (type: PaymentTypeKeys) => {
      const payload = [...(props?.paymentMethods ?? [])];
      const { amountTendered } = props.form.getFieldsValue();

      if (amountTendered > 0) {
        switch (type) {
          case "Cash":
            const existingCash = payload.findIndex((pm) => pm.type == "Cash");
            if (existingCash >= 0) {
              const existingCashAmount = new Decimal(
                payload[existingCash]?.amount ?? 0
              );

              payload[existingCash].amount = parseFloat(
                new Decimal(amountTendered).plus(existingCashAmount).toString()
              );
            } else {
              payload.push({
                id: uuidv4(),
                tenderedType: "CASH",
                type: "CASH",
                amount: amountTendered ?? 0,
              });
            }
            props.form.setFieldValue("amountTendered", 0);
            props.dispatch({ type: "set-payment-methods", payload });
            break;
          case "Card":
            cardDialog({ amountTendered }, (card: any) => {
              if (card) {
                payload.push({
                  id: uuidv4(),
                  tenderedType: "CARD",
                  type: "CARD",
                  amount: card?.amountTendered ?? 0,
                  ...card,
                });
                props.form.setFieldValue("amountTendered", 0);
                props.dispatch({ type: "set-payment-methods", payload });
              }
            });
            break;
          case "Check":
            checkDialog({ amountTendered }, (check: any) => {
              if (check) {
                payload.push({
                  id: uuidv4(),
                  tenderedType: "CHECK",
                  type: "CHECK",
                  amount: check?.amountTendered ?? 0,
                  ...check,
                });
                props.form.setFieldValue("amountTendered", 0);
                props.dispatch({ type: "set-payment-methods", payload });
              }
            });

            break;
          case "Bankdeposit":
            bankDepositDialog({ amountTendered }, (bankDeposit: any) => {
              if (bankDeposit) {
                payload.push({
                  id: uuidv4(),
                  tenderedType: "BANK DEPOSIT",
                  type: "BANKDEPOSIT",
                  amount: bankDeposit?.amountTendered ?? amountTendered,
                  ...bankDeposit,
                });
                props.form.setFieldValue("amountTendered", 0);
                props.dispatch({ type: "set-payment-methods", payload });
              }
            });

            break;
          case "Ewallet":
            eWalletDialog({ amountTendered }, (eWallet: any) => {
              if (eWallet) {
                payload.push({
                  id: uuidv4(),
                  tenderedType: "E-WALLET",
                  type: "EWALLET",
                  amount: eWallet?.amountTendered ?? 0,
                  ...eWallet,
                });
                props.form.setFieldValue("amountTendered", 0);
                props.dispatch({ type: "set-payment-methods", payload });
              }
            });

            break;
          case "SalaryDeductions":
            payload.push({
              id: uuidv4(),
              tenderedType: "SALARY DEDUCTIONS",
              type: "SALARY_DEDUCTIONS",
              amount: amountTendered ?? 0,
            });
            break;
          default:
            return null;
        }
      }
    };

    return (
      <Row gutter={[8, 8]}>
        <Col {...breakpoints}>
          <PaymentMethodButtons
            label="Cash"
            type="Cash"
            color="#059669"
            textColor="white"
            icon={<WalletOutlined style={{ color: "#059669" }} />}
            onClick={onTenderAmount}
          />
        </Col>
        <Col {...breakpoints}>
          <PaymentMethodButtons
            label="Card"
            type="Card"
            icon={<CreditCardOutlined style={{ color: "#059669" }} />}
            textColor="white"
            color="#059669"
            onClick={onTenderAmount}
          />
        </Col>
        <Col {...breakpoints}>
          <PaymentMethodButtons
            label="Check"
            type="Check"
            icon={<AuditOutlined style={{ color: "#059669" }} />}
            color="#059669"
            textColor="white"
            onClick={onTenderAmount}
          />
        </Col>
        <Col {...breakpoints}>
          <PaymentMethodButtons
            label="Bank Deposit"
            type="Bankdeposit"
            icon={<BankOutlined style={{ color: "#059669" }} />}
            color="#059669"
            textColor="white"
            onClick={onTenderAmount}
          />
        </Col>
        <Col {...breakpoints}>
          <PaymentMethodButtons
            label="E-wallet"
            type="Ewallet"
            icon={<TabletOutlined style={{ color: "#059669" }} />}
            color="#059669"
            textColor="white"
            onClick={onTenderAmount}
          />
        </Col>
      </Row>
    );
  }
);

TerminalWindowsPaymentMethodButtons.displayName =
  "TerminalWindowsPaymentMethodButtons";
export default TerminalWindowsPaymentMethodButtons;
