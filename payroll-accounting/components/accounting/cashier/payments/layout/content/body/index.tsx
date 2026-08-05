import { Carousel, Layout, Row } from "antd"
import TerminalWindow from "../../.."

type Props = {}
const background = "#f5f5f5"

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
}

const TerminalWindowBody = (props: Props) => {
  return (
    <Layout.Content
      style={{
        padding: 24,
        margin: 0,
        minHeight: "calc(100vh - 85px)",
        background,
      }}
    >
      <Row gutter={[8, 8]}>
        <TerminalWindow.Payor />
        <TerminalWindow.AmountTendered />
        <TerminalWindow.PaymentMethod />
      </Row>
    </Layout.Content>
  )
}

export default TerminalWindowBody
