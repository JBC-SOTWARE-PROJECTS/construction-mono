import { Billing } from "@/graphql/gql/graphql"
import { Col, Row, Tabs } from "antd"
import { FolioRefetchType } from ".."
import FolioProgressBilling from "./progress-billing"
import FolioDeductions from "./deductions"
import { MessageInstance } from "antd/es/message/interface"

export interface FolioTabsProps {
  billing: Billing | null
  refetch: FolioRefetchType | null
}

const FolioTabs = (props: FolioTabsProps) => {
  const TabItems = [
    {
      label: "Progress Billing",
      key: "progress-billing",
      children: (
        <FolioProgressBilling
          {...{
            billing: { ...props.billing },
            refetch: props.refetch,
            type: "SERVICE",
          }}
        />
      ),
    },
    {
      label: `Deduction(s)`,
      key: "deductions",
      children: (
        <FolioDeductions
          {...{
            billing: { ...props.billing },
            refetch: props.refetch,
            type: "DEDUCTIONS",
          }}
        />
      ),
    },
    {
      label: `Payment(s)`,
      key: "payments",
      children: (
        <FolioProgressBilling
          {...{
            billing: { ...props.billing },
            refetch: props.refetch,
            type: "PAYMENTS",
          }}
        />
      ),
    },
  ]

  return (
    <Row gutter={[8, 8]} style={{ minHeight: 400 }}>
      <Col span={24}>
        <Tabs
          defaultActiveKey="1"
          type="card"
          size="small"
          items={TabItems}
          destroyInactiveTabPane
        />
      </Col>
    </Row>
  )
}

export default FolioTabs
