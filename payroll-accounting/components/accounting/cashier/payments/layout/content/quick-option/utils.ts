import {
  Billing,
  BillingItem,
  BillingItemType,
  PaymentItem,
} from "@/graphql/gql/graphql"
import dayjs from "dayjs"
import { Dispatch } from "react"
import {
  FolioItemsI,
  TerminalWindowsAction,
} from "../../../data-types/interfaces"
import { PaymentType } from "../../../data-types/types"

export const quickActionFolioPayments = (
  folioItemsDialog: any,
  billing: Billing | null | undefined,
  folioItems: FolioItemsI | undefined,
  dispatch: Dispatch<TerminalWindowsAction>
) => {
  return folioItemsDialog(
    {
      folioItems,
      billing: billing?.id,
      startDate: dayjs(billing?.entryDateTime)
        .startOf("day")
        .format("YYYY-MM-DD"),
    },
    (selectedItems: BillingItem[]) => {
      if (selectedItems) {
        const newFolioItems: FolioItemsI = { ...folioItems } as FolioItemsI
        selectedItems.map(({ itemType, ...selItems }) => {
          const folioItemType = itemType as keyof FolioItemsI
          if (folioItemType) {
            const typeItems = [...(newFolioItems[folioItemType] ?? [])]
            selItems.subtotal = selItems.tmpBalance
            selItems.price = selItems.tmpBalance
            const newType = [...typeItems, { ...selItems, itemType }]
            newFolioItems[folioItemType] = newType
          }
        })
        dispatch({ type: "set-folio-items", payload: newFolioItems })
      }
    }
  )
}

export const quickActionSelectPaymentItems = (
  id: string,
  dialog: any,
  dispatch: Dispatch<TerminalWindowsAction>,
  paymentType: PaymentType
) => {
  return dialog({ id, paymentType }, (selectedItems: PaymentItem) => {
    if (selectedItems) {
      dispatch({ type: "add-payment-items", payload: selectedItems })
    }
  })
}

export const quickActionSelectInvoiceItems = (
  id: string,
  paymentItems: PaymentItem[],
  dialog: any,
  dispatch: Dispatch<TerminalWindowsAction>,
  paymentType: PaymentType
) => {
  return dialog(
    { customerId: id, paymentType, paymentItems },
    (selectedItems: PaymentItem) => {
      console.log(selectedItems, "selectedItems")
      if (selectedItems) {
        dispatch({ type: "add-payment-items", payload: selectedItems })
      }
    }
  )
}
