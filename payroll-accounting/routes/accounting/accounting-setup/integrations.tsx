import IntegrationItems from "@/components/accounting/accounting-setup/IntegrationItems"
import CreateIntegrationsGroup from "@/components/accounting/accounting-setup/integrations/createGroup"
import { useDialog } from "@/hooks"
import ConfirmationPasswordHook from "@/hooks/promptPassword"
import asyncComponent from "@/utility/asyncComponent"
import { PageContainer, ProCard } from "@ant-design/pro-components"
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { Button, Card, Col, Row, Space, Tabs } from "antd"

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
export const INTEGRATION_PER_GROUP = gql`
  query ($id: UUID, $filter: String, $size: Int, $page: Int) {
    ig: integrationGroupItemList(
      id: $id
      filter: $filter
      size: $size
      page: $page
    ) {
      content {
        id
        description
        flagValue
        orderPriority
        domain
      }
      totalPages
      size
      number
      totalElements
    }
  }
`
export default function Integrations() {
  const [showPasswordConfirmation] = ConfirmationPasswordHook()

  const [
    onLoadItems,
    { data: dataGroup, loading: loadingGroup, refetch: refetchGroup },
  ] = useLazyQuery(INTEGRATION_PER_GROUP)

  const { data, loading, refetch } = useQuery(INTEGRATION_GROUP, {
    variables: {
      filter: "",
      accountCategory: null,
    },
    onCompleted: ({ integrationGroupList }) => {
      if (integrationGroupList) {
        onLoadItems({
          variables: {
            id: integrationGroupList[0].id,
            filter: "",
            size: 10,
            page: 0,
          },
        })
      }
    },
  })

  const [onDelete, { loading: onDeleteLoad }] = useMutation(
    INTEGRATION_GROUP_DELETE
  )

  const createDialog = useDialog(CreateIntegrationsGroup)

  const onHandleSearch = (filter: string) => {
    // refetch({ filter, page: 0 })
  }

  const onHandleClickCreate = (record?: any) => {
    createDialog({ record: { ...record } }, () => refetch())
  }

  const onTabChange = (activeKey: string) => {
    onLoadItems({
      variables: {
        id: activeKey,
        filter: "",
        size: 10,
        page: 0,
      },
    })
    // if (activeKey == 'all') refetch({ accountCategory: null, page: 0 })
    // else refetch({ accountCategory: activeKey, page: 0 })
  }

  const onUpdateTab = (id: any, action: "add" | "remove") => {
    if (action === "remove") {
      showPasswordConfirmation((password) => {
        onDelete({ variables: { id }, onCompleted: () => refetch() })
      })
    }
  }

  return (
    <PageContainer
      title="Integrations"
      content="Overview of Journal Entries Templates."
    >
      <Card
        style={{ width: "100%" }}
        title="Integration Group"
        extra={[
          <Button
            key="add-group"
            type="primary"
            onClick={() => onHandleClickCreate()}
          >
            Add Group
          </Button>,
        ]}
      >
        <Tabs
          type={"editable-card"}
          hideAdd={true}
          onEdit={onUpdateTab}
          defaultActiveKey="1"
          tabPosition={"top"}
          destroyInactiveTabPane={true}
          items={(data?.integrationGroupList || []).map((tab: any) => ({
            label: tab.description,
            key: tab.id,
            children: (
              <IntegrationItems
                id={tab?.id}
                description={tab?.description}
                domain={tab?.domain}
              />
            ),
          }))}
        />
      </Card>
      {/* <ProCard
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
      </ProCard> */}
    </PageContainer>
  )
}
