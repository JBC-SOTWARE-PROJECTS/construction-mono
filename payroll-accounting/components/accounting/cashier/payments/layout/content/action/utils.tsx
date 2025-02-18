import { Billing, BillingItem, PaymentItem } from "@/graphql/gql/graphql";
import { FolioItemsI, TerminalDetails } from "../../../data-types/interfaces";
import { NextRouter } from "next/router";
import { PaymentType } from "../../../data-types/types";

interface folioParams {
  folioItems?: FolioItemsI;
  billing?: Billing | null;
  terminalDetails?: TerminalDetails;
}

interface folioFields {
  fields: {
    receiptType?: string | null;
    // batchReceiptId?: string | null
    shiftId?: string | null;
    billingId?: string | null;
  };
}

export const getFolioFields = (params: folioParams): folioFields => {
  const billing = params.billing;
  const { batchReceiptId, shiftId, receiptType, nextReceiptNo } =
    params?.terminalDetails ?? {
      type: "",
      batchReceiptId: "",
      shiftId: "",
    };

  const fields = {
    batchId: batchReceiptId,
    receiptNo: nextReceiptNo,
    receiptType,
    shiftId,
    billingId: billing?.id,
  };

  return {
    fields,
  };
};

export const onCompletePayment = (
  response: string,
  paymentType: PaymentType,
  router: NextRouter
) => {
  if (response == "print") {
    window.location.reload();
  }
  if (response == "new") {
    window.location.reload();
  }
  if (response == "close") {
    router.push(`/accounting/cashier`);
  }
};
