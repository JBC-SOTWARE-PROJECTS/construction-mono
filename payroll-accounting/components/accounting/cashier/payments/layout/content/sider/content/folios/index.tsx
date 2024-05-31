import {
  AmountSummaryI,
  FolioItemsI,
  TerminalWindowsAction,
} from "@/components/accounting/cashier/payments/data-types/interfaces"
import { Billing, BillingItemType } from "@/graphql/gql/graphql"
import { Collapse, Typography } from "antd"
import numeral from "numeral"
import { Dispatch } from "react"
import { CSSProp } from "styled-components"
import { FolioItems } from "./utils"
import PaymentItemsEmptyContent from "../payment-items/utils"
import {
  PaymentType,
  Payor,
} from "@/components/accounting/cashier/payments/data-types/types"

const style: CSSProp = {
  backgroundColor: "white",
}

type Props = {
  paymentType: PaymentType
  onAddItems: (paymentType: PaymentType) => void
  folioItems?: FolioItemsI
  dispatch: Dispatch<TerminalWindowsAction>
  amountSummary: AmountSummaryI
  billing?: Billing | null
}

const ItemLabel = (props: { label: string }) => (
  <Typography.Text style={{ color: "#399b53" }} strong>
    {props.label}
  </Typography.Text>
)

export default function FoliosContent(props: Props) {
  function getFoliosContentCol() {
    const items: any = []

    const roomBoard = props?.folioItems?.ROOMBOARD ?? []
    if (roomBoard.length > 0) {
      items.push({
        key: "room-board",
        label: <ItemLabel label=" Rooms and Board" />,
        children: (
          <FolioItems
            {...{
              dispatch: props?.dispatch,
              items: props?.folioItems?.ROOMBOARD ?? [],
              itemType: BillingItemType.Roomboard,
            }}
          />
        ),
        style,
        extra: (
          <Typography.Text italic>
            {numeral(props?.amountSummary?.ROOMBOARD ?? 0).format("0,0.00")}
          </Typography.Text>
        ),
      })
    }

    const supplies = props?.folioItems?.SUPPLIES ?? []
    if (supplies.length > 0) {
      items.push({
        key: "supplies",
        label: <ItemLabel label="Supplies" />,
        children: (
          <FolioItems
            {...{
              dispatch: props?.dispatch,
              items: props?.folioItems?.SUPPLIES ?? [],
              itemType: BillingItemType.Supplies,
            }}
          />
        ),
        style,
        extra: (
          <Typography.Text italic>
            {numeral(props?.amountSummary?.SUPPLIES ?? 0).format("0,0.00")}
          </Typography.Text>
        ),
      })
    }

    const diagnostics = props?.folioItems?.DIAGNOSTICS ?? []
    if (diagnostics.length > 0) {
      items.push({
        key: "laboratory-diagnostics",
        label: <ItemLabel label="Laboratory and Diagnostics" />,
        children: (
          <FolioItems
            {...{
              dispatch: props?.dispatch,
              items: props?.folioItems?.DIAGNOSTICS ?? [],
              itemType: BillingItemType.Diagnostics,
            }}
          />
        ),
        style,
        extra: (
          <Typography.Text italic>
            {numeral(props?.amountSummary?.DIAGNOSTICS ?? 0).format("0,0.00")}
          </Typography.Text>
        ),
      })
    }

    const medicines = props?.folioItems?.MEDICINES ?? []
    if (medicines.length > 0) {
      items.push({
        key: "medicines",
        label: <ItemLabel label="Medicines" />,
        children: (
          <FolioItems
            {...{
              dispatch: props?.dispatch,
              items: props?.folioItems?.MEDICINES ?? [],
              itemType: BillingItemType.Medicines,
            }}
          />
        ),
        style,
        extra: (
          <Typography.Text italic>
            {numeral(props?.amountSummary?.MEDICINES ?? 0).format("0,0.00")}
          </Typography.Text>
        ),
      })
    }

    const cathlab = props?.folioItems?.CATHLAB ?? []
    if (cathlab.length > 0) {
      items.push({
        key: "catheterization",
        label: <ItemLabel label="Catheterization Laboratory" />,
        children: (
          <FolioItems
            {...{
              dispatch: props?.dispatch,
              items: props?.folioItems?.CATHLAB ?? [],
              itemType: BillingItemType.Cathlab,
            }}
          />
        ),
        style,
        extra: (
          <Typography.Text italic>
            {numeral(props?.amountSummary?.CATHLAB ?? 0).format("0,0.00")}
          </Typography.Text>
        ),
      })
    }

    const orfee = props?.folioItems?.ORFEE ?? []
    if (orfee.length > 0) {
      items.push({
        key: "operating",
        label: <ItemLabel label="Operating Room" />,
        children: (
          <FolioItems
            {...{
              dispatch: props?.dispatch,
              items: props?.folioItems?.ORFEE ?? [],
              itemType: BillingItemType.Orfee,
            }}
          />
        ),
        style,
        extra: (
          <Typography.Text italic>
            {numeral(props?.amountSummary?.ORFEE ?? 0).format("0,0.00")}
          </Typography.Text>
        ),
      })
    }

    const pf = props?.folioItems?.PF ?? []
    if (pf.length > 0) {
      items.push({
        key: "professional-fees",
        label: <ItemLabel label="Professional Fees" />,
        children: (
          <FolioItems
            {...{
              dispatch: props?.dispatch,
              items: props?.folioItems?.PF ?? [],
              itemType: BillingItemType.Pf,
            }}
          />
        ),
        style,
        extra: (
          <Typography.Text italic>
            {numeral(props?.amountSummary?.PF ?? 0).format("0,0.00")}
          </Typography.Text>
        ),
      })
    }

    const others = props?.folioItems?.OTHERS ?? []
    if (others.length > 0) {
      items.push({
        key: "misc",
        label: <ItemLabel label="Miscellaneous" />,
        children: (
          <FolioItems
            {...{
              dispatch: props?.dispatch,
              items: props?.folioItems?.OTHERS ?? [],
              itemType: BillingItemType.Others,
            }}
          />
        ),
        style,
        collapsible: "header",
        extra: (
          <Typography.Text italic>
            {numeral(props?.amountSummary?.OTHERS ?? 0).format("0,0.00")}
          </Typography.Text>
        ),
      })
    }

    return items
  }

  const items = getFoliosContentCol()

  if (items.length == 0) {
    return (
      <PaymentItemsEmptyContent
        {...{
          onAddItems: props.onAddItems,
          paymentType: props.paymentType,
          billing: props?.billing,
        }}
      />
    )
  }

  return (
    <Collapse
      items={items}
      bordered={false}
      collapsible="disabled"
      defaultActiveKey={[
        "room-board",
        "supplies",
        "laboratory-diagnostics",
        "medicines",
        "catheterization",
        "operating",
        "professional-fees",
        "misc",
      ]}
    />
  )
}
