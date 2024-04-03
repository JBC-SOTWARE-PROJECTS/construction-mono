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
