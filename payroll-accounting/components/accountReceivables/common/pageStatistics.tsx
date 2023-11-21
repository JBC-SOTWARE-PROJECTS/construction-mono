import {
  Col,
  Progress,
  ProgressProps,
  Row,
  Space,
  Statistic,
  StatisticProps,
} from 'antd'

interface PageStatisticsI {
  left: StatisticProps
  right: StatisticProps
  progress: ProgressProps
}
export default function PageStatistics(props: PageStatisticsI) {
  const { left, right, progress } = props
  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Row>
        <Col xl={{ span: 8 }} lg={{ span: 12 }}>
          <Statistic
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix='Php'
            {...left}
          />
        </Col>
        <Col xl={{ span: 8, offset: 8 }} lg={{ span: 12, offset: 0 }}>
          <Statistic
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix='Php'
            {...right}
            style={{ float: 'right', ...(right.style ?? {}) }}
          />
        </Col>
      </Row>

      <Progress
        percent={80}
        size={['100%', 20]}
        strokeColor={{
          '0%': '#87d068',
          '50%': '#ffe58f',
          '100%': '#ffccc7',
        }}
        showInfo={false}
        {...progress}
      />
    </Space>
  )
}
