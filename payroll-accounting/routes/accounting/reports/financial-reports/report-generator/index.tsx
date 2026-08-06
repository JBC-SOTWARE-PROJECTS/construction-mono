import FinReportGenerator from "@/components/accounting/reports/financial-report-generator"
import { CommonReducer } from "@/components/common/custom/interfaces-types/react-common"
import { ReportTypeLabel } from "@/constant/reports/financial-layout"
import {
  FinancialReportDto,
  ReportType,
  ReportsLayout,
} from "@/graphql/gql/graphql"
import { getUrlPrefix } from "@/utility/graphql-client"
import { PageContainer } from "@ant-design/pro-components"
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { useForm } from "antd/es/form/Form"
import dayjs, { Dayjs } from "dayjs"
import { useRouter } from "next/router"
import { useReducer, useState } from "react"
import styled from "styled-components"

export const REPORTS_LAYOUT_MUTATION = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    createReportsLayout(id: $id, fields: $fields) {
      response {
        id
      }
    }
  }
`

const CHECK_REPORT_QUERY = gql`
  query ($reportType: ReportType) {
    reportLayout: checkExistingReportLayout(reportType: $reportType) {
      id
      title
      reportType
      reportLayoutLabel
      isStandard
    }
  }
`

const GENERATE_REPORT = gql`
  query ($reportLayoutId: UUID, $durationType: String, $end: String) {
    reportData: onGenerateSaveAccounts(
      reportLayoutId: $reportLayoutId
      durationType: $durationType
      end: $end
    ) {
      id
      title
      amount
      isGroup
      isChild
      isFormula
      isHide
      normalSide
      rows
    }
  }
`

interface ReportGeneratorI {
  reportType: ReportType
}

export type FinReportGenDateDataType = "month" | "year"

export interface FinReportStateI {
  open: boolean
  reportDate: Dayjs[]
  dateType: FinReportGenDateDataType
  reportLayout?: ReportsLayout
  reportData: FinancialReportDto[]
  reportType: ReportType
  isLoading: boolean
  isComplete: boolean
}

export type FinReportActionProps =
  | { type: "set-report-date"; payload: Dayjs[] }
  | { type: "set-date-type"; payload: FinReportGenDateDataType }
  | { type: "set-report-layout"; payload: ReportsLayout | undefined }
  | { type: "set-report-data"; payload: FinancialReportDto[] }
  | { type: "set-open"; payload: boolean }
  | { type: "set-report-type"; payload: ReportType }
  | { type: "set-complete"; payload: boolean }
  | { type: "set-loading"; payload: boolean }

const reduceParam: CommonReducer<FinReportStateI, FinReportActionProps> = (
  state,
  action
) => {
  switch (action.type) {
    case "set-report-date":
      return { ...state, reportDate: action.payload }
    case "set-date-type":
      return { ...state, dateType: action.payload }
    case "set-report-layout":
      return { ...state, reportLayout: action.payload }
    case "set-report-data":
      return { ...state, reportData: action.payload }
    case "set-open":
      return { ...state, open: action.payload }
    case "set-report-type":
      return { ...state, reportType: action.payload }
    case "set-loading":
      return { ...state, isLoading: action.payload }
    case "set-complete":
      return { ...state, isComplete: action.payload }
    default:
      return state
  }
}

export default function ReportGenerator(props: ReportGeneratorI) {
  const { reportType } = props
  const [form] = useForm()
  const { push } = useRouter()
  const [loadingState, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)

  const [state, dispatch] = useReducer(reduceParam, {
    reportType,
    open: false,
    reportDate: [dayjs(), dayjs()],
    dateType: "month",
    reportData: [],
    isLoading: false,
    isComplete: false,
  })

  const [onGenerate, { data: generateData, loading: generateLoading }] =
    useLazyQuery(GENERATE_REPORT)

  const [onCreateCustomLayout, { loading: generateCustomLoading }] =
    useMutation(REPORTS_LAYOUT_MUTATION)

  const { loading: checkLoading, refetch } = useQuery(CHECK_REPORT_QUERY, {
    variables: {
      reportType,
    },
    onCompleted: ({ reportLayout }) => {
      const { dateType, reportDate } = state
      dispatch({ type: "set-report-layout", payload: reportLayout })

      onGenerate({
        variables: {
          reportLayoutId: reportLayout?.id,
          durationType: dateType,
          end:
            dateType == "month"
              ? dayjs(reportDate[0]).startOf("M").format("YYYY-MM-DD")
              : dayjs(reportDate[1]).endOf("M").format("YYYY-MM-DD"),
        },
        onCompleted: ({ reportData }) => {
          dispatch({ type: "set-report-data", payload: reportData })
          dispatch({ type: "set-loading", payload: false })
          dispatch({ type: "set-complete", payload: true })
        },
        onError: () => {
          setLoading(false)
          setComplete(true)
        },
      })
    },
  })

  const editLayout = () => {
    push(
      `/financial-accounting/reports/report-generator/layout/${state?.reportLayout?.id}`
    )
  }

  const onHandleCreateCustomLayout = () => {
    onCreateCustomLayout({
      variables: {
        id: null,
        fields: {
          reportType: reportType,
          layoutName: `Custom ${ReportTypeLabel[reportType]}`,
          title: ReportTypeLabel[reportType],
          isActive: false,
          isStandard: false,
        },
      },
      onCompleted: ({ createReportsLayout }) => {
        push(
          `/financial-accounting/reports/report-generator/layout/${createReportsLayout?.response?.id}`
        )
      },
    })
  }

  const downloadCSV = () => {
    const { dateType, reportDate } = state
    window.open(
      `${getUrlPrefix()}/accounting/reports/financial-report/reportExtract?reportLayoutId=${
        state?.reportLayout?.id
      }&durationType=${dateType}&end=${
        dateType == "month"
          ? dayjs(reportDate[0]).startOf("M").format("YYYY-MM-DD")
          : dayjs(reportDate[1]).endOf("M").format("YYYY-MM-DD")
      }`
    )
  }

  const onUpdate = () => {
    dispatch({ type: "set-loading", payload: true })
    dispatch({ type: "set-complete", payload: false })

    refetch()
  }

  const functions = {
    onUpdate,
    downloadCSV,
    editLayout,
    onHandleCreateCustomLayout,
  }

  const loading = {
    generate: generateLoading,
    check: checkLoading,
    customLayout: generateCustomLoading,
  }

  return (
    <PageStyle>
      <PageContainerStyle>
        <PageContainer>
          <FinReportGenerator
            {...{ form, state, dispatch, functions, loading }}
          >
            <FinReportGenerator.Filter />
            <ReportContainer>
              <FinReportGenerator.Header />
              <FinReportGenerator.Table />
            </ReportContainer>
            <FinReportGenerator.Formats />
          </FinReportGenerator>
        </PageContainer>
      </PageContainerStyle>
    </PageStyle>
  )
}

export const ReportContainer = styled.div`
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(0, 10, 30, 0.2);
  padding-left: 32px;
  padding-right: 32px;
  padding-bottom: 32px;

  margin-top: 20px;

  table {
    width: 100%;
    font-size: 0.7125rem;
    border-collapse: collapse;
  }

  tr.border-bottom > td {
    border-bottom: 1px solid #ffffff;
  }
  tr:last-child > td {
    border-bottom: none; /* Remove border for the last row */
  }

  td {
    padding: 2px;
    width: 80%;
  }

  .child-col {
    width: 80%;
    border-bottom: 1px solid #ccced2;
  }

  .group-col {
    width: 80%;
    font-weight: bold;
    border-bottom: 1px solid #ccced2;
  }

  .group-amount-col {
    border-bottom: 1px solid #ccced2;
  }

  .amount-col {
    text-align: right;
    border-bottom: 1px solid #ccced2;
  }

  .header-amount-col {
    text-align: right;
  }

  .total-col {
    font-weight: bold;
    border-bottom: 4px double teal;
  }

  .total-amount-col {
    font-weight: bold;
    text-align: right;
    border-bottom: 4px double teal;
  }

  .formula-col {
    font-weight: bold;
    background: teal;
    color: #fff;
  }

  .formula-amount-col {
    font-weight: bold;
    text-align: right;
    background: teal;
    color: #fff;
  }
`

const PageContainerStyle = styled.div`
  margin: 0 auto;
  padding-bottom: 50px;

  @media (max-width: 768px) {
    max-width: 90%;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    max-width: 80%;
  }

  @media (min-width: 1025px) {
    max-width: 60%;
  }
`

const PageStyle = styled.div`
  background: #f5f5f4;
`
