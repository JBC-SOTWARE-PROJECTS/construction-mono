import { TerminalWindowsAction } from "@/components/accounting/cashier/payments/data-types/interfaces"
import { Billing, PaymentItem } from "@/graphql/gql/graphql"
import { Dispatch } from "react"
import PaymentItemsEmptyContent, {
  PaymentItemSearchInput,
  PaymentItems,
} from "./utils"
import {
  PaymentType,
  Payor,
} from "@/components/accounting/cashier/payments/data-types/types"

type Props = {
  id: string
  paymentType: PaymentType
  paymentItems: PaymentItem[]
  dispatch: Dispatch<TerminalWindowsAction>
  onAddItems: (paymentType: PaymentType) => void
  billing?: Billing | null
}

export default function PaymentItemsContent({
  dispatch,
  onAddItems,
  ...props
}: Props) {
  return (
    <>
      <PaymentItemSearchInput
        {...{ dispatch, paymentType: props.paymentType, id: props?.id }}
      />
      {props.paymentItems.length > 0 ? (
        <PaymentItems {...{ items: props.paymentItems, dispatch }} />
      ) : (
        <PaymentItemsEmptyContent
          {...{
            onAddItems,
            paymentType: props.paymentType,
            billing: props?.billing,
          }}
        />
      )}
    </>
  )
}
