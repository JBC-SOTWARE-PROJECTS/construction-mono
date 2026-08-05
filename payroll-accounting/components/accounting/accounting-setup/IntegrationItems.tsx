import { Query } from "@/graphql/gql/graphql"
import { gql, useMutation, useQuery } from "@apollo/client"
import {
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Row,
  Space,
  Table,
  Tooltip,
} from "antd"
import { ColumnsType } from "antd/es/table"
import { Maybe } from "graphql/jsutils/Maybe"
import JournalAccounts, { DELETE_INTEGRATION } from "./JournalAccounts"
import { useDialog } from "@/hooks"
import CreateIntegration from "./integrations/createInteration"
import {
  DeleteFilled,
  DragOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons"
import AddAccount from "./forms/AddAccount"
import EditAccount from "./forms/EditAccount"
import IntegrationTransfer from "./forms/IntegrationTransfer"
import IntegrationJournalAccounts from "./IntegrationJournalAccounts"

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
        autoPost
      }
      totalPages
      size
      number
      totalElements
    }
  }
`

interface IntegrationProps {
  id: string
  description: Maybe<string> | undefined
  domain: string
}

const IntegrationItems = (props: IntegrationProps) => {
  const onCreateDialog = useDialog(CreateIntegration)
  const onAddAccount = useDialog(AddAccount)
  const onEditAccount = useDialog(EditAccount)
  const onTransferIntegration = useDialog(IntegrationTransfer)
  const onShowJournalAccounts = useDialog(IntegrationJournalAccounts)

  const { data, loading, refetch } = useQuery(INTEGRATION_PER_GROUP, {
    variables: {
      id: props.id,
      filter: "",
      size: 10,
      page: 0,
    },
    notifyOnNetworkStatusChange: true,
  })
  const [onDeleteIntegration, { loading: onLoadingDelete }] =
    useMutation(DELETE_INTEGRATION)

  const onHandleClickCreateEdit = (record?: any) => {
    onCreateDialog({ integrationGroup: props.id, record: { ...record } }, () =>
      refetch()
    )
  }

  const handleTransferIntegration = (itemid: string) =>
    onTransferIntegration({ itemid }, (e: boolean) => {
      if (e) {
        refetch()
      }
    })

  const onHandleShowJournalAccounts = (id: string, domain: string) => {
    onShowJournalAccounts({ id, domain }, () => {})
  }

  const onHandleDeleteIntegration = (integrationId: string) => {
    onDeleteIntegration({
      variables: { integrationId },
      onCompleted: () => refetch(),
    })
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space>
        <Button onClick={() => onHandleClickCreateEdit()} type="primary">
          Add Integration
        </Button>
      </Space>
      <Row gutter={[16, 16]}>
        {(data?.ig?.content ?? []).map((dg: any) => {
          return (
            <Col span={8} key={dg.id}>
              <Card
                title={<a>{dg.description}</a>}
                extra={[
                  <Space.Compact
                    key={"card-extra"}
                    block
                    style={{
                      marginBottom: 10,
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Tooltip title="Edit Integration">
                      <Button
                        onClick={() => onHandleClickCreateEdit(dg)}
                        icon={<EditOutlined />}
                        type="primary"
                      />
                    </Tooltip>
                    <Tooltip title="Transfer">
                      <Button
                        onClick={() => handleTransferIntegration(dg.id)}
                        icon={<DragOutlined />}
                        type="primary"
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        icon={<DeleteFilled />}
                        type="primary"
                        onClick={() => onHandleDeleteIntegration(dg.id)}
                        loading={onLoadingDelete}
                      />
                    </Tooltip>
                  </Space.Compact>,
                ]}
                style={{
                  border: "1px solid #399B53",
                }}
                styles={{
                  header: { border: "none" },
                  body: { paddingBottom: 10 },
                }}
                //headStyle={}
                //bodyStyle={{ paddingBottom: 10 }}
              >
                <Descriptions column={2} size="small">
                  <Descriptions.Item
                    label="Order Priority"
                    labelStyle={{ color: "#399B53" }}
                  >
                    {dg.orderPriority}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Flag Value"
                    labelStyle={{ color: "#399B53" }}
                  >
                    {dg.flagValue}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Domain"
                    labelStyle={{ color: "#399B53" }}
                  >
                    {dg.domain}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Auto Post"
                    labelStyle={{ color: "#399B53" }}
                  >
                    <Checkbox checked={dg.autoPost} />
                  </Descriptions.Item>
                </Descriptions>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Button
                      block
                      type="primary"
                      onClick={() =>
                        onHandleShowJournalAccounts(dg.id, dg.domain)
                      }
                    >
                      View Journal Accounts
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          )
        })}
      </Row>
    </Space>
  )
}

export default IntegrationItems
