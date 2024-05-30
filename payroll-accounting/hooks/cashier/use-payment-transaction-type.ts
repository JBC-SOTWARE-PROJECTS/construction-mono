import { Billing, PaymentTransactionType } from "@/graphql/gql/graphql"
import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import { useState, useEffect } from "react"

const PAYMENT_TRANSACTION_TYPE = gql`
  query ($filter: String, $pageSize: Int, $pageNo: Int) {
    paymentTransactionTypePage: listPageablePaymentTransactionTypes(
      filter: $filter
      pageSize: $pageSize
      pageNo: $pageNo
    ) {
      content {
        id
        typeName
        miscType
        payorType
        description
        accounts {
          account {
            accountType
            code
            description
          }
          amount
        }
        referenceType {
          name
          value
        }
      }
      totalElements
      totalPages
      size
      number
    }
  }
`

interface UsePaymentTransactionTypePageData {
  content: PaymentTransactionType[] | null
  number: number
  size: number
  totalElements: number
  totalPages: number
}

export interface QueryHooksParams<T, D> {
  variables?: T
  onComplete?: (resp?: UsePaymentTransactionTypePageData) => void
}

interface UsePaymentTransactionTypePageParams {
  filter?: string
  size?: number
  page?: number
}

interface UsePaymentTransactionTypePageRefetchParams {
  filter?: string
  size?: number
  page?: number
  onComplete?: (resp?: UsePaymentTransactionTypePageData) => void
}

export const usePaymentTransactionTypePage = (
  props?: QueryHooksParams<
    UsePaymentTransactionTypePageParams,
    PaymentTransactionType
  >
) => {
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<UsePaymentTransactionTypePageData>({
    content: [],
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  })

  const refetch = async (
    props?: UsePaymentTransactionTypePageRefetchParams
  ) => {
    try {
      setLoading(true)
      const { data } = await client.query({
        query: PAYMENT_TRANSACTION_TYPE,
        variables: {
          filter: props?.filter ?? "",
          pageSize: props?.size ?? 10,
          pageNo: props?.page ?? 0,
        },
      })
      const paymentTransactionTypePage = data.paymentTransactionTypePage
      setHooks(paymentTransactionTypePage)
    } catch (error) {
      setLoading(false)
      console.error("Error fetching hooks:", error)
    } finally {
      setLoading(false)
      if (props?.onComplete) props?.onComplete(hooks)
    }
  }

  useEffect(() => {
    setLoading(true)
    const fetchHooks = async () => {
      try {
        const { data } = await client.query({
          query: PAYMENT_TRANSACTION_TYPE,
          variables: {
            filter: "",
            pageSize: 10,
            pageNo: 0,
            ...(props?.variables ?? {}),
          },
        })
        const fetchedPaymentTransactionTypeData =
          data.paymentTransactionTypePage
        setHooks(fetchedPaymentTransactionTypeData)
        if (props?.onComplete)
          props?.onComplete(fetchedPaymentTransactionTypeData)
      } catch (error) {
        setLoading(false)
        console.error("Error fetching billing data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // Empty dependency array to run only once on component mount

  return { data: hooks, refetch, loading }
}
