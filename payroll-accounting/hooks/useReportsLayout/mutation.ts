import {
  GENERATE_STANDARD_REPORT_BY_TYPE,
  REPORTS_LAYOUT_MUTATION,
  TOGGLE_REPORTS_LAYOUT_DEFAULT_FORMAT,
} from "@/graphql/financial/reports/financial-reports"
import {
  GraphQlResVal_Boolean,
  GraphQlResVal_ReportsLayout,
  MutationCreateReportsLayoutArgs,
  ReportsLayout,
} from "@/graphql/gql/graphql"
import {
  ApolloCache,
  DefaultContext,
  MutationTuple,
  OperationVariables,
  useMutation,
} from "@apollo/client"

export const useMutationUpsertReportsLayout = (
  callBack?: (params: ReportsLayout) => void
): MutationTuple<
  GraphQlResVal_ReportsLayout,
  OperationVariables,
  DefaultContext,
  ApolloCache<GraphQlResVal_ReportsLayout>
> => {
  const mutation = useMutation(REPORTS_LAYOUT_MUTATION, {
    onCompleted: ({ reportsLayout }) =>
      typeof callBack === "function" ? callBack(reportsLayout) : null,
  })

  return mutation
}

export const useMutationReportsLayoutToggleDefaultFormat = (
  callBack?: (params: ReportsLayout) => void
): MutationTuple<
  GraphQlResVal_Boolean,
  OperationVariables,
  DefaultContext,
  ApolloCache<GraphQlResVal_Boolean>
> => {
  const mutation = useMutation(TOGGLE_REPORTS_LAYOUT_DEFAULT_FORMAT, {
    onCompleted: ({ reportsLayout }) =>
      typeof callBack === "function" ? callBack(reportsLayout) : null,
  })

  return mutation
}

export const useMutationGenerateStandardLayout = (
  callBack?: (params: ReportsLayout) => void
): MutationTuple<
  GraphQlResVal_Boolean,
  OperationVariables,
  DefaultContext,
  ApolloCache<GraphQlResVal_Boolean>
> => {
  const mutation = useMutation(GENERATE_STANDARD_REPORT_BY_TYPE, {
    onCompleted: ({ standard }) =>
      typeof callBack === "function" ? callBack(standard) : null,
  })

  return mutation
}
