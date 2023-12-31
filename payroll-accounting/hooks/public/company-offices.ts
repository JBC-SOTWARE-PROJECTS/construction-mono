import { Query } from '@/graphql/gql/graphql'
import { gql, useLazyQuery } from '@apollo/client'
import { useCallback, useEffect } from 'react'

const GET_OFFICE_GQL = gql`
  query {
    companyActiveOffices {
      id
      officeDescription
    }
  }
`

const UseGetCompanyActiveOffices = () => {
  const [fetchData, { data, loading, error }] =
    useLazyQuery<Query>(GET_OFFICE_GQL)

  const fetchCallback = useCallback(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchCallback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data: data?.companyActiveOffices, loading, error }
}

export default UseGetCompanyActiveOffices
