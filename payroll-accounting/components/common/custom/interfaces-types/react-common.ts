import { ApolloQueryResult, OperationVariables } from "@apollo/client"

export type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>

export type CommonReducer<S, A> = (state: S, action: A) => S

export type CommonRefetch<T> = (
  variables?: Partial<OperationVariables> | undefined
) => Promise<ApolloQueryResult<T>>
