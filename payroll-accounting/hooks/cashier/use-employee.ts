import { Employee } from "@/graphql/gql/graphql"
import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import { useState, useEffect } from "react"

const EMPLOYEE_BY_ID = gql`
  query ($id: UUID) {
    employeeById: employee(id: $id) {
      id
      employeeId
      employeeType
      fullName
      address
    }
  }
`

export interface QueryHooksParams<T, D> {
  variables: T
  onComplete?: (resp?: D | null) => void
}

interface UseEmployeeByIdParams {
  id?: string
}

// THE QUERY GETS FROM SUPPLIER TABLE WHERE TYPE IS EQUAL TO DOCTOR

export const useEmployeeById = ({
  variables,
  ...props
}: QueryHooksParams<UseEmployeeByIdParams, Employee>) => {
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<Employee | null>(null)

  const refetch = async () => {
    try {
      setLoading(true)
      if (variables?.id) {
        const { data } = await client.query({
          query: EMPLOYEE_BY_ID,
          variables,
        })
        const employeeById = data.employeeById
        setHooks(employeeById)
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
            query: EMPLOYEE_BY_ID,
            variables,
          })
          const fetchedEmployeeData = data.employeeById
          setHooks(fetchedEmployeeData)
          if (props.onComplete) props.onComplete(fetchedEmployeeData)
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
