import { GraphQlResVal_PaymentTracker } from "@/graphql/gql/graphql"
import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import { useState } from "react"

const POST_PAYMENT = gql`
  mutation (
    $type: String
    $items: [Map_String_ObjectScalar]
    $tendered: [Map_String_ObjectScalar]
    $taggedIds: [UUID]
    $taggedIdsMeds: [UUID]
  ) {
    processPayment(
      type: $type
      items: $items
      tendered: $tendered
      taggedIds: $taggedIds
      taggedIdsMeds: $taggedIdsMeds
    ) {
      response {
        id
      }
    }
  }
`

export interface QueryHooksParams<D> {
  onComplete?: (resp?: D | null) => void
}

interface UseProcessPaymentParams {
  id?: string
}

const useProcessPayment = (
  props?: QueryHooksParams<GraphQlResVal_PaymentTracker>
) => {
  const [hooks, setHooks] = useState<GraphQlResVal_PaymentTracker | null>(null)
  const [loading, setLoading] = useState(false)

  const postHooks = async (variables: UseProcessPaymentParams) => {
    setLoading(true)
    try {
      const { data } = await client.mutate({
        mutation: POST_PAYMENT,
        variables,
      })
      setHooks(data.processPayment)
    } catch (error) {
      setLoading(false)
      console.error("Error fetching hooks:"), error
    } finally {
      setLoading(false)
      if (props?.onComplete) props?.onComplete(hooks)
    }
  }

  return [postHooks, { data: hooks, loading }]
}

export default useProcessPayment
