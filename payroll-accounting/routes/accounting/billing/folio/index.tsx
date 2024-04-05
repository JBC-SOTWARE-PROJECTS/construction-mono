import Folio from "@/components/accounting/billing/features/folio"
import { GET_BILLING_INFO_BY_ID } from "@/graphql/billing/queries"
import { Billing, Query } from "@/graphql/gql/graphql"
import { useQuery } from "@apollo/client"
import { Divider, type ColProps, Typography, message } from "antd"
import { useReducer } from "react"
import styled from "styled-components"

interface Iprops {
  id?: string
  type?: string
}

type Reducer<S, A> = (state: S, action: A) => S

interface FolioState {
  billing: Billing | null
}

type FolioAction = { type: "set-billing"; payload: Billing }

const reducer: Reducer<FolioState, FolioAction> = (
  state,
  { type, payload }
) => {
  switch (type) {
    case "set-billing":
      return { ...state, billing: payload }
    default:
      return state
  }
}

export default function BillingFolioComponent(props: Iprops) {
  const { id, type } = props

  const [state, dispatch] = useReducer(reducer, { billing: null })
  const [messageApi, contextHolder] = message.useMessage()

  const { loading: onLoadingBilling, refetch: onRefetchBilling } =
    useQuery<Query>(GET_BILLING_INFO_BY_ID, {
      fetchPolicy: "cache-and-network",
      variables: {
        id: id,
      },
      onCompleted: (data) => {
        let result = data?.billingById as Billing
        if (result?.id) {
          dispatch({ type: "set-billing", payload: result })
        }
      },
    })

  const header = {
    billing: state.billing,
    messageApi,
    onRefetchBilling,
  }

  const refetch = {
    onRefetchBilling,
  }

  return (
    <Folio {...{ header, refetch, messageApi }}>
      {contextHolder}
      <Folio.Header />
      <Divider dashed orientation="left">
        <b>Folio Transaction(s)</b>
      </Divider>
      <Folio.Tabs />
    </Folio>
  )
}

const CardFlex = styled.div`
  height: 100%;
  .ant-card {
    height: 100%;
  }
`

const InfoContainer = styled.div`
  height: 100%;
`
