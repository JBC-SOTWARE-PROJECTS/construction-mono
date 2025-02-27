import { Billing } from "@/graphql/gql/graphql"
import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import { useState, useEffect } from "react"

export const BILLING_BY_ID = gql`
  query ($id: UUID) {
    billingById(id: $id) {
      id
      dateTrans
      billNo
      project {
        id
        projectCode
        description
        location {
          id
          fullAddress
        }
        status
      }
      customer {
        id
        customerName
        customerType
        address
        contactNo
        contactEmail
      }
      otcName
      locked
      lockedBy
      balance
      totals
      deductions
      payments
      projectWorkAccomplishId
      projectWorkAccomplishNo
      status
    }
  }
`

export interface QueryHooksParams<T, D> {
  variables: T
  onComplete?: (resp?: D | null) => void
}

interface UseBillingByIdParams {
  id?: string
}

export const useBillingById = ({
  variables,
  ...props
}: QueryHooksParams<UseBillingByIdParams, Billing>) => {
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<Billing | null>(null)

  console.log(variables, "variables")
  const refetch = async () => {
    try {
      setLoading(true)
      if (variables?.id) {
        const { data } = await client.query({
          query: BILLING_BY_ID,
          variables,
        })
        const billingById = data.billingById
        setHooks(billingById)
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
            query: BILLING_BY_ID,
            variables,
          })
          const fetchedBillingData = data.billingById
          setHooks(fetchedBillingData)
          if (props.onComplete) props.onComplete(fetchedBillingData)
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
