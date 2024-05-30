import { Billing } from "@/graphql/gql/graphql"
import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import { useState, useEffect } from "react"

const BILLING_BY_ID = gql`
  query ($id: UUID!) {
    billingById(billingId: $id) {
      id
      entryDateTime
      billingNo
      balance
      locked
      status
      otcname
      isCreditLimitReached
      creditLimit
      isAllowedProgressPayment
      patientCase {
        id
        caseNo
        admissionDatetime
        dischargedDatetime
        entryDateTime
        primaryDx
        accommodationType
        registryType
        secondaryDx
        room {
          bedNo
          roomNo
          roomName
        }
        locked
      }
      patient {
        id
        fullName
        dob
        age
        gender
        contactNo
      }
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
