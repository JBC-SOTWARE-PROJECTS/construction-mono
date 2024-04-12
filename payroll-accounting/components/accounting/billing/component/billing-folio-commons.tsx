import { Card, Statistic, StatisticProps } from "antd"
import styled from "styled-components"

export const FolioTotalSummary = (props: StatisticProps) => {
  return (
    <CardFlex>
      <Card bordered={false} size="small">
        <Statistic {...props} />
      </Card>
    </CardFlex>
  )
}

const CardFlex = styled.div`
  height: 100%;
  .ant-card {
    height: 100%;
  }
`
