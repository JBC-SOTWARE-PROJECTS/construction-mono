import { ArPromissoryNote, Employee } from "@/graphql/gql/graphql"
import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import { useState, useEffect } from "react"

const PROMISSORY_NOTE_BY_ID = gql`
  query ($id: UUID) {
    promissoryNoteById: findOnePromissory(id: $id) {
      id
      debtorFullName
      pnNo
      pnType
      netTotalAmount
    }
  }
`

export interface QueryHooksParams<T, D> {
  variables: T
  onComplete?: (resp?: D | null) => void
}

interface UsePromissoryNoteByIdParams {
  id?: string
}

// THE QUERY GETS FROM SUPPLIER TABLE WHERE TYPE IS EQUAL TO DOCTOR

export const usePromissoryNoteById = ({
  variables,
  ...props
}: QueryHooksParams<UsePromissoryNoteByIdParams, ArPromissoryNote>) => {
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<ArPromissoryNote | null>(null)

  const refetch = async () => {
    try {
      setLoading(true)
      if (variables?.id) {
        const { data } = await client.query({
          query: PROMISSORY_NOTE_BY_ID,
          variables,
        })
        const promissoryNoteById = data.promissoryNoteById
        setHooks(promissoryNoteById)
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
          const fetchedPromissoryNoteData = data.promissoryNoteById
          setHooks(fetchedPromissoryNoteData)
          if (props.onComplete) props.onComplete(fetchedPromissoryNoteData)
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
