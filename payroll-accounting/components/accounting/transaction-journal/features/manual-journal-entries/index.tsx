import { FormInstance, Spin, message } from "antd"
import {
  Dispatch,
  SetStateAction,
  ReactNode,
  createContext,
  useContext,
  ReactElement,
  JSXElementConstructor,
} from "react"
import MJEHeader from "./header"
import MJETable from "./table"
import { MessageInstance } from "antd/es/message/interface"
import MJEDetails from "./details"
import { HeaderLedger } from "@/graphql/gql/graphql"
import {
  JournalType,
  MJEntriesActions,
  MJEntriesState,
} from "../../dialogs/manual-journal-entries"

export interface MJEntriesI {
  id?: string
  code: string
  description: string
  debit: number
  credit: number
}

export interface MJLoading {
  findHeader: boolean
}
export interface ManualJournalEntriesContextProps {
  form: FormInstance<HeaderLedger>
  messageApi: MessageInstance
  state: MJEntriesState
  dispatch: Dispatch<MJEntriesActions>
  loading: MJLoading
  journalType?: JournalType
}

export interface ManualJournalEntriesProps
  extends ManualJournalEntriesContextProps {
  children: ReactNode
  contextHolder: ReactElement<any, string | JSXElementConstructor<any>>
}

export const ManualJournalEntriesContext =
  createContext<ManualJournalEntriesContextProps | null>(null)

const ManualJournalEntries = ({
  children,
  contextHolder,
  ...props
}: ManualJournalEntriesProps) => {
  return (
    <ManualJournalEntriesContext.Provider value={{ ...props }}>
      {children}
      {contextHolder}
    </ManualJournalEntriesContext.Provider>
  )
}

const Header = () => {
  const context = useContext(ManualJournalEntriesContext)
  if (!context) return <Spin />

  return <MJEHeader {...context} />
}

const Details = () => {
  const context = useContext(ManualJournalEntriesContext)
  if (!context) return <Spin />

  return <MJEDetails {...context} />
}

const Table = () => {
  const context = useContext(ManualJournalEntriesContext)
  if (!context) return <Spin />

  return <MJETable {...context} />
}

ManualJournalEntries.Header = Header
ManualJournalEntries.Table = Table
ManualJournalEntries.Details = Details

export default ManualJournalEntries
