import { Billing, BillingItem, PaymentItem } from "@/graphql/gql/graphql"
import { FolioItemsI, TerminalDetails } from "../../../data-types/interfaces"
import { NextRouter } from "next/router"
import { PaymentType } from "../../../data-types/types"

interface folioParams {
  folioItems?: FolioItemsI
  billing?: Billing | null
  terminalDetails?: TerminalDetails
}

interface folioFields {
  items: PaymentItem[]
  fields: {
    receiptType?: string | null
    batchReceiptId?: string | null
    shiftId?: string | null
    billingId?: string | null
  }
  taggedIds: []
  taggedIdsMeds: []
}

export const getFolioFields = (params: folioParams): folioFields => {
  let items: PaymentItem[] = []
  const folioItem = params.folioItems
  const billing = params.billing
  const {
    type: receiptType,
    batchReceiptId,
    shiftId,
  } = params?.terminalDetails ?? {
    type: "",
    batchReceiptId: "",
    shiftId: "",
  }

  for (const itemType in folioItem) {
    const itemTypeList = (folioItem[itemType as keyof FolioItemsI] ??
      []) as BillingItem[]
    itemTypeList.map((item: BillingItem) => {
      const newItem: PaymentItem = {
        itemName: item.description,
        referenceItemId: item.id,
        qty: item.qty,
        price: item.wcost,
        amount: item.subTotal,
        referenceItemType: item.itemType,
      }

      items.push(newItem)
    })
  }

  const fields = {
    receiptType,
    batchReceiptId,
    shiftId,
    billingId: billing?.id,
  }

  return {
    items,
    fields,
    taggedIds: [],
    taggedIdsMeds: [],
  }
}

export const onCompletePayment = (
  response: string,
  paymentType: PaymentType,
  router: NextRouter
) => {
  if (response == "new") {
    router.push(`/accounting/cashier/payments/${paymentType}`)
  }
  if (response == "close") {
    window.close()
  }
}
