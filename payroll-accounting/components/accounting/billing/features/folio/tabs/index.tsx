import { Button, Card, Col, Row, Space, Tabs, Typography } from "antd"
import FolioProgressBilling from "./progress-billing"
import { PlusCircleFilled, PlusCircleOutlined } from "@ant-design/icons"
import { Billing } from "@/graphql/gql/graphql"

const FolioTabs = (props: Billing) => {
  const TabItems = [
    {
      label: "Progress Billing",
      key: "progress-billing",
      children: (
        <FolioProgressBilling {...{ billing: { ...props }, type: "SERVICE" }} />
      ),
    },
    {
      label: `Deduction(s)`,
      key: "deductions",
      children: (
        <FolioProgressBilling
          {...{ billing: { ...props }, type: "DEDUCTIONS" }}
        />
      ),
    },
    {
      label: `Payment(s)`,
      key: "payments",
      children: (
        <FolioProgressBilling
          {...{ billing: { ...props }, type: "PAYMENTS" }}
        />
      ),
    },
  ]

  return (
    <Row gutter={[8, 8]} style={{ minHeight: 400 }}>
      <Col span={24}>
        <Tabs defaultActiveKey="1" type="card" size="small" items={TabItems} />
      </Col>
    </Row>
  )
}

export default FolioTabs
