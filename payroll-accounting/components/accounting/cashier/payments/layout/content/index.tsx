import { Layout } from "antd"
import TerminalWindow from "../.."
import TerminalWindowAction from "./action"
import TerminalWindowBody from "./body"
import TerminalWindowsSider from "./sider"

type Props = {}

const background = "#f5f5f5"

const TerminalWindowContents = (props: Props) => {
  return (
    <Layout style={{ overflow: "hidden" }} hasSider>
      <TerminalWindowsSider />
      <Layout style={{ marginLeft: "45%", background }}>
        <TerminalWindowBody />
        <TerminalWindow.QuickOptions />
        <TerminalWindowAction />
      </Layout>
    </Layout>
  )
}

export default TerminalWindowContents
