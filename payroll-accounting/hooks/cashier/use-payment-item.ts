import { PaymentType } from "@/components/accounting/cashier/payments/data-types/types"
import { PaymentItem } from "@/graphql/gql/graphql"
import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import { OptionProps } from "antd/es/select"
import { DocumentNode } from "graphql"
import { useEffect, useState } from "react"

export interface QueryHooksParams<T, D> {
  variables: T
  onComplete?: (resp?: D[] | null) => void
}

interface UseSearchPaymentItemsParams {
  id?: string
  filter?: string
  paymentType: PaymentType
  page?: number
  size?: number
}

type CustomerTypes = "HMO" | "CORPORATE" | "PERSONAL" | "PROMISSORY_NOTE"
interface PaymentItemQueryVariables {
  id?: string
  filter?: string
  pageNo?: number
  pageSize?: number
  type?: CustomerTypes
}

function getQueryFields(variables: UseSearchPaymentItemsParams): {
  query: DocumentNode
  fields: PaymentItemQueryVariables
} {
  const { id, paymentType, filter } = variables
  let query: DocumentNode | null = null
  let fields: PaymentItemQueryVariables = {}

  switch (paymentType) {
    case "project-payments":
      query = gql``
      fields.id = id
      fields.filter = filter
      break
    default:
      query = gql``
      fields.filter = filter ?? ""
      fields.pageNo = variables?.page ?? 0
      fields.pageSize = variables?.size ?? 0
      break
  }

  return { query, fields }
}

function mapQueryResult(result: any, paymentType: PaymentType): PaymentItem[] {
  let mappedResult: PaymentItem[] = []
  console.log(result, "result")
  console.log(paymentType, "paymentType")

  switch (paymentType) {
    case "project-payments":
      mappedResult = (result?.paymentItems ?? []).map(
        (item: any) =>
          ({
            id: item.id,
            itemName: `SUBSCRIPTION ${item.subscriptionCode}`,
            description: `--`,
            qty: 1,
            price: item.balance,
            amount: item.balance,
          } as PaymentItem)
      )
      break
    default:
      mappedResult = result?.paymentItems?.list ?? []
      break
  }

  return mappedResult
}

export const useSearchPaymentItems = ({
  variables,
  ...props
}: QueryHooksParams<UseSearchPaymentItemsParams, PaymentItem>) => {
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<PaymentItem[]>([])

  const refetch = async ({
    variables,
    ...props
  }: QueryHooksParams<UseSearchPaymentItemsParams, PaymentItem>) => {
    const fetchHooks = async () => {
      try {
        setLoading(true)
        const { query, fields } = getQueryFields(variables)
        const { data } = await client.query({
          query,
          variables: { ...fields },
        })
        const fetchedPaymentItems = mapQueryResult(
          data.paymentItems,
          variables.paymentType
        )
        setHooks(fetchedPaymentItems)
        if (props.onComplete) props.onComplete(fetchedPaymentItems)
      } catch (error) {
        setLoading(false)
        console.error("Error fetching billing data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHooks()
  }

  useEffect(() => {
    setLoading(true)
    const fetchHooks = async () => {
      try {
        const { query, fields } = getQueryFields(variables)
        const { data } = await client.query({
          query,
          variables: { ...fields },
        })

        console.log(data, "data")
        const fetchedPaymentItems = mapQueryResult(data, variables.paymentType)
        setHooks(fetchedPaymentItems)
        if (props.onComplete) props.onComplete(fetchedPaymentItems)
      } catch (error) {
        setLoading(false)
        console.error("Error fetching billing data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables?.id, variables?.filter, variables?.paymentType])
  // Empty dependency array to run only once on component mount

  return { data: hooks, refetch, loading }
}

export interface LazyQueryHooksParams<D> {
  onComplete?: (resp?: D[]) => void
}

type SearchResult = {
  loading: boolean
  data: PaymentItem[]
}

export const useLazySearchPaymentItem = (
  props?: LazyQueryHooksParams<PaymentItem>
): [
  ({
    variables,
    ...params
  }: QueryHooksParams<
    UseSearchPaymentItemsParams,
    PaymentItem
  >) => Promise<void>,
  SearchResult
] => {
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<PaymentItem[]>([])

  const func = async ({
    variables,
    ...params
  }: QueryHooksParams<UseSearchPaymentItemsParams, PaymentItem>) => {
    const fetchHooks = async () => {
      try {
        setLoading(true)
        const { query, fields } = getQueryFields(variables)
        const { data } = await client.query({
          query,
          variables: { ...fields },
        })
        const fetchedPaymentItems = mapQueryResult(data, variables.paymentType)
        setHooks(fetchedPaymentItems)
        if (props?.onComplete) props?.onComplete(fetchedPaymentItems)
        if (params.onComplete) params.onComplete(fetchedPaymentItems)
      } catch (error) {
        setLoading(false)
        console.error("Error fetching billing data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHooks()
  }

  return [func, { loading, data: hooks }]
}
