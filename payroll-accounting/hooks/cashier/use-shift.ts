import { Shift, Supplier } from "@/graphql/gql/graphql"
import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import { useState, useEffect } from "react"

const SHIFT_PAGE_BY_TERMINAL_ID = gql`
  query (
    $filter: String
    $terminalId: [UUID]
    $shiftStartDate: String
    $shiftEndDate: String
    $page: Int
    $size: Int
  ) {
    shiftByTerminalId: getAllShiftingRecordsForCdctr(
      filter: $filter
      terminalId: $terminalId
      shiftStartDate: $shiftStartDate
      shiftEndDate: $shiftEndDate
      page: $page
      size: $size
    ) {
      content {
        id
        shiftno
        terminal {
          id
          terminalId
          macAddress
          terminalName
        }
        startshift
        endshift
      }
      number
      totalElements
      totalPages
    }
  }
`

export interface QueryHooksParams<T, D> {
  variables: T
  onComplete?: (resp?: D | null) => void
}

interface UseShiftByPageByTerminalParams {
  filter: string
  terminalId: string[]
  shiftStartDate: string
  shiftEndDate: string
  page: number
  size: number
}

// THE QUERY GETS FROM SUPPLIER TABLE WHERE TYPE IS EQUAL TO DOCTOR

export const useShiftByPageByTerminal = ({
  variables,
  ...props
}: QueryHooksParams<UseShiftByPageByTerminalParams, Shift>) => {
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<Shift | null>(null)

  const refetch = async () => {
    try {
      setLoading(true)
      const { data } = await client.query({
        query: SHIFT_PAGE_BY_TERMINAL_ID,
        variables,
      })
      const shiftByTerminalId = data.shiftByTerminalId
      setHooks(shiftByTerminalId)
    } catch (error) {
      setLoading(false)
      console.error("Error fetching hooks:", error)
    } finally {
      setLoading(false)
      if (props.onComplete) props.onComplete(hooks)
    }
  }

  useEffect(() => {
    console.log(variables, "variables")
    setLoading(true)
    const fetchHooks = async () => {
      try {
        const { data } = await client.query({
          query: SHIFT_PAGE_BY_TERMINAL_ID,
          variables,
        })
        const fetchedShiftData = data.shiftByTerminalId
        setHooks(fetchedShiftData)
        if (props.onComplete) props.onComplete(fetchedShiftData)
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
