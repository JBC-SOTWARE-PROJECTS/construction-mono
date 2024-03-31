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
  prNos: string[];
}
