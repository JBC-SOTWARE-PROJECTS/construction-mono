import { FormInput, FormSelect } from '@/components/common'
import { useDialog } from '@/hooks'
import { DeleteOutlined } from '@ant-design/icons'
import { gql, useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Divider,
  Drawer,
  Dropdown,
  Form,
  List,
  Space,
  Transfer,
  Typography,
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import type { MenuProps } from 'antd'
import { useState } from 'react'
import type { TransferDirection } from 'antd/es/transfer'
import FormCheckBox from '@/components/common/formCheckBox/formCheckBox'
import ChartOfAccountsComponentSelector from '@/components/chartOfAccounts/chartOfAccountsSelector'
import ParentAccountSelector from '../dialogs/parentAccountSelector'
import { MathematicalOperations, normalSide } from '@/constant/financial-setup'

interface ItemDrawerI {
  id: string | null
  reportType: string
  reportLayout: any
  open: boolean
  fields: any
  setOpen: (value: boolean) => void
  onClose: () => void
}

const ITEM_MUTATION_QUERY = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    createReportsLayoutItem(id: $id, fields: $fields) {
      response {
        id
      }
    }
  }
`

const ITEMS_MUTATION_QUERY = gql`
  mutation ($parentId: UUID, $accounts: [Map_String_ObjectScalar]) {
    onAddMultipleSubAccounts(parentId: $parentId, accounts: $accounts) {
      success
    }
  }
`

const REPORT_MUTATION_QUERY = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    createReportsLayout(id: $id, fields: $fields) {
      response {
        id
      }
    }
  }
`

const ITEM_DELETE_MUTATION_QUERY = gql`
  mutation ($id: UUID) {
    deleteReportItem(id: $id) {
      success
    }
  }
`
const GQL_QUERY = gql`
  query ($reportType: ReportType) {
    groups: getReportItemsByReportType(reportType: $reportType) {
      key: id
      title
    }
  }
`

export default function ItemDrawer(props: ItemDrawerI) {
  const { id, fields, reportLayout, open, reportType, setOpen, onClose } = props
  const [form] = useForm()
  const [targetKeys, setTargetKeys] = useState<string[]>(
    fields?.formulaGroups ?? []
  )
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [selectedAcc, setSelectedAcc] = useState<string[]>([])

  const addAccountDialog = useDialog(ParentAccountSelector)
  const addSubAccountDialog = useDialog(ChartOfAccountsComponentSelector)

  const {
    data,
    loading: groupsLoading,
    refetch,
  } = useQuery(GQL_QUERY, {
    variables: {
      reportType,
    },
  })

  const [onUpdateReport, { loading: updateReportLoading }] = useMutation(
    REPORT_MUTATION_QUERY
  )

  const [onUpdate, { loading: updateLoading }] =
    useMutation(ITEM_MUTATION_QUERY)

  const [onAddAccounts, { loading: addAccountsLoading }] =
    useMutation(ITEMS_MUTATION_QUERY)

  const [onDelete, { loading: deleteLoading }] = useMutation(
    ITEM_DELETE_MUTATION_QUERY
  )

  const onSave = () => {
    const formValues = form.getFieldsValue()
    console.log(form.getFieldsValue(), 'form.getFieldsValue()')
    console.log(fields, 'fields')
    if (id) {
      const variables = {
        id,
        fields: {
          ...formValues,
          config: { ...fields?.config, ...formValues?.config },
          formulaGroups: [],
        },
      }

      if (targetKeys) {
        variables.fields.formulaGroups = targetKeys as []
      }
      onUpdate({
        variables,
        onCompleted: () => {
          setOpen(false)
          fields.refetch()
        },
      })

      // if (isCurrentYearEarningsFormula) {
      //   onUpdateReport({
      //     variables: {
      //       id: reportLayout?.id,
      //       fields: {
      //         currentYearEarningsFormula: reportLayout?.id,
      //       },
      //     },
      //     onCompleted: () => {},
      //   })
      // }
    }
  }

  const onAddGroup = (parentId?: string) => {
    onUpdate({
      variables: {
        id: null,
        fields: {
          reportsLayoutId: reportLayout?.id ?? null,
          account: null,
          reportLayoutItemsParent: parentId ?? null,
          orderNo: 0,
          title: 'Untitled Group',
          normalSide: 'DEBIT',
          isGroup: true,
          hasTotal: true,
        },
      },
      onCompleted: () => {
        fields.refetchChild()
      },
    })
  }

  const onDeleteItem = () => {
    onDelete({
      variables: { id },
      onCompleted: () => {
        fields.refetch()
        onClose()
      },
    })
  }

  const onShowAddAccounts = () => {
    addAccountDialog({ parentId: id, reportType }, () => {
      fields.refetchChild()
    })
  }

  const onDrawerActionClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'delete':
        onDeleteItem()
        break
      case 'add':
        onAddGroup(id as string)
        break
      case 'add-mother':
        onShowAddAccounts()
        break
      case 'add-sub-account':
        onSelectSubAccount()
        break
      default:
        break
    }
  }

  const items = [
    {
      key: 'add',
      label: 'Add Group',
    },
    {
      key: 'add-mother',
      label: 'Add Mother account',
    },
    {
      key: 'add-sub-account',
      label: 'Add Sub-account',
    },
  ]

  const onChange = (
    nextTargetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[]
  ) => {
    console.log('targetKeys:', nextTargetKeys)
    console.log('direction:', direction)
    console.log('moveKeys:', moveKeys)
    setTargetKeys(nextTargetKeys)
  }

  const onSelectChange = (
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[]
  ) => {
    console.log('sourceSelectedKeys:', sourceSelectedKeys)
    console.log('targetSelectedKeys:', targetSelectedKeys)
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }

  const onScroll = (
    direction: TransferDirection,
    e: React.SyntheticEvent<HTMLUListElement>
  ) => {
    console.log('direction:', direction)
    console.log('target:', e.target)
  }

  const onSelectSubAccount = () => {
    addSubAccountDialog({ defaultSelected: [] }, (accounts: any) => {
      if (accounts) {
        onAddAccounts({
          variables: {
            parentId: id,
            itemType: 'SUB-ACCOUNT',
            accounts,
          },
          onCompleted: () => {
            fields.refetchChild()
          },
        })
      }
    })
  }

  return (
    <Drawer
      title={
        <Typography.Text style={{ width: 400 }} ellipsis>
          {fields?.isGroup ? fields?.title : fields?.account?.description}
        </Typography.Text>
      }
      placement={'right'}
      width={500}
      onClose={onClose}
      open={open}
      footer={
        <Space wrap>
          {fields?.isGroup && (
            <>
              <Dropdown.Button
                menu={{ items, onClick: onDrawerActionClick }}
                onClick={() => onDeleteItem()}
              >
                Delete
              </Dropdown.Button>
            </>
          )}
          {!fields?.isGroup && (
            <Button
              danger
              icon={<DeleteOutlined />}
              type='dashed'
              onClick={() => onDeleteItem()}
            >
              Delete
            </Button>
          )}

          <Button type='primary' onClick={onSave} loading={updateLoading}>
            Save
          </Button>
        </Space>
      }
    >
      {fields?.isGroup || fields?.isFormula ? (
        <Form
          layout='vertical'
          form={form}
          initialValues={{
            title: fields?.title,
            itemType: fields?.itemType,
            normalSide: fields?.normalSide,
          }}
        >
          <FormInput
            name='title'
            label={`${fields?.isGroup ? 'Group' : 'Row'} Heading`}
            propsinput={{}}
          />
          {fields?.isFormula && (
            <FormSelect
              name='itemType'
              label={'Mathematical Operations'}
              propsselect={{
                options: MathematicalOperations,
              }}
            />
          )}
          {fields?.isGroup && (
            <>
              <FormInput
                name={['config', 'totalLabel']}
                label={'Group Total Label'}
                propsinput={{}}
              />
              <FormSelect
                name='normalSide'
                label='Normal Side'
                propsselect={{ options: normalSide }}
              />
            </>
          )}
        </Form>
      ) : null}

      {fields?.isGroup || fields?.isFormula ? (
        <Form
          name='config-form'
          layout='horizontal'
          form={form}
          initialValues={{
            config: fields?.config,
          }}
        >
          <FormCheckBox
            name={['config', 'hideGroupAccounts']}
            label={'Hide Accounts'}
            valuePropName='checked'
            propscheckbox={{}}
          />
          {/* {fields?.isFormula && (
            <FormCheckBox
              name={['config', 'isCurrentYearEarningsFormula']}
              label={'Current Year Earnings Formula'}
              valuePropName='checked'
              propscheckbox={{}}
            />
          )} */}
        </Form>
      ) : null}

      {fields?.isFormula && (
        <>
          <Divider dashed />
          <Transfer
            dataSource={data?.groups}
            titles={['Source', 'Operands']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={onChange}
            onSelectChange={onSelectChange}
            onScroll={onScroll}
            render={(item) => item?.title ?? ''}
            // listStyle={{
            //   height: 300,
            // }}
          />
        </>
      )}

      {/* <List
        size='small'
        header={
          <Space size='large'>
            <Typography.Text>Sub-Accounts</Typography.Text>
            <Button type='dashed' style={{ color: 'teal' }}>
              Add Accounts
            </Button>
          </Space>
        }
        bordered
        dataSource={selectedAcc}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      /> */}
    </Drawer>
  )
}
