import {
  ApolloCache,
  ApolloQueryResult,
  DefaultContext,
  LazyQueryExecFunction,
  MutationFunctionOptions,
  OperationVariables,
} from '@apollo/client'
import { Table } from 'antd'

export type MutationType = (
  options?:
    | MutationFunctionOptions<
        any,
        OperationVariables,
        DefaultContext,
        ApolloCache<any>
      >
    | undefined
) => Promise<any>

export type RefetchType = (
  variables?: Partial<OperationVariables> | undefined
) => Promise<ApolloQueryResult<any>>

export type LazyQueryType = LazyQueryExecFunction<any, OperationVariables>

export interface EditableRowProps {
  index: string
}

export type EditableTableProps = Parameters<typeof Table>[0]

export interface EditableCellProps<T> {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof T
  record: T
  handleSave: <T>(
    row: T,
    state: T[],
    setState: (params: T[]) => void,
    key: keyof T
  ) => void
  state: T[]
  setState: (params: T[]) => void
}
