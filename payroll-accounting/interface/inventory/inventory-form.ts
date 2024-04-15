import { OptionsValue } from "@/utility/interfaces";
import { Dayjs } from "dayjs";

export interface IFormPurchaseRequest {
  prDateNeeded: Dayjs;
  requestedOffice: string;
  prType: string;
  supplier: OptionsValue;
  category: string;
  project: string;
  assets: string;
  remarks: string;
}

export interface IFormPurchaseOrder {
  preparedDate: Dayjs;
  etaDate: Dayjs;
  paymentTerms: string;
  supplier: OptionsValue;
  category: string;
  project: string;
  assets: string;
  remarks: string;
  prNos: string;
}

export interface IFromReturnSupplier {
  returnDate: Dayjs;
  office: string;
  supplier: OptionsValue;
  receivedRefNo: string;
  receivedRefDate: Dayjs;
  received_by: string;
  returnBy: string;
  transType: string;
}

export interface IFormItemIssuance {
  issueDate: Dayjs;
  issueTo: string;
  issueType: string;
  received_by: string;
  category: string;
  project: string;
  assets: string;
  remarks: string;
}

export interface IFormReceivingReport {
  receiveDate: Dayjs;
  receivedRefDate: Dayjs;
  receivedRefNo: string;
  purchaseOrder: string;
  supplier: OptionsValue;
  receivedOffice: string;
  paymentTerms: string;
  account: string;
  category: string;
  project: string;
  assets: string;
  receivedRemarks: string;
  grossAmount: number;
  inputTax: number;
  totalDiscount: number;
  netAmount: number;
  netDiscount: number;
  amount: number;
  vatRate: number;
  vatInclusive: boolean;
}
