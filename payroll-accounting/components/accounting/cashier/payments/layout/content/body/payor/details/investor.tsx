import { TerminalWindowsAction } from "@/components/accounting/cashier/payments/data-types/interfaces"
import {
  GenderType,
  PaymentType,
  Payor,
  PayorType,
} from "@/components/accounting/cashier/payments/data-types/types"
import { useEmployeeById } from "@/hooks/cashier/use-employee"
import { Divider, Skeleton, Space, Typography } from "antd"
import { Dispatch } from "react"
import { PaymentRoute } from ".."
import { PayorLayout } from "./main"
import { calculateAge } from "@/utility/helper"
import { useInvestorById } from "@/hooks/cashier/use-investor"
import numeral from "numeral"

interface Props extends PaymentRoute {
  id: string
  paymentType: PaymentType
  randomGender: GenderType
  payor?: Payor | null
  dispatch: Dispatch<TerminalWindowsAction>
}

export default function InvestorPayor(props: Props) {
  const { data, loading } = useInvestorById({ variables: { id: props.id } })

  return (
    <PayorLayout
      payorType={props["payor-type"] as PayorType}
      paymentType={props["payment-type"] as PaymentType}
      loading={loading}
      payorName={
        data?.fullName ? `${data?.investorNo} - ${data?.fullName}` : ""
      }
      payorDescription={{
        label: loading ? (
          <Skeleton.Button active={true} size="small" style={{ height: 15 }} />
        ) : data ? (
          <Space split={<Divider type="vertical" />} wrap>
            <Typography.Text>Gender: {data?.gender}</Typography.Text>
            <Typography.Text>Age: {calculateAge(data?.dob)}</Typography.Text>
          </Space>
        ) : (
          <i>Please select a payor to proceed with the transaction.</i>
        ),
        extra: loading ? (
          <Skeleton.Button active={true} size="small" style={{ height: 15 }} />
        ) : (
          <Typography.Text underline strong>
            BAL: {numeral(data?.balance ?? 0).format("0,0.00")}
          </Typography.Text>
        ),
      }}
    />
  )
}
