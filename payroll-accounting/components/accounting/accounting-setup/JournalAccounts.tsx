import { Query } from '@/graphql/gql/graphql'
import { useDialog } from '@/hooks'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteFilled,
  DragOutlined,
  EditFilled,
  PlusCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Button, Card, Space, Table, Tooltip, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import _ from 'lodash'
import AddAccount from './forms/AddAccount'
import EditAccount from './forms/EditAccount'
import IntegrationTransfer from './forms/IntegrationTransfer'

export const DELETE_INTEGRATION = gql`
  mutation DeleteIntegration($integrationId: UUID) {
    deleteIntegration(integrationId: $integrationId)
  }
`
export const DELETE_INTEGRATION_ITEM = gql`
  mutation DeleteIntegrationItem(
    $integrationId: UUID
    $integrationItemId: UUID
  ) {
    deleteIntegrationItem(
      integrationId: $integrationId
      integrationItemId: $integrationItemId
    )
  }
`

export const INTEGRATION_ITEM = gql`
  query ($id: UUID, $page: Int, $size: Int, $filter: String) {
    integrationItemsByIntegrationId(
      id: $id
      page: $page
      size: $size
      filter: $filter
    ) {
      content {
        id
        sourceColumn
        details
        multiple
        journalAccount {
          code
          subAccountName
          subAccountSetupId
          motherAccount {
            id
            code
            accountName
            domain
            normalSide
          }
          subAccount {
            id
            code
            accountName
            domain
          }
          subSubAccount {
            id
            code
            accountName
            domain
          }
        }
        valueProperty
        disabledProperty
        disabledValue
        details
      }
      number
      totalPages
    }
  }
`

interface JournalProps {
  id: string
  domain: string
}

const JournalAccounts = (props: JournalProps) => {
  const { data, loading, refetch } = useQuery(INTEGRATION_ITEM, {
    variables: {
      id: props.id,
      filter: '',
      size: 10,
      page: 0,
    },
  })
  const JournalList = data?.integrationItemsByIntegrationId?.content as any

  //delete pending
  const [onDeleteIntegrationItem] = useMutation(DELETE_INTEGRATION_ITEM)

  const onAddAccount = useDialog(AddAccount)
  const onEditAccount = useDialog(EditAccount)
  const onTransferIntegration = useDialog(IntegrationTransfer)

  const handleAddAccount = () =>
    onAddAccount({ itemid: props.id }, (e: boolean) => {
      if (e) {
        refetch()
      }
    })
  const handleEditAccount = (row: any) =>
    onEditAccount(
      { row, domain: props?.domain, integrationId: props.id },
      (e: boolean) => {
        if (e) {
          refetch()
        }
      }
    )
  const handleTransferIntegration = () =>
    onTransferIntegration({ itemid: props.id }, (e: boolean) => {
      if (e) {
        refetch()
      }
    })

  const handleDeleteIntegrationItem = (itemId: string) => {
    onDeleteIntegrationItem({
      variables: {
        integrationId: props.id,
        integrationItemId: itemId,
      },
      onCompleted: () => {
        refetch()
        message.success('Integration Item Deleted')
      },
      onError: (err) => {
        console.log(err)
      },
    })
  }

  const columns: ColumnsType<any> = [
    // {
    //   title: 'Pattern',
    //   dataIndex: 'accountName',
    //   key: 'accountName',
    // },
    {
      title: 'Mother Account',
      dataIndex: 'journalAccount',
      key: 'journalAccount',
      render: (row) => {
        return row.motherAccount.code + '-' + row.motherAccount.accountName
      },
    },
    {
      title: 'Reference Sub-Account',
      dataIndex: 'journalAccount',
      key: 'journalAccount',
      render: (row) => {
        return row.subAccountName
      },
    },
    {
      title: 'Normal Side',
      dataIndex: 'journalAccount',
      key: 'journalAccount',
      render: (row) => {
        return row.motherAccount.normalSide
      },
    },
    {
      title: 'Multiple',
      dataIndex: 'multiple',
      key: 'multiple',
      render: (row) => {
        // console.log("attrBeginningBalance", row)
        return !row ? (
          <CloseCircleOutlined style={{ color: 'red' }} />
        ) : (
          <CheckCircleOutlined style={{ color: 'green' }} />
        )
      },
    },
    {
      title: 'Source Column',
      dataIndex: 'sourceColumn',
      key: 'sourceColumn',
      width: 180,
      fixed: 'right',
      render: (row) => _.upperCase(row),
    },
    {
      title: (
        <Tooltip title='Action'>
          <SettingOutlined />
        </Tooltip>
      ),
      width: 90,
      fixed: 'right',
      render: (row) => {
        // console.log("row",row)
        return (
          <>
            <Space>
              <Button
                onClick={() => handleEditAccount(row)}
                size='small'
                icon={<EditFilled />}
              />
              <Button
                onClick={() => handleDeleteIntegrationItem(row.id)}
                size='small'
                icon={<DeleteFilled />}
              />
            </Space>
          </>
        )
      },
    },
  ]

  // console.log(props.id)
  // console.log("JournalAccounts", data?.integrationItemsByIntegrationId?.content)

  return (
    <>
      <Card style={{ borderColor: 'teal' }}>
        <Space.Compact
          block
          style={{ marginBottom: 10, display: 'flex', justifyContent: 'end' }}
        >
          <Tooltip title='Add'>
            <Button onClick={handleAddAccount} icon={<PlusCircleOutlined />} />
          </Tooltip>
          <Tooltip title='Transfer'>
            <Button
              onClick={handleTransferIntegration}
              icon={<DragOutlined />}
            />
          </Tooltip>
          <Tooltip title='Delete'>
            <Button icon={<DeleteFilled />} />
          </Tooltip>
        </Space.Compact>
        <Table
          scroll={{ x: 1300, y: 440 }}
          loading={loading}
          rowKey='id'
          size='small'
          columns={columns}
          dataSource={JournalList ?? []}
        />
      </Card>
    </>
  )
}

export default JournalAccounts
