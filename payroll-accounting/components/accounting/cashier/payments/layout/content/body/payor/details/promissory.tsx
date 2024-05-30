import { TerminalWindowsAction } from "@/components/accounting/cashier/payments/data-types/interfaces"
import {
  GenderType,
  PaymentType,
  Payor,
  PayorType,
} from "@/components/accounting/cashier/payments/data-types/types"
import { Divider, Skeleton, Space, Typography } from "antd"
import { Dispatch } from "react"
import { PaymentRoute } from ".."
import { PayorLayout } from "./main"
import { usePromissoryNoteById } from "@/hooks/cashier/use-promissory-note"
import numeral from "numeral"

interface Props extends PaymentRoute {
  id: string
  paymentType: PaymentType
  randomGender: GenderType
  payor?: Payor | null
  dispatch: Dispatch<TerminalWindowsAction>
}

export default function PromissoryNotePayor(props: Props) {
  const { data, loading } = usePromissoryNoteById({
    variables: { id: props.id },
  })
  const hasValue = true
  const record = null
  const amount = 0.0

  return (
    <PayorLayout
      payorType={props["payor-type"] as PayorType}
      paymentType={props["payment-type"] as PaymentType}
      loading={loading}
      payorName={data?.debtorFullName ?? ""}
      payorDescription={{
        label: loading ? (
          <Skeleton.Button active={true} size="small" style={{ height: 15 }} />
        ) : data ? (
          <Space split={<Divider type="vertical" />} wrap>
            <Typography.Text>PN NO: {data?.pnNo}</Typography.Text>
            <Typography.Text>Type: {data?.pnType}</Typography.Text>
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
            ) : (
              <b>{numeral(data?.netTotalAmount).format("0,0.00")}</b>
            )}
          </Space>
        ),
      }}
    />
  )
}
