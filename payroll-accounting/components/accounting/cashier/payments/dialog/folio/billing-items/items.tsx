import { FormInput } from "@/components/common"
import { BillingItem } from "@/graphql/gql/graphql"
import { SearchOutlined } from "@ant-design/icons"
import { gql, useQuery } from "@apollo/client"
import { Form, Table } from "antd"
import { Dispatch, useEffect } from "react"
import styled from "styled-components"
import { BillingItemAction, BillingItemState } from "."
import { getFolioItemsColumn } from "./utils"
import { TableCSS } from "@/components/common/custom/styles"

const FOLIO_ITEM_LIST = gql`
  query (
    $filter: String
    $itemType: String
    $billing: UUID
    $startDate: String
  ) {
    paymentFolioItemList(
      filter: $filter
      itemType: $itemType
      billing: $billing
      startDate: $startDate
    ) {
      id
      transactionDate
      recordNo
      description
      itemType
      qty: quantity
      price
      subtotal: subTotal
      credit
      tmpBalance
      vatable
      vatOutputTax
      vatableSales
    }
  }
`

interface BillingItemProps {
  hide: (selectedItems?: BillingItem[]) => void
  itemType: string
  billing: string
  startDate: string
  state: BillingItemState
  dispatch: Dispatch<BillingItemAction>
}
export default function FolioItemList(props: BillingItemProps) {
  return <></>
}

const ItemsContainer = styled.div`
  .ant-table-wrapper {
    min-height: 270px;
  }
`
