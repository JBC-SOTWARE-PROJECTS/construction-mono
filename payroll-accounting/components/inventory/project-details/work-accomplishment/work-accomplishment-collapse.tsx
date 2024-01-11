import { Button, CollapseProps, Popconfirm, Space, message } from 'antd'
import { Col, Collapse, Row, Typography } from 'antd'
import WorkAccomplishmentsTable from './work-accomplishment-table'
import { ProjectWorkAccomplish } from '@/graphql/gql/graphql'
import dayjs from 'dayjs'
import {
  EditOutlined,
  LockOutlined,
  PrinterOutlined,
  UnlockOutlined,
} from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import { apiUrlPrefix } from '@/shared/settings'

const TOGGLE_LOCK = gql`
  mutation ($id: UUID) {
    toggle: projectWorkAccomplishToggleLock(id: $id) {
      id
    }
  }
`
interface WorkAccomplishmentsCollapseI {
  data: { workAccomplish: ProjectWorkAccomplish[] }
  loading: boolean
  onHandleEdit: (id: string) => void
  refetch: any
}

export default function WorkAccomplishmentsCollapse(
  props: WorkAccomplishmentsCollapseI
) {
  const { data } = props

  const [onToggleLock, { loading: toggleLockLoading }] =
    useMutation(TOGGLE_LOCK)

  const confirm = (id: string) => {
    onToggleLock({
      variables: {
        id,
      },
      onCompleted: () => props?.refetch(),
    })
  }

  const printPDF = (id: string) => {
    window.open(
      apiUrlPrefix + '/statement-of-work-accomplished?id=' + id,
      'creditnote'
    )
  }

  return (
    <Row>
      <Col span={24}>
        <Collapse
          items={data?.workAccomplish.map((works: ProjectWorkAccomplish) => ({
            key: works.id,
            label: `For the period of ${dayjs(works.periodStart).format(
              'MMMM DD,YYYY'
            )}  to ${dayjs(works.periodEnd).format('MMMM DD,YYYY')} `,
            children: <WorkAccomplishmentsTable projectId={works?.id} />,
            extra: (
              <Space>
                <Popconfirm
                  placement='topLeft'
                  title='Toggle Lock'
                  description='Proceed with toggling the lock?'
                  onConfirm={() => confirm(works?.id)}
                  okText='Yes'
                  cancelText='No'
                >
                  <Button
                    type='primary'
                    size='small'
                    icon={
                      works?.status == 'LOCKED' ? (
                        <LockOutlined />
                      ) : (
                        <UnlockOutlined />
                      )
                    }
                    style={{
                      background: works?.status == 'LOCKED' ? 'red' : '#4096ff',
                    }}
                  />
                </Popconfirm>

                <Button
                  type='primary'
                  size='small'
                  icon={<EditOutlined />}
                  onClick={() => props.onHandleEdit(works?.id)}
                />

                <Button
                  type='primary'
                  size='small'
                  icon={<PrinterOutlined />}
                  style={{ background: 'orange' }}
                  onClick={() => printPDF(works?.id)}
                />
              </Space>
            ),
            collapsible: 'header',
          }))}
          bordered={false}
        />
      </Col>
    </Row>
  )
}
