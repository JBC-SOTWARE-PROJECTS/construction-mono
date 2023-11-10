import { ArCustomers, Maybe } from '@/graphql/gql/graphql'
import { FetchMoreQueryOptions } from '@apollo/client'

export interface FindCustomersParamsI {
  search?: string
  page?: number
  size?: number
  type?: string[]
}

export interface FindCustomersResultI {
  content: Maybe<Maybe<ArCustomers>[]> | undefined
  number: number
  totalPages: number
  loading: boolean
  refetch: any
  fetchMore: any
  totalElements: number
}
