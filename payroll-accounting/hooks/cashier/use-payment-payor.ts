import {
  PaymentType,
  PayorType,
} from "@/components/accounting/cashier/payments/data-types/types"
import { GET_CASHIER_EMPLOYEE } from "@/graphql/cashier/queries"

import { client } from "@/utility/graphql-client"
import { OptionProps } from "antd/es/select"
import { DocumentNode } from "graphql"
import { useEffect, useState } from "react"

type CustomerTypes = "HMO" | "CORPORATE" | "PERSONAL" | "PROMISSORY_NOTE"

export interface QueryHooksParams<T, D> {
  variables: T
  onComplete?: (resp?: D | null) => void
}

interface UseSearchPayorParams {
  filter?: string
  page?: number
  size?: number
  paymentType: PaymentType
  payorType: PayorType
  registryType?: string | null
}

interface PayorQueryVariables {
  filter?: string
  page?: number
  size?: number
  option?: string
  department?: null
  registryType?: string | null
  status?: string | null
  type?: CustomerTypes
}

function getQueryFields(variables: UseSearchPayorParams): {
  query: DocumentNode
  fields: PayorQueryVariables
} {
  const { payorType, paymentType, registryType, ...otherVar } = variables
  let query: DocumentNode | null = null
  let fields: PayorQueryVariables = { page: 0, size: 5, ...otherVar }

  switch (payorType) {
    case "EMPLOYEE":
      query = GET_CASHIER_EMPLOYEE
      fields.option = ""
      fields.department = null
      break
    default:
      query = GET_CASHIER_EMPLOYEE
      fields.registryType = registryType ?? "ALL"
      break
  }

  return { query, fields }
}

export const useSearchPaymentPayor = ({
  variables,
  ...props
}: QueryHooksParams<UseSearchPayorParams, OptionProps>) => {
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<OptionProps | null>(null)

  const refetch = async ({
    variables,
    ...props
  }: QueryHooksParams<UseSearchPayorParams, OptionProps>) => {
    const fetchHooks = async () => {
      try {
        setLoading(true)
        const { query, fields } = getQueryFields(variables)
        const { data } = await client.query({
          query,
          variables: { ...fields },
        })
        const fetchedPayorData = data.payor
        setHooks(fetchedPayorData)
        if (props.onComplete) props.onComplete(fetchedPayorData)
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
        const fetchedPayorData = data.payor
        setHooks(fetchedPayorData)
        if (props.onComplete) props.onComplete(fetchedPayorData)
      } catch (error) {
        setLoading(false)
        console.error("Error fetching billing data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables?.filter, variables?.payorType])
  // Empty dependency array to run only once on component mount

  return { data: hooks, refetch, loading }
}
