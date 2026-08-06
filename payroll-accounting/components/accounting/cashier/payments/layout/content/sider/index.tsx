import { Layout } from "antd"
import styled from "styled-components"
import TerminalAmountSummary from "./amount-summary"
import TerminalWindowSiderContent from "./content"
import { FolioItemsI } from "../../../data-types/interfaces"
import { useContext } from "react"
import { TerminalWindowContext } from "../../.."

const { Sider } = Layout

type Props = {}

const TerminalWindowsSider = (props: Props) => {
  const context = useContext(TerminalWindowContext)
  if (context) {
    const { amountSummary } = context

    return (
      <Sider
        theme="light"
        width="45%"
        style={{
          marginTop: "65px",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Summary>
          <TerminalWindowSiderContent />
          <TerminalAmountSummary {...{ amountSummary }} />
        </Summary>
      </Sider>
    )
  }
}

export default TerminalWindowsSider

const Summary = styled.div`
  height: 100%;
  position: relative;
  overflow-y: scroll;
  padding-bottom: 278px;
`
