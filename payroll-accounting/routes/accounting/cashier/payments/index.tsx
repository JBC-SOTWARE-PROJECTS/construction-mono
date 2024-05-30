import TerminalWindow from "@/components/accounting/cashier/payments"
import {
  AmountSummaryI,
  FolioItemsI,
  PaymentMethod,
  TerminalDetails,
  TerminalWindowsAction,
  TerminalWindowsState,
} from "@/components/accounting/cashier/payments/data-types/interfaces"
import {
  GenderType,
  PaymentType,
  PayorType,
} from "@/components/accounting/cashier/payments/data-types/types"
import SearchPayorMC from "@/components/accounting/cashier/payments/dialog/customer"
import TerminalWindowFolioItemListDialog from "@/components/accounting/cashier/payments/dialog/folio/billing-items"
import InvoiceItemsOutstandingRecords from "@/components/accounting/cashier/payments/dialog/invoice-items"
import TerminalWindowPaymentItemsDialog from "@/components/accounting/cashier/payments/dialog/payment-items"
import {
  quickActionFolioPayments,
  quickActionSelectInvoiceItems,
  quickActionSelectPaymentItems,
} from "@/components/accounting/cashier/payments/layout/content/quick-option/utils"
import { setSummaryAmount } from "@/components/accounting/cashier/payments/utils"
import calculateNewPaymentItems, {
  getTotalAmountTendered,
} from "@/components/accounting/cashier/payments/utils/calculations"
import { onHandleSelectPayor } from "@/components/accounting/cashier/payments/utils/func"
import { BillingItem, PaymentItem } from "@/graphql/gql/graphql"
import { useDialog } from "@/hooks"
import { useCashier } from "@/hooks/cashier/use-cashier"
import useMacAddress from "@/hooks/cashier/use-mac-address"
import { getRandomBoyGirl } from "@/utility/helper"
import { IUserEmployee } from "@/utility/interfaces"
import { Form, Layout } from "antd"
import Decimal from "decimal.js"
import { useRouter } from "next/router"
import { useEffect, useMemo, useReducer } from "react"

const { Content } = Layout

const reducer = (
  state: TerminalWindowsState,
  { type, payload }: TerminalWindowsAction
) => {
  switch (type) {
    case "set-payor":
      return { ...state, payor: payload }
    case "set-billing":
      return { ...state, billing: payload }
    case "set-payment-methods":
      return { ...state, paymentMethods: payload }
    case "add-payment-items":
      let currentItems = [...(state?.paymentItems ?? [])]
      if (Array.isArray(payload)) {
        payload.map((plItems) => {
          currentItems = calculateNewPaymentItems(
            currentItems,
            plItems,
            state.paymentType
          )
        })
      } else {
        currentItems = calculateNewPaymentItems(
          currentItems,
          payload,
          state.paymentType
        )
      }
      return {
        ...state,
        paymentItems: currentItems,
      }
    case "set-payment-items":
      return { ...state, paymentItems: payload }
    case "set-random-gender":
      return { ...state, randomGender: payload }
    case "set-folio-items":
      return { ...state, folioItems: payload }
    case "set-folio-items-by-type":
      return { ...state, folioItems: { ...state.folioItems, ...payload } }
    default:
      return state
  }
}

const TerminalWindows = (props: IUserEmployee) => {
  const folioItemsDialog = useDialog(TerminalWindowFolioItemListDialog)
  const paymentItemsDialog = useDialog(TerminalWindowPaymentItemsDialog)
  const invoiceItemsDialog = useDialog(InvoiceItemsOutstandingRecords)
  const payorDialog = useDialog(SearchPayorMC)

  const { query, push } = useRouter()
  const [form] = Form.useForm()
  const [state, dispatch] = useReducer(reducer, {
    paymentType: query["payment-type"] as PaymentType,
    payor: null,
    billing: null,
    randomGender: getRandomBoyGirl() as GenderType,
    paymentMethods: [],
    paymentItems: [],
    folioItems: {
      ROOMBOARD: [],
      MEDICINES: [],
      SUPPLIES: [],
      DIAGNOSTICS: [],
      CATHLAB: [],
      ORFEE: [],
      PF: [],
      OTHERS: [],
    },
  })

  const { data: macAddress, loading: macAddressLoading } = useMacAddress()
  const {
    loading: cashierLoading,
    data: cashier,
    refetch: cashierRefetch,
  } = useCashier({
    variables: {
      type: "OR",
      macAddress,
    },
  })

  const onAddItems = (paymentType: PaymentType) => {
    const type = query["payment-type"] as PaymentType
    const id = query["id"] as string
    switch (type) {
      case "project-payments":
        return quickActionFolioPayments(
          folioItemsDialog,
          state.billing,
          state.folioItems,
          dispatch
        )
        break
      case "otc-payments":
        return quickActionFolioPayments(
          folioItemsDialog,
          state.billing,
          state.folioItems,
          dispatch
        )
        break
      default:
        return quickActionSelectPaymentItems(
          id,
          paymentItemsDialog,
          dispatch,
          paymentType
        )
        break
    }
  }

  const totalAmountTendered = useMemo(
    () => getTotalAmountTendered(state.paymentMethods ?? []),
    [state.paymentMethods]
  )

  const getAmountSummary = () => {}

  const amountSummary = useMemo(() => {
    const paymentType = query["payment-type"] as PaymentType

    let rows: BillingItem[] | PaymentItem[] = []

    rows = [...state.paymentItems] as PaymentItem[]

    return rows.reduce(
      (summary, item) => {
        return setSummaryAmount(paymentType, summary, item)
      },
      {
        ROOMBOARD: 0,
        MEDICINES: 0,
        SUPPLIES: 0,
        DIAGNOSTICS: 0,
        CATHLAB: 0,
        ORFEE: 0,
        PF: 0,
        OTHERS: 0,

        HOSPITAL: 0,
        TOTAL_SALES: 0,
        LESS_VAT: 0,
        AMOUNT_NET_VAT: 0,
        LESS_DISC: 0,
        LESS_WITHOLDING_TAX: 0,
        AMOUNT_DUE: 0,
      } as AmountSummaryI
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.folioItems, state.paymentItems])

  const terminalDetails: TerminalDetails = {
    macAddress,
    ...cashier,
    shift: cashier?.shiftId ?? "",
    shiftId: cashier?.shiftPk ?? "",
  }

  const paymentType = query["payment-type"] as PaymentType

  useEffect(() => {
    // Function to handle keydown events
    const handleKeyDown = (event: KeyboardEvent) => {
      const paymentType = query["payment-type"] as PaymentType
      const payorType = (query["payor-type"] ?? null) as PayorType
      const key = event.key
      switch (key) {
        case "F2":
          event.preventDefault()
          onHandleSelectPayor(payorType, paymentType, payorDialog, push)
          break
        case "F3":
          event.preventDefault()
          if (state.billing?.locked) onAddItems(paymentType)
          break
        default:
          break
      }
    }

    // Add event listener
    window.addEventListener("keydown", handleKeyDown)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentType, state.billing])

  return (
    <TerminalWindow
      {...{
        id: query["id"] as string,
        paymentType: query["payment-type"] as PaymentType,
        payorType: (query["payor-type"] ?? "") as PayorType,
        login: props?.user?.login,
        form,
        terminalDetails,
        state,
        dispatch,
        totalAmountTendered,
        amountSummary,
        onAddItems,
        cashierRefetch,
      }}
    >
      <TerminalWindow.Header />
      <TerminalWindow.Content />
      <TerminalWindow.Footer />
      <Content style={{ padding: "0 48px" }}>{/* Your content */}</Content>
    </TerminalWindow>
  )
}

export default TerminalWindows
