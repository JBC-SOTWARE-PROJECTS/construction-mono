import { FormInstance, Spin } from "antd"
import { Dispatch, ReactNode, createContext, useContext } from "react"
import FinReportGeneratorFilter from "./filter"
import GenerateFinReportGeneratorLoading from "./generate-loading"
import FinGenReportHeader from "./header"
import FinGenReportFormats from "./report-formats"
import FinGenReportTable from "./table"
import {
  FinReportActionProps,
  FinReportStateI,
} from "@/routes/accounting/reports/financial-reports/report-generator"

export interface FinReportGenFunc {
  editLayout: (params?: any) => void
  downloadCSV: (params?: any) => void
  onUpdate: () => void
  onHandleCreateCustomLayout: () => void
}

export interface FinReportGenLoading {
  generate: boolean
  check: boolean
  customLayout: boolean
}

export interface FinReportGenContextProps {
  form: FormInstance<any>
  dispatch: Dispatch<FinReportActionProps>
  state: FinReportStateI
  functions: FinReportGenFunc
  loading: FinReportGenLoading
}

interface FinReportGeneratorProps extends FinReportGenContextProps {
  children: ReactNode
}

export const FinReportGeneratorContext =
  createContext<FinReportGenContextProps | null>(null)

const FinReportGenerator = ({
  children,
  ...props
}: FinReportGeneratorProps) => {
  return (
    <FinReportGeneratorContext.Provider value={{ ...props }}>
      {children}
    </FinReportGeneratorContext.Provider>
  )
}

const Filter = () => {
  const values = useContext(FinReportGeneratorContext)
  if (!values) return <Spin />
  return <FinReportGeneratorFilter {...values} />
}

const Header = () => {
  const values = useContext(FinReportGeneratorContext)

  if (!values) return <Spin />

  const { state } = values

  if (state.isLoading)
    return (
      <GenerateFinReportGeneratorLoading
        start={state.isLoading}
        complete={state.isComplete}
      />
    )
  return <FinGenReportHeader {...values} />
}

const Table = () => {
  const values = useContext(FinReportGeneratorContext)

  if (!values) return <Spin />

  const { state } = values

  if (state.isLoading) return <></>

  return <FinGenReportTable {...values} />
}

const Formats = () => {
  const values = useContext(FinReportGeneratorContext)
  if (!values) return <Spin />

  const { state } = values

  if (state.isLoading) return <></>

  return <FinGenReportFormats {...values} />
}

FinReportGenerator.Filter = Filter
FinReportGenerator.Header = Header
FinReportGenerator.Table = Table
FinReportGenerator.Formats = Formats

export default FinReportGenerator
