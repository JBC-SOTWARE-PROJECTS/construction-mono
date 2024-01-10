import { Maybe } from '@/graphql/gql/graphql'
import { ApolloError } from '@apollo/client'

export interface CustomHooksQueryList<T> {
  data: Maybe<Maybe<T>[]> | undefined
  loading: boolean
  error: ApolloError | undefined
}
