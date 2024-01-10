import AccessControl from '@/components/accessControl/AccessControl'
import ProjectHeader from '@/components/inventory/project-details/common/projectHeader'
import NewWorkAccomplishment from '@/components/inventory/project-details/dialogs/upsert-work-accomplishments'
import WorkAccomplishmentsCollapse from '@/components/inventory/project-details/work-accomplishment/work-accomplishment-collapse'
import { useDialog } from '@/hooks'
import { PlusCircleOutlined } from '@ant-design/icons'
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from '@ant-design/pro-components'
import { Button, Col, Form, Input, Row } from 'antd'
import { useRouter } from 'next/router'

export default function WorkAccomplishments() {
  const { query } = useRouter()

  const dialogCreate = useDialog(NewWorkAccomplishment)

  const onUpsertRecord = () => {
    dialogCreate({ projectId: query?.id }, () => {})
  }
  const onSearchRecord = (text: string) => {}

  return (
    <PageContainer
      pageHeaderRender={(e) => <ProjectHeader id={query?.id as string} />}
    >
      <ProCard
        title='Accomplishment Reports'
        headStyle={{
          flexWrap: 'wrap',
        }}
        bordered
        headerBordered
        size='small'
        extra={
          <AccessControl allowedPermissions={['add_bill_of_quantities']}>
            <ProFormGroup size='small'>
              <Button
                size='small'
                type='primary'
                icon={<PlusCircleOutlined />}
                onClick={() => onUpsertRecord()}
              >
                Add Work Accomplishment
              </Button>
            </ProFormGroup>
          </AccessControl>
        }
      >
        <div className='w-full mb-5'>
          <Form layout='vertical' className='filter-form'>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Input.Search
                  size='middle'
                  placeholder='Search here..'
                  onSearch={(e) => onSearchRecord(e)}
                  className='w-full'
                />
              </Col>
            </Row>
          </Form>
        </div>
        <WorkAccomplishmentsCollapse />
      </ProCard>
    </PageContainer>
  )
}
