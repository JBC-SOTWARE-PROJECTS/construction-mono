import {
  Button,
  Card,
  Col,
  ColProps,
  Descriptions,
  Row,
  Typography,
} from "antd"
import styled from "styled-components"
import { BillingInfo, CustomerInfo } from "./info"
import { FolioTotalSummary } from "../../../component/billing-folio-commons"
import numeral from "numeral"
import {
  CheckSquareOutlined,
  LockOutlined,
  PrinterOutlined,
} from "@ant-design/icons"
import { Billing } from "@/graphql/gql/graphql"

// Summary Amount Col
const firstColSummaryProps: ColProps = {
  xs: { span: 24 },
  sm: { span: 18 },
  md: { span: "70%" },
  lg: { span: "78%" },
  xl: { span: 24 },
}

const colSummaryProps: ColProps = {
  xs: { flex: "50%" },
  sm: { flex: "50%" },
  md: { flex: "50%" },
  lg: { flex: "50%" },
  xl: { flex: "100%" },
}
// end of Summary Amount Col

// Action Col

const colActionProps: ColProps = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 6 },
  lg: { span: 6 },
  xl: { span: 24 },
}

const colActionButtonProps: ColProps = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 12 },
}
// end of Action Col

export const FolioSummary = (props: Billing) => {
  return (
    <Col {...firstColSummaryProps}>
      <Row gutter={[8, 8]} style={{ height: "100%" }}>
        <Col {...colSummaryProps}>
          <FolioTotalSummary
            title={<Typography.Text strong>Total Charges</Typography.Text>}
            value={numeral(props?.totals ?? 0).format("0,0.00")}
            prefix={"₱"}
            valueStyle={{
              textAlign: "right",
              fontSize: "larger",
              fontWeight: 700,
            }}
          />
        </Col>
        <Col {...colSummaryProps}>
          <FolioTotalSummary
            title={<Typography.Text strong>Total Deductions</Typography.Text>}
            value={numeral(props?.deductions ?? 0).format("0,0.00")}
            prefix={"₱"}
            valueStyle={{
              textAlign: "right",
              fontSize: "larger",
              color: "#d97706",
              fontWeight: 700,
            }}
          />
        </Col>
        <Col {...colSummaryProps}>
          <FolioTotalSummary
            title={<Typography.Text strong>Total Payments</Typography.Text>}
            value={numeral(props?.payments ?? 0).format("0,0.00")}
            prefix={"₱"}
            valueStyle={{
              textAlign: "right",
              fontSize: "larger",
              fontWeight: 700,
            }}
          />
        </Col>
        <Col {...colSummaryProps}>
          <FolioTotalSummary
            title={<Typography.Text strong>Total Balance</Typography.Text>}
            value={numeral(props?.balance ?? 0).format("0,0.00")}
            prefix={"₱"}
            valueStyle={{
              textAlign: "right",
              fontSize: "larger",
              color: "#ef4444",
              fontWeight: 700,
            }}
          />
        </Col>
      </Row>
    </Col>
  )
}

export const FolioActions = () => {
  return (
    <Col {...colActionProps}>
      <CardFlex>
        <Card size="small">
          <Row gutter={[8, 8]}>
            <Col {...colActionButtonProps}>
              <Button
                type="primary"
                block
                icon={<LockOutlined />}
                style={{ background: "#047857" }}
              >
                Lock
              </Button>
            </Col>
            <Col {...colActionButtonProps}>
              <Button
                type="primary"
                block
                icon={<CheckSquareOutlined />}
                style={{ background: "#27272a" }}
              >
                Close Folio
              </Button>
            </Col>
            <Col {...colActionButtonProps}>
              <Button
                type="primary"
                block
                icon={<PrinterOutlined />}
                style={{ background: "#0284c7" }}
              >
                Print
              </Button>
            </Col>
          </Row>
        </Card>
      </CardFlex>
    </Col>
  )
}

const CardFlex = styled.div`
  height: 100%;
  .ant-card {
    height: 100%;
  }
`
