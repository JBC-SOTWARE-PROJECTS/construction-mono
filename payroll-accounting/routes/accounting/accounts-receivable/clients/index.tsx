import CustomPageTitle from '@/components/accountReceivables/common/customPageTitle'
import CreateCustomers from '@/components/accountReceivables/customers/createCustomers'
// import { ArCustomers } from '@/graphql/gql/graphql'
import { useDialog } from '@/hooks'
import { useFindCustomers } from '@/hooks/accountReceivables'
import { getInitials, getRandomColor } from '@/hooks/accountReceivables/commons'
import { MoreOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { PageContainer, ProCard } from '@ant-design/pro-components'
import { Avatar, Button, Dropdown, Input, List, MenuProps, Row } from 'antd'

const { Search } = Input
export default function Customers() {
  const { content, number, totalPages, totalElements, refetch, loading } =
    useFindCustomers()
  const onCreateCustomer = useDialog(CreateCustomers)

  const handleCreateCustomer = () => {
    onCreateCustomer({}, () => refetch())
  }

  const handleEditCustomer = (record: any | null) => {
    onCreateCustomer({ values: record }, () => refetch())
  }

  const actionItems: MenuProps['items'] = [
    {
      label: 'Edit',
      key: 'edit',
    },
  ]

  return (
    <PageContainer
      title={
        <CustomPageTitle
          title='Clients'
          subTitle=' Tracking Clients Debts and Payments.'
        />
      }
      extra={
        <Button
          type='primary'
          size='middle'
          icon={<PlusCircleOutlined />}
          onClick={() => handleCreateCustomer()}
        >
          New Client
        </Button>
      }
    >
      <Row gutter={[16, 16]}>
        <ProCard>
          <Search
            size='middle'
            placeholder='Search here..'
            onSearch={() => {}}
            style={{ width: '100%' }}
          />
        </ProCard>
        <ProCard>
          <List
            itemLayout='horizontal'
            dataSource={content ?? []}
            renderItem={(item: any, index) => (
              <List.Item
                actions={[
                  <Dropdown
                    key={'button-carret'}
                    menu={{
                      items: actionItems,
                      onClick: ({ key }) => handleEditCustomer(item),
                    }}
                    trigger={['click']}
                  >
                    <Button
                      type='link'
                      icon={<MoreOutlined />}
                      size='large'
                      onClick={(e) => e.preventDefault()}
                    />
                  </Dropdown>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape='square'
                      style={{
                        backgroundColor:
                          item?.otherDetails?.color ?? getRandomColor(),
                      }}
                    >
                      {getInitials(item?.customerName ?? '')}
                    </Avatar>
                  }
                  title={
                    <a
                      href={`/accounting/accounts-receivable/clients/${item?.id}/activities`}
                    >
                      {item?.customerName}
                    </a>
                  }
                  description={item?.address}
                />
              </List.Item>
            )}
          />
        </ProCard>
      </Row>
    </PageContainer>
  )
}
