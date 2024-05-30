import { Investor } from "@/graphql/gql/graphql"
import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import { useState, useEffect } from "react"

const INVESTOR_BY_ID = gql`
  query ($id: UUID) {
    investorById(id: $id) {
      id
      fullName
      investorNo
      gender
      dob
      address
      balance
    }
  }
`

export interface QueryHooksParams<T, D> {
  variables: T
  onComplete?: (resp?: D | null) => void
}

interface UseInvestorByIdParams {
  id?: string
}

// THE QUERY GETS FROM SUPPLIER TABLE WHERE TYPE IS EQUAL TO DOCTOR

export const useInvestorById = ({
  variables,
  ...props
}: QueryHooksParams<UseInvestorByIdParams, Investor>) => {
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<Investor | null>(null)

  const refetch = async () => {
    try {
      setLoading(true)
      if (variables?.id) {
        const { data } = await client.query({
          query: INVESTOR_BY_ID,
          variables,
        })
        const investorById = data.investorById
        setHooks(investorById)
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
            query: INVESTOR_BY_ID,
            variables,
          })
          const fetchedInvestorData = data.investorById
          setHooks(fetchedInvestorData)
          if (props.onComplete) props.onComplete(fetchedInvestorData)
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
