import AccountList from '@/components/accounting/reports/components/account-list'
import { PageContainer } from '@ant-design/pro-components'
import { Col, Row } from 'antd'

export default function BalanceSheetLayout() {
  return (
    <Row justify='center' style={{ marginBottom: 20 }}>
      <Col span={20}>
        <PageContainer>
          <AccountList />
        </PageContainer>
      </Col>
    </Row>
  )
}
