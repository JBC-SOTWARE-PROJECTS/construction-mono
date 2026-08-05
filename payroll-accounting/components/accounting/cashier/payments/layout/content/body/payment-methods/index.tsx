import { Col } from "antd"
import TerminalWindowsPaymentMethodButtons from "./buttons"
import TerminalWindowsPaymentMethodList from "./list"
import { TerminalWindowsPaymentMethod } from "../../../../data-types/interfaces"

const TerminalWindowPaymentMethod = (props: TerminalWindowsPaymentMethod) => {
  return (
    <Col span={24}>
      <TerminalWindowsPaymentMethodButtons {...props} />
      <TerminalWindowsPaymentMethodList {...props} />
    </Col>
  )
}

export default TerminalWindowPaymentMethod
