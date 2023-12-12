import { useLazyQuery, useQuery } from '@apollo/client'
import {
  FindCustomersParamsI,
  FindCustomersResultI,
} from '@/interface/accountReceivables/customers'
import {
  FIND_ALL_CUSTOMERS,
  FIND_ALL_DEPARTMENTS,
} from '@/graphql/accountReceivables/customers'
import { ArCustomers, Query } from '@/graphql/gql/graphql'

export function UseFindCustomers(
  props?: FindCustomersParamsI
): FindCustomersResultI {
  const { search, page, size, type } = props || {
    search: '',
    page: 0,
    size: 10,
    type: [],
  }

  const { data, loading, refetch, fetchMore } = useQuery<Query>(
    FIND_ALL_CUSTOMERS,
    {
      variables: {
        search,
        page,
        size,
        type,
      },
    }
  )

  const { content, number, totalPages, totalElements } =
    data?.findAllCustomers || {
      number: 0,
      totalPages: 0,
      totalElements: 0,
    }

  return {
    content,
    number,
    totalPages,
    totalElements,
    loading,
    refetch,
    fetchMore,
  }
}

export function UseFindLazyCustomers() {
  return useLazyQuery(FIND_ALL_CUSTOMERS)
}

export function UseFindLazyDepartments() {
  return useLazyQuery(FIND_ALL_DEPARTMENTS)
}
