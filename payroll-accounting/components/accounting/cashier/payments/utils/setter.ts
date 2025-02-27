import { BillingItem, PaymentItem } from "@/graphql/gql/graphql";
import {
  AmountSummaryI,
  PaymentQuickOptions,
  TerminalWindowProps,
  TerminalWindowsHeaderProps,
  TerminalWindowsPaymentMethod,
  TerminalWindowsPayor,
} from "../data-types/interfaces";
import { PaymentType } from "../data-types/types";
import Decimal from "decimal.js";

export function setHeaderProps(
  context: TerminalWindowProps
): TerminalWindowsHeaderProps {
  return {
    userName: context.login,
    randomGender: context.state.randomGender,
    paymentType: context.paymentType,
    nextReceiptNo: context.terminalDetails?.nextReceiptNo ?? "",
    receiptType: context.terminalDetails?.receiptType ?? null,
  };
}

export function setPayorProps(
  context: TerminalWindowProps
): TerminalWindowsPayor {
  const state = context.state;
  return {
    id: context.id,
    billing: state.billing,
    payor: state.payor,
    payorType: context.payorType,
    randomGender: state.randomGender,
    paymentType: context.paymentType,
    dispatch: context.dispatch,
  };
}

export function setPaymentMethodProps(
  context: TerminalWindowProps
): TerminalWindowsPaymentMethod {
  return {
    paymentMethods: context.state.paymentMethods,
    form: context.form,
    totalAmountTendered: context.totalAmountTendered,
    dispatch: context.dispatch,
  };
}

export function setQuickOptionsProps(
  context: TerminalWindowProps
): PaymentQuickOptions {
  return {
    payorType: context.payorType,
    login: context.login,
    billing: context.state.billing,
    paymentType: context.paymentType,
    dispatch: context.dispatch,
    state: context.state,
    onAddItems: context.onAddItems,
  };
}

function setPaymentSummaryAmount(summary: AmountSummaryI, item: PaymentItem) {
  const amount = new Decimal(item?.amount ?? 0);
  const tmpSubTotal = new Decimal(item?.tmpSubTotal ?? 0);

  // TOTAL SALES
  const totalSalesSummary = new Decimal(summary.TOTAL_SALES);
  const newTotalSalesSummary = totalSalesSummary.plus(tmpSubTotal).toString();
  summary.TOTAL_SALES = parseFloat(newTotalSalesSummary);

  summary.AMOUNT_NET_VAT = parseFloat(newTotalSalesSummary);

  // VAT
  const vatSummary = new Decimal(summary.LESS_VAT);
  const vat = new Decimal(item?.vat ?? 0);
  const newVat = vatSummary.plus(vat).toString();
  summary.LESS_VAT = parseFloat(newVat);

  // RECOUPMENT
  const recoupmentSummary = new Decimal(summary.RECOUPMENT);
  const recoupment = new Decimal(item?.recoupment ?? 0);
  const newRecoupment = recoupmentSummary.plus(recoupment).toString();
  summary.RECOUPMENT = parseFloat(newRecoupment);

  // RECOUPMENT
  const retentionSummary = new Decimal(summary.RETENTION);
  const retention = new Decimal(item?.retention ?? 0);
  const newRetention = retentionSummary.plus(retention).toString();
  summary.RETENTION = parseFloat(newRetention);

  // WITHHOLDING TAX
  const withholdingTaxSummary = new Decimal(summary.LESS_WITHOLDING_TAX);
  const withholdingTax = new Decimal(item?.withholdingTax ?? 0);
  const newWithholdingTax = withholdingTaxSummary
    .plus(withholdingTax)
    .toString();
  summary.LESS_WITHOLDING_TAX = parseFloat(newWithholdingTax);

  // AMOUNT DUE
  const totalAmt = new Decimal(summary.AMOUNT_DUE);
  const newTotalAmt = totalAmt.plus(amount).toString();
  summary.AMOUNT_DUE = parseFloat(newTotalAmt);

  return summary;
}

export function setSummaryAmount(
  paymentType: PaymentType,
  summary: AmountSummaryI,
  records: PaymentItem | BillingItem
) {
  summary = setPaymentSummaryAmount(summary, records as PaymentItem);

  return summary;
}
