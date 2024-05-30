import { BillingItem, PaymentItem } from "@/graphql/gql/graphql"
import {
  AmountSummaryI,
  PaymentQuickOptions,
  TerminalWindowProps,
  TerminalWindowsHeaderProps,
  TerminalWindowsPaymentMethod,
  TerminalWindowsPayor,
} from "../data-types/interfaces"
import { PaymentType } from "../data-types/types"
import Decimal from "decimal.js"

export function setHeaderProps(
  context: TerminalWindowProps
): TerminalWindowsHeaderProps {
  return {
    userName: context.login,
    randomGender: context.state.randomGender,
    paymentType: context.paymentType,
    nextOR: context.terminalDetails?.nextOR ?? "",
    type: context.terminalDetails?.type ?? "",
  }
}

export function setPayorProps(
  context: TerminalWindowProps
): TerminalWindowsPayor {
  const state = context.state
  return {
    billing: state.billing,
    payor: state.payor,
    payorType: context.payorType,
    randomGender: state.randomGender,
    paymentType: context.paymentType,
    dispatch: context.dispatch,
  }
}

export function setPaymentMethodProps(
  context: TerminalWindowProps
): TerminalWindowsPaymentMethod {
  return {
    paymentMethods: context.state.paymentMethods,
    form: context.form,
    totalAmountTendered: context.totalAmountTendered,
    dispatch: context.dispatch,
  }
}

export function setQuickOptionsProps(
  context: TerminalWindowProps
): PaymentQuickOptions {
  return {
    login: context.login,
    billing: context.state.billing,
    paymentType: context.paymentType,
    dispatch: context.dispatch,
    state: context.state,
    onAddItems: context.onAddItems,
  }
}

function setFolioSummaryAmount(summary: AmountSummaryI, item: BillingItem) {
  const subtotalDec = new Decimal(item.subtotal)
  const itemKey = item.itemType as keyof AmountSummaryI
  if (itemKey) {
    const sumKey = new Decimal(summary[itemKey])
    summary[itemKey] = parseFloat(sumKey.plus(subtotalDec).toString())
  }

  // HOSPITAL
  if (itemKey !== "PF") {
    const totalHospDec = new Decimal(summary.HOSPITAL)
    const newTotalHosp = totalHospDec.plus(subtotalDec)
    summary.HOSPITAL = parseFloat(newTotalHosp.toString())
  }

  // TOTAL SALES
  const totalSalesDec = new Decimal(summary.TOTAL_SALES)
  const newTotalSalesSummary = totalSalesDec.plus(subtotalDec)
  summary.TOTAL_SALES = parseFloat(newTotalSalesSummary.toString())

  // AMOUNT DUE
  const totalDec = new Decimal(summary.AMOUNT_DUE)
  const newSummary = totalDec.plus(subtotalDec)
  summary.AMOUNT_DUE = parseFloat(newSummary.toString())

  return summary
}

function setPaymentSummaryAmount(summary: AmountSummaryI, item: PaymentItem) {
  const amount = new Decimal(item?.amount ?? 0)
  const totalAmt = new Decimal(summary.HOSPITAL)
  const newTotalAmt = totalAmt.plus(amount).toString()
  summary.HOSPITAL = parseFloat(newTotalAmt)
  summary.AMOUNT_DUE = parseFloat(newTotalAmt)

  return summary
}

export function setSummaryAmount(
  paymentType: PaymentType,
  summary: AmountSummaryI,
  records: PaymentItem | BillingItem
) {
  switch (paymentType) {
    case "folio-payments":
      summary = setFolioSummaryAmount(summary, records as BillingItem)
      break
    case "otc-payments":
      summary = setFolioSummaryAmount(summary, records as BillingItem)
      break
    default:
      summary = setPaymentSummaryAmount(summary, records as PaymentItem)
      break
  }

  console.log(summary, "summary")

  return summary
}
