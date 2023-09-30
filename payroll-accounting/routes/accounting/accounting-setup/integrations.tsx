import IntergrationItem from '@/components/accounting/accounting-setup/IntergrationItem'
import CreateIntegrationsGroup from '@/components/accounting/accounting-setup/integrations/createGroup'
import { useDialog } from '@/hooks'
import ConfirmationPasswordHook from '@/hooks/promptPassword'
import { PageContainer, ProCard } from '@ant-design/pro-components'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Button } from 'antd'
type TargetKey = React.MouseEvent | React.KeyboardEvent | string

export const INTEGRATION_GROUP = gql`
  query {
    integrationGroupList {
      id
      description
    }
  }
`

export const INTEGRATION_GROUP_DELETE = gql`
  mutation ($id: UUID) {
    onDeleteIntegrationGroup(id: $id)
  }
`

export default function Integrations() {
  const [showPasswordConfirmation] = ConfirmationPasswordHook()
  const { data, loading, refetch } = useQuery(INTEGRATION_GROUP, {
    variables: {
      filter: '',
      accountCategory: null,
    },
  })

  const [onDelete, { loading: onDeleteLoad }] = useMutation(
    INTEGRATION_GROUP_DELETE
  )

  const dataSource = []

  const createDialog = useDialog(CreateIntegrationsGroup)

  const onHandleSearch = (filter: string) => {
    // refetch({ filter, page: 0 })
  }

  const onHandleClickCreateEdit = (record?: any) => {
    createDialog({ record: { ...record } }, () => refetch())
  }

  const onHandleChangeTab = (activeKey: string) => {
    // if (activeKey == 'all') refetch({ accountCategory: null, page: 0 })
    // else refetch({ accountCategory: activeKey, page: 0 })
  }

  const onUpdateTab = (id: any, action: 'add' | 'remove') => {
    if (action === 'remove') {
      showPasswordConfirmation((password) => {
        onDelete({ variables: { id }, onCompleted: () => refetch() })
      })
    }
  }

  return (
    <PageContainer
      title='Integrations'
      content='Overview of Journal Entries Templates.'
      extra={[
        <Button
          key='add-fiscal'
          type='primary'
          onClick={() => onHandleClickCreateEdit()}
        >
          Add Group
        </Button>,
      ]}
    >
      <ProCard
        ghost
        tabs={{
          type: 'editable-card',
          onEdit: onUpdateTab,
          hideAdd: true,
        }}
      >
        {(data?.integrationGroupList || []).map((tab: any) => (
          <ProCard.TabPane key={tab?.id} tab={tab?.description}>
            <IntergrationItem id={tab?.id} description={tab?.description} />
          </ProCard.TabPane>
        ))}
      </ProCard>
    </PageContainer>
  )
}
