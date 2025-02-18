import {
  CUSTOM_REPORTS_LAYOUT_BY_TYPE,
  REPORTS_LAYOUT_BY_TYPE,
  REPORTS_LAYOUT_STANDARD_BY_TYPE,
} from "@/graphql/financial/reports/financial-reports"
import { ReportType, ReportsLayout } from "@/graphql/gql/graphql"
import { OperationVariables, QueryResult, useQuery } from "@apollo/client"

export const useQueryReportsLayoutByType = (
  type: ReportType,
  callBack?: (params: ReportsLayout[]) => void
): QueryResult<any, OperationVariables> => {
  const query = useQuery(REPORTS_LAYOUT_BY_TYPE, {
    variables: { reportType: type },
    onCompleted: ({ reportsLayout }) =>
      typeof callBack === "function" ? callBack(reportsLayout) : null,
  })

  return query
}

export const useQueryFindAllCustomReportsLayoutByType = (
  type: ReportType,
  skip?: boolean | undefined,
  callBack?: (params: ReportsLayout[]) => void
): QueryResult<any, OperationVariables> => {
  const query = useQuery(CUSTOM_REPORTS_LAYOUT_BY_TYPE, {
    variables: { reportType: type },
    skip,
    onCompleted: ({ reportsLayout }) =>
      typeof callBack === "function" ? callBack(reportsLayout) : null,
  })

  return query
}

export const useQueryFindOneStandardReportsLayoutByType = (
  type: ReportType,
  skip?: boolean | undefined,
  callBack?: (params: ReportsLayout[]) => void
): QueryResult<any, OperationVariables> => {
  const query = useQuery(REPORTS_LAYOUT_STANDARD_BY_TYPE, {
    variables: { reportType: type },
    skip,
    onCompleted: ({ reportsLayout }) =>
      typeof callBack === "function" ? callBack(reportsLayout) : null,
  })

  return query
}
