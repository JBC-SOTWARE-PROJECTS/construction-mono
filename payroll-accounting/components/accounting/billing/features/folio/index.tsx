import { PageHeader } from "@ant-design/pro-components"
import { Col, ColProps, Row, Spin } from "antd"
import { ReactNode, createContext, useContext } from "react"
import FolioHeader from "./header"
import FolioTabs from "./tabs"
import { Billing, Query } from "@/graphql/gql/graphql"
import { ApolloQueryResult, OperationVariables } from "@apollo/client"
import { MessageInstance } from "antd/es/message/interface"

export type FolioRefetchType = (
  variables?: Partial<OperationVariables> | undefined
) => Promise<ApolloQueryResult<Query>>

export interface FolioRefetchProps {
  onRefetchBilling: FolioRefetchType
}
export interface FolioHeaderProps {
  billing: Billing | null
  messageApi: MessageInstance
  onRefetchBilling: FolioRefetchType
}

interface FolioContextProps {
  header: FolioHeaderProps
  refetch: FolioRefetchProps
  messageApi: MessageInstance
}

export const FolioContext = createContext<FolioContextProps | null>(null)

interface FolioProps extends FolioContextProps {
  children: ReactNode
}

const Folio = ({ children, ...props }: FolioProps) => {
  return (
    <FolioContext.Provider
      value={{
        ...props,
      }}
    >
      <PageHeader
        breadcrumb={{
          items: [
            { title: "Home" },
            { title: <a href="">Billing</a> },
            { title: "Folio" },
          ],
        }}
      >
        {children}
      </PageHeader>
    </FolioContext.Provider>
  )
}

const Header = () => {
  const context = useContext(FolioContext)
  if (!context?.header) return <Spin />
  return <FolioHeader {...context?.header} />
}

const Tabs = () => {
  const context = useContext(FolioContext)
  if (!context?.header) return <Spin />
  return (
    <FolioTabs
      {...{
        billing: context?.header?.billing,
        refetch: context?.refetch?.onRefetchBilling,
      }}
    />
  )
}

Folio.Header = Header
Folio.Tabs = Tabs

export default Folio
