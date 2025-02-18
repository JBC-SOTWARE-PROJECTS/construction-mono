import { ArCustomers } from "@/graphql/gql/graphql"
import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import { useEffect, useState } from "react"

const PROMISSORY_NOTE_BY_ID = gql`
  query ($id: UUID) {
    customerById: findOneCustomer(id: $id) {
      id
      accountNo
      customerName
      address
      customerType
    }
  }
`

export interface QueryHooksParams<T, D> {
  variables: T
  onComplete?: (resp?: D | null) => void
}

interface UseCustomerByIdParams {
  id?: string
}

// THE QUERY GETS FROM SUPPLIER TABLE WHERE TYPE IS EQUAL TO DOCTOR

export const useCustomerById = ({
  variables,
  ...props
}: QueryHooksParams<UseCustomerByIdParams, ArCustomers>) => {
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<ArCustomers | null>(null)

  const refetch = async () => {
    try {
      setLoading(true)
      if (variables?.id) {
        const { data } = await client.query({
          query: PROMISSORY_NOTE_BY_ID,
          variables,
        })
        const customerById = data.customerById
        setHooks(customerById)
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
    if (variables?.id) {
      setLoading(true)
      const fetchHooks = async () => {
        try {
          const { data } = await client.query({
            query: PROMISSORY_NOTE_BY_ID,
            variables,
          })
          const fetchedCustomerData = data.customerById
          setHooks(fetchedCustomerData)
          if (props.onComplete) props.onComplete(fetchedCustomerData)
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
  }, [variables?.id])
  // Empty dependency array to run only once on component mount

  return { data: hooks, refetch, loading }
}
