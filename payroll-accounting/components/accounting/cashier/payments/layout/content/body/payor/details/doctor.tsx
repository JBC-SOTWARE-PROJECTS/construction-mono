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
import { useDoctorById } from "@/hooks/cashier/use-doctor"

interface Props extends PaymentRoute {
  id: string
  paymentType: PaymentType
  randomGender: GenderType
  payor?: Payor | null
  dispatch: Dispatch<TerminalWindowsAction>
}

export default function DoctorPayor(props: Props) {
  const { data, loading } = useDoctorById({ variables: { id: props.id } })
  const record = null
  const amount = 0.0

  return (
    <PayorLayout
      payorType={props["payor-type"] as PayorType}
      paymentType={props["payment-type"] as PaymentType}
      loading={loading}
      payorName={`${data?.code ?? ""} - ${data?.supplierFullname ?? ""} `}
      payorDescription={{
        label: loading ? (
          <Skeleton.Button active={true} size="small" style={{ height: 15 }} />
        ) : data ? (
          <Typography.Text ellipsis style={{ width: 500 }}>
            {data?.primaryAddress ?? ""}
          </Typography.Text>
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
