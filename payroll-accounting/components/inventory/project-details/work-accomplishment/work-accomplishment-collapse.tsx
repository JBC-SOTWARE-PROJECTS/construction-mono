import type { CollapseProps } from 'antd'
import { Col, Collapse, Row, Typography } from 'antd'
import WorkAccomplishmentsTable from './work-accomplishment-table'

export default function WorkAccomplishmentsCollapse() {
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'For the period of February 20,2023 to April 25,2023 ',
      children: <WorkAccomplishmentsTable />,
    },
    {
      key: '2',
      label: 'For the period of April 26,2023 to May 25,2023 ',
      children: <WorkAccomplishmentsTable />,
    },
    {
      key: '3',
      label: 'For the period of May 25,2023 to June 25,2023 ',
      children: <WorkAccomplishmentsTable />,
    },
  ]

  return (
    <Row>
      <Col span={24}>
        <Collapse items={items} bordered={false} defaultActiveKey={['1']} />
      </Col>
    </Row>
  )
}
