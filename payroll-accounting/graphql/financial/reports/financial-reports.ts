import { gql } from "@apollo/client"

export const REPORTS_LAYOUT_BY_TYPE = gql`
  query ($reportType: ReportType) {
    reportsLayout: getAllReportLayoutByType(reportType: $reportType) {
      id
      layoutName
      title
      isActive
    }
  }
`

export const CUSTOM_REPORTS_LAYOUT_BY_TYPE = gql`
  query ($reportType: ReportType) {
    reportsLayout: getAllCustomReportLayoutByType(reportType: $reportType) {
      id
      layoutName
      title
      isActive
      isStandard
    }
  }
`

export const REPORTS_LAYOUT_STANDARD_BY_TYPE = gql`
  query ($reportType: ReportType) {
    reportsLayout: findStandardReportLayoutByType(reportType: $reportType) {
      id
      layoutName
      title
      isActive
      isStandard
    }
  }
`

export const REPORTS_LAYOUT_MUTATION = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    createReportsLayout(id: $id, fields: $fields) {
      response {
        id
      }
    }
  }
`

export const TOGGLE_REPORTS_LAYOUT_DEFAULT_FORMAT = gql`
  mutation ($id: UUID, $reportType: ReportType) {
    onToggleDefaultReportsLayout(id: $id, reportType: $reportType) {
      response
    }
  }
`

export const GENERATE_STANDARD_REPORT_BY_TYPE = gql`
  mutation ($reportType: ReportType) {
    standard: generateStandardReport(reportType: $reportType) {
      id
    }
  }
`
