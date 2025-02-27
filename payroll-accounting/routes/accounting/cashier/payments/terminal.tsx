import TerminalWindow from "@/components/accounting/cashier/payments";
import {
  AmountSummaryI,
  TerminalDetails,
  TerminalWindowsAction,
  TerminalWindowsState,
} from "@/components/accounting/cashier/payments/data-types/interfaces";
import {
  GenderType,
  PaymentType,
  PayorType,
} from "@/components/accounting/cashier/payments/data-types/types";
import SearchPayorMC from "@/components/accounting/cashier/payments/dialog/customer";
import TerminalWindowFolioItemListDialog from "@/components/accounting/cashier/payments/dialog/folio/billing-items";
import TerminalWindowPaymentItemsDialog from "@/components/accounting/cashier/payments/dialog/payment-items";
import {
  quickActionFolioPayments,
  quickActionSelectPaymentItems,
} from "@/components/accounting/cashier/payments/layout/content/quick-option/utils";
import { setSummaryAmount } from "@/components/accounting/cashier/payments/utils";
import calculateNewPaymentItems, {
  getTotalAmountTendered,
} from "@/components/accounting/cashier/payments/utils/calculations";
import { onHandleSelectPayor } from "@/components/accounting/cashier/payments/utils/func";
import PaymentAuth, { PaymentAuthContext } from "@/context/PaymentAuth";
import { BillingItem, PaymentItem } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import useMacAddress from "@/hooks/cashier/use-mac-address";
import { getRandomBoyGirl } from "@/utility/helper";
import { IUserEmployee } from "@/utility/interfaces";
import { gql, useLazyQuery } from "@apollo/client";
import { Form, Layout } from "antd";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useReducer } from "react";

const { Content } = Layout;

const DEFAULT_FOLIO = gql`
  query ($id: UUID, $type: String) {
    paymentItems: getDefaultPaymentItems(id: $id, type: $type) {
      id
      itemName
      description
      unit
      qty
      price
      vat
      vatExempt
      vatZero_rated_sales
      discount
      withholdingTax
      retention
      recoupment
      amount
      isVoided
      referenceItemType
      referenceItemId
      tmpSubTotal
    }
  }
`;

const reducer = (
  state: TerminalWindowsState,
  { type, payload }: TerminalWindowsAction
) => {
  switch (type) {
    case "set-payor":
      return { ...state, payor: payload };
    case "set-receipt-type":
      return { ...state, receiptType: payload };
    case "set-billing":
      return { ...state, billing: payload };
    case "set-payment-methods":
      return { ...state, paymentMethods: payload };
    case "add-payment-items":
      let currentItems = [...(state?.paymentItems ?? [])];
      if (Array.isArray(payload)) {
        payload.map((plItems) => {
          currentItems = calculateNewPaymentItems(
            currentItems,
            plItems,
            state.paymentType
          );
        });
      } else {
        currentItems = calculateNewPaymentItems(
          currentItems,
          payload,
          state.paymentType
        );
      }
      return {
        ...state,
        paymentItems: currentItems,
      };
    case "set-payment-items":
      return { ...state, paymentItems: payload };
    case "set-random-gender":
      return { ...state, randomGender: payload };
    default:
      return state;
  }
};

const PaymentTerminal = (props: IUserEmployee) => {
  const folioItemsDialog = useDialog(TerminalWindowFolioItemListDialog);
  const paymentItemsDialog = useDialog(TerminalWindowPaymentItemsDialog);
  const payorDialog = useDialog(SearchPayorMC);

  const { query, push } = useRouter();
  const [form] = Form.useForm();

  const paymentAuth = useContext(PaymentAuthContext);

  const [state, dispatch] = useReducer(reducer, {
    receiptType: "OR",
    paymentType: query["payment-type"] as PaymentType,
    payor: null,
    billing: null,
    randomGender: getRandomBoyGirl() as GenderType,
    paymentMethods: [],
    paymentItems: [],
  });

  const [fetchDefaultFolioItems, { loading: folioDefaultItemLoading }] =
    useLazyQuery(DEFAULT_FOLIO, {
      onCompleted: (data) => {
        const paymentItems = data?.paymentItems;
        if (paymentItems)
          dispatch({
            type: "set-payment-items",
            payload: paymentItems,
          });
      },
    });

  const onAddItems = (paymentType: PaymentType) => {
    const type = query["payment-type"] as PaymentType;
    const id = query["id"] as string;
    switch (type) {
      case "project-payments":
        return quickActionFolioPayments(
          folioItemsDialog,
          state.billing,
          dispatch
        );
        break;
      case "otc-payments":
        return quickActionFolioPayments(
          folioItemsDialog,
          state.billing,
          dispatch
        );
        break;
      default:
        return quickActionSelectPaymentItems(
          id,
          paymentItemsDialog,
          dispatch,
          paymentType
        );
        break;
    }
  };

  const totalAmountTendered = useMemo(
    () => getTotalAmountTendered(state.paymentMethods ?? []),
    [state.paymentMethods]
  );

  const amountSummary = useMemo(() => {
    const paymentType = query["payment-type"] as PaymentType;

    let rows: BillingItem[] | PaymentItem[] = [];

    rows = [...state.paymentItems] as PaymentItem[];

    return rows.reduce(
      (summary, item) => {
        return setSummaryAmount(paymentType, summary, item);
      },
      {
        RECOUPMENT: 0,
        RETENTION: 0,
        TOTAL_SALES: 0,
        LESS_VAT: 0,
        AMOUNT_NET_VAT: 0,
        LESS_DISC: 0,
        LESS_WITHOLDING_TAX: 0,
        AMOUNT_DUE: 0,
      } as AmountSummaryI
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.paymentItems]);

  const terminalDetails: TerminalDetails = {
    macAddress: paymentAuth?.macAddress ?? "",
    receiptType: paymentAuth?.receiptType,
    nextReceiptNo: paymentAuth?.nextReceiptNo,
    shift: paymentAuth?.shiftNo,
    shiftId: paymentAuth?.shiftId,
    terminalId: paymentAuth?.terminalId,
    terminalName: paymentAuth?.terminalNo,
    batchReceiptId: paymentAuth?.batchId,
  };

  // 879c079a-eb7b-4781-9b24-e2f1f127f4a5

  const id = query["doc-id"] as PaymentType;
  const paymentType = query["payment-type"] as PaymentType;
  const payorType = (
    query["payor-type"] ? (query["payor-type"] as string).toUpperCase() : null
  ) as PayorType;

  useEffect(() => {
    // Function to handle keydown events
    const handleKeyDown = (event: KeyboardEvent) => {
      const paymentType = query["payment-type"] as PaymentType;
      const payorType = (query["payor-type"] ?? null) as PayorType;
      const key = event.key;
      switch (key) {
        case "F2":
          event.preventDefault();
          onHandleSelectPayor(payorType, paymentType, payorDialog, push);
          break;
        case "F3":
          event.preventDefault();
          if (state.billing?.locked) onAddItems(paymentType);
          break;
        default:
          break;
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentType, state.billing]);

  useEffect(() => {
    if (state.payor && paymentAuth?.shiftNo) {
      if (paymentType == "project-payments") {
        if (state.billing?.locked) {
          fetchDefaultFolioItems({
            variables: {
              id: state.billing?.id,
              type: "project-payments",
            },
          });
        } else {
          console.log("setting default ...");
          dispatch({
            type: "set-payment-items",
            payload: [],
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.payor]);

  return (
    <TerminalWindow
      {...{
        id,
        paymentType: (query["payment-type"] ??
          "project-payments") as PaymentType,
        payorType,
        login: props?.user?.login,
        form,
        terminalDetails,
        state,
        dispatch,
        totalAmountTendered,
        amountSummary,
        onAddItems,
        cashierRefetch: async () => {},
      }}
    >
      <TerminalWindow.Header />
      <TerminalWindow.Content />
      <TerminalWindow.Footer />
      <Content style={{ padding: "0 48px" }}>{/* Your content */}</Content>
    </TerminalWindow>
  );
};

export default PaymentTerminal;
