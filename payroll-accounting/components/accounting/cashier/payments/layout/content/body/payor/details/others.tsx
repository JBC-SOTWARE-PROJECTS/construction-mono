import { TerminalWindowsAction } from "@/components/accounting/cashier/payments/data-types/interfaces"
import {
  GenderType,
  PaymentType,
  Payor,
  PayorType,
} from "@/components/accounting/cashier/payments/data-types/types"
import { Divider, Skeleton, Space, Typography } from "antd"
import { useRouter } from "next/router"
import numeral from "numeral"
import { Dispatch } from "react"
import { PaymentRoute } from ".."
import { PayorLayout } from "./main"
import { paymentTypesLabel } from "@/components/accounting/cashier/payments/data-types/constants"

interface Props extends PaymentRoute {
  id: string
  paymentType: PaymentType
  randomGender: GenderType
  payor?: Payor | null
  dispatch: Dispatch<TerminalWindowsAction>
}

export default function OtherPayor(props: Props) {
  const paymentType = props["payment-type"] as PaymentType
  const defaultPayorType =
    paymentType == "otc-payments"
      ? "WALK-IN"
      : (props["payor-type"] as PayorType)
  const loading = false
  const record = null
  const amount = 0.0

  return (
    <PayorLayout
      payorType={defaultPayorType}
      paymentType={props["payment-type"] as PaymentType}
      loading={loading}
      title={
        <Space wrap size="small">
          <b>{paymentTypesLabel[props["payment-type"] as PaymentType]}</b>
        </Space>
      }
      payorName={""}
      payorDescription={{
        label: loading ? (
          <Space split={<Divider type="vertical" />} wrap>
            <Skeleton.Button
              active={true}
              size="small"
              style={{ height: 15 }}
            />
            <Skeleton.Button
              active={true}
              size="small"
              style={{ height: 15 }}
            />
            <Skeleton.Button
              active={true}
              size="small"
              style={{ height: 15 }}
            />
          </Space>
        ) : record ? (
          <Space split={<Divider type="vertical" />} wrap>
            <Typography.Text strong>Folio #:</Typography.Text>
            <Typography.Text strong>Case #:</Typography.Text>
            <Typography.Text strong>Age:</Typography.Text>
          </Space>
        ) : (
          <i>Please select a payor to proceed with the transaction.</i>
        ),
        extra: (
          <Space split={<Divider type="vertical" />}>
            {loading ? (
              <Skeleton.Button
                active={true}
                size="small"
                style={{ height: 15 }}
              />
            ) : record ? (
              <Typography.Text strong underline type="danger">
                Account Balance:
                {numeral(amount).format("0,0.00")}
              </Typography.Text>
            ) : (
              "--------"
            )}
          </Space>
        ),
      }}
    />
  )
}
