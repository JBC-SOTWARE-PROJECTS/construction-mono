import { TerminalWindowsAction } from "@/components/accounting/cashier/payments/data-types/interfaces"
import {
  GenderType,
  PaymentType,
  Payor,
  PayorType,
} from "@/components/accounting/cashier/payments/data-types/types"
import TerminalWindowFolioListDialog from "@/components/accounting/cashier/payments/dialog/folio/folio-list"
import { Billing, Patient } from "@/graphql/gql/graphql"
import { useDialog } from "@/hooks"
import { useBillingById } from "@/hooks/cashier/use-billing"
import { calculateAge } from "@/utility/helper"
import { HistoryOutlined, LockOutlined } from "@ant-design/icons"
import { Card, Divider, Skeleton, Space, Tag, Tooltip, Typography } from "antd"
import { useRouter } from "next/router"
import numeral from "numeral"
import React, { Dispatch } from "react"
import { PaymentRoute } from ".."
import { PayorLayout } from "./main"

interface Props extends Billing, PaymentRoute {
  id: string
  paymentType: PaymentType
  randomGender: GenderType
  billing?: Billing | null
  payor?: Payor | null
  dispatch: Dispatch<TerminalWindowsAction>
}

interface FolioStatusProps {
  loading: boolean
  registryType?: string
  locked?: boolean
  isAllowedProgressPayment?: boolean
}

export const PayorFolioIconStatus = React.memo((props: FolioStatusProps) => {
  return props.loading ? (
    <Skeleton.Button active={true} size="small" style={{ height: 15 }} />
  ) : (
    <>
      {props?.registryType && (
        <Tag color="#f50" bordered={false}>
          {props?.registryType}
        </Tag>
      )}
      {props.locked && (
        <Tag color="red" bordered={false} icon={<LockOutlined />} />
      )}
      {props.isAllowedProgressPayment && (
        <Tooltip title="Allowed Progress Payment">
          <Tag color="blue" bordered={false} icon={<HistoryOutlined />} />
        </Tooltip>
      )}
    </>
  )
})

PayorFolioIconStatus.displayName = "PayorFolioIconStatus"

const PayorFolioDetails = React.memo((props: Props) => {
  const paymentType = props["payment-type"] as PaymentType
  const defaultPayorType =
    paymentType == "otc-payments"
      ? "WALK-IN"
      : (props["payor-type"] as PayorType)

  const { loading, data: billing } = useBillingById({
    variables: { id: props.id },
    onComplete: (billing) => {
      if (billing) {
        props.dispatch({ type: "set-billing", payload: billing })
        props.dispatch({
          type: "set-payor",
          payload: billing?.patient as Patient,
        })
        props.dispatch({
          type: "set-folio-items",
          payload: {
            ROOMBOARD: [],
            MEDICINES: [],
            SUPPLIES: [],
            DIAGNOSTICS: [],
            CATHLAB: [],
            ORFEE: [],
            PF: [],
            OTHERS: [],
          },
        })
      }
    },
  })

  const payorName =
    paymentType == "otc-payments"
      ? billing?.otcname
      : billing?.patient?.fullName ?? ""

  function onRouteFolio() {
    window.open(
      `/receivables-collections/billing/folios/patient/${billing?.id}`,
      "_blank"
    )
  }
  return (
    <PayorLayout
      payorType={defaultPayorType}
      paymentType={paymentType}
      loading={loading}
      title={
        <Space wrap size="small">
          <PayorFolioIconStatus
            {...{
              registryType: billing?.patientCase?.registryType ?? "",
              locked: !!billing?.locked,
              isAllowedProgressPayment: !!billing?.isAllowedProgressPayment,
              loading,
            }}
          />
        </Space>
      }
      payorName={payorName}
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
        ) : billing ? (
          <Space split={<Divider type="vertical" />} wrap>
            <Typography.Text strong>
              Folio #: <a onClick={onRouteFolio}>{billing?.billingNo}</a>
            </Typography.Text>
            <Typography.Text strong>
              Case #: {billing?.patientCase?.caseNo}
            </Typography.Text>
            <Typography.Text strong>
              Age: {calculateAge(billing?.patient?.dob)}
            </Typography.Text>
          </Space>
        ) : (
          <i>Please select a payor to proceed with the transaction.</i>
        ),
        extra: loading ? (
          <Skeleton.Button active={true} size="small" style={{ height: 15 }} />
        ) : billing ? (
          <Typography.Text strong underline type="danger">
            Balance:
            {numeral(billing?.balance).format("0,0.00")}
          </Typography.Text>
        ) : (
          "--------"
        ),
      }}
    />
  )
})

PayorFolioDetails.displayName = "PayorFolioDetails"

export default PayorFolioDetails
