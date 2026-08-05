import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import { useEffect, useState } from "react"

const GET_CASHIER_DATA = gql`
  query ($macAddress: String, $type: String) {
    cashierData: getCashierData(macAddress: $macAddress, type: $type) {
      type
      batchReceiptId
      nextAR
      nextOR
      notFound
      terminalId
      terminalName
      shiftId
      terminalCode
      shiftPk
    }
  }
`

export interface QueryHooksParams<T, D> {
  variables: T
  onComplete?: (resp?: D | null) => void
}

interface UseCashierParams {
  macAddress?: string
  type?: string
}

export const useCashier = ({
  variables,
  ...props
}: QueryHooksParams<UseCashierParams, any>) => {
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<any | null>(null)

  const refetch = async () => {
    try {
      setLoading(true)
      if (variables?.macAddress && variables?.type) {
        const { data } = await client.query({
          query: GET_CASHIER_DATA,
          variables,
        })
        const cashierData = data.cashierData
        setHooks(cashierData)
      }
    } catch (error) {
      setLoading(false)
      console.error("Error fetching hooks:", error)
    } finally {
      setLoading(false)
      if (props.onComplete) props.onComplete(hooks)
    }
  }

  useEffect(() => {
    if (variables?.macAddress && variables?.type) {
      setLoading(true)
      const fetchHooks = async () => {
        try {
          const { data } = await client.query({
            query: GET_CASHIER_DATA,
            variables,
          })
          const fetchedCashierData = data.cashierData
          setHooks(fetchedCashierData)
          if (props.onComplete) props.onComplete(fetchedCashierData)
        } catch (error) {
          setLoading(false)
          console.error("Error fetching billing data:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchHooks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables?.macAddress && variables?.type])
  // Empty dependency array to run only once on component mount

  return { data: hooks, refetch, loading }
}
