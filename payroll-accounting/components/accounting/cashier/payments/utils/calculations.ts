import { PaymentItem } from "@/graphql/gql/graphql"
import Decimal from "decimal.js"
import { PaymentType } from "../data-types/types"
import { PaymentMethod } from "../data-types/interfaces"

export default function calculateNewPaymentItems(
  currentItems: PaymentItem[],
  payload: PaymentItem,
  paymentType: PaymentType
) {
  const existingIdx = currentItems.findIndex((item) => item.id == payload.id)
  if (existingIdx > -1) {
    if (payload?.qty ?? 0 > 0) {
      const existingIdxRec = currentItems[existingIdx]
      const existingPriceDec = new Decimal(existingIdxRec?.price ?? 0)
      const existingQtyDec = new Decimal(existingIdxRec?.qty ?? 0)
      const payloadQtyDec = new Decimal(payload?.qty ?? 0)

      let newQtyDec = new Decimal(existingQtyDec)
      if (paymentType == "miscellaneous-payments")
        newQtyDec = new Decimal(existingQtyDec.plus(payloadQtyDec))

      currentItems[existingIdx].qty = parseFloat(newQtyDec.toString())
      const newAmount = newQtyDec.times(existingPriceDec)
      currentItems[existingIdx].amount = parseFloat(newAmount.toString())
    }
  } else {
    currentItems.push(payload)
  }

  return currentItems
}

export const getTotalAmountTendered = (paymentMethods: PaymentMethod[]) => {
  return (paymentMethods ?? []).reduce((sum, methods) => {
    const decimalSum = new Decimal(sum)
    const decimalTenderedAmount = new Decimal(methods.amount)
    return (sum = parseFloat(decimalSum.plus(decimalTenderedAmount).toString()))
  }, 0)
}
