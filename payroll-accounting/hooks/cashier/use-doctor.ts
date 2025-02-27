import { Supplier } from "@/graphql/gql/graphql"
import { client } from "@/utility/graphql-client"
import { gql } from "@apollo/client"
import { useState, useEffect } from "react"

const DOCTOR_BY_ID = gql`
  query ($id: UUID) {
    doctorById: supplierById(id: $id) {
      id
      code
      supplierFullname
      primaryAddress
    }
  }
`

export interface QueryHooksParams<T, D> {
  variables: T
  onComplete?: (resp?: D | null) => void
}

interface UseDoctorByIdParams {
  id?: string
}

// THE QUERY GETS FROM SUPPLIER TABLE WHERE TYPE IS EQUAL TO DOCTOR

export const useDoctorById = ({
  variables,
  ...props
}: QueryHooksParams<UseDoctorByIdParams, Supplier>) => {
  const [loading, setLoading] = useState(false)
  const [hooks, setHooks] = useState<Supplier | null>(null)

  const refetch = async () => {
    try {
      setLoading(true)
      if (variables?.id) {
        const { data } = await client.query({
          query: DOCTOR_BY_ID,
          variables,
        })
        const doctorById = data.doctorById
        setHooks(doctorById)
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
            query: DOCTOR_BY_ID,
            variables,
          })
          const fetchedDoctorData = data.doctorById
          setHooks(fetchedDoctorData)
          if (props.onComplete) props.onComplete(fetchedDoctorData)
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
