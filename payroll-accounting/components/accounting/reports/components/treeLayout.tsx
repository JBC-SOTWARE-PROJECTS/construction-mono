import { FormInput } from '@/components/common'
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { gql, useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Dropdown,
  Form,
  Row,
  Space,
  Tree,
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import type { DataNode, TreeProps } from 'antd/es/tree'
import { Key, useState } from 'react'
import type { MenuProps } from 'antd'
import { useDialog } from '@/hooks'
import ParentAccountSelector from '../dialogs/parentAccountSelector'

const GQL_QUERY = gql`
  query ($reportType: ReportType) {
    reportLayout: displayReportLayoutByType(reportType: $reportType) {
      id
      title
      children {
        key
        title
        disableCheckbox
        children {
          key
          title
          disableCheckbox
          children {
            disableCheckbox
            key
            title
          }
        }
      }
    }
  }
`

const ITEM_MUTATION_QUERY = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    createReportsLayoutItem(id: $id, fields: $fields) {
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

interface DrawerI {
  id: string | null | number | Key
  isGroup: boolean
}

const TreeLayout: React.FC = () => {
  const addAccountDialog = useDialog(ParentAccountSelector)
  const [gData, setGData] = useState<DataNode[]>([])

  const { data, loading, refetch } = useQuery(GQL_QUERY, {
    variables: {
      reportType: 'PROFIT_AND_LOSS',
    },
    onCompleted: ({ reportLayout }) => {
      if (reportLayout) {
        const defaultData: DataNode[] = []

        const generateDataFromDb = (_data: any[], _tns?: DataNode[]) => {
          const tns = _tns || defaultData

          _data.map((items, index) => {
            tns.push({
              ...items,
            })
            const childItems = items?.children ?? []
            if (childItems.length > 0) {
              tns[index].children = []
              generateDataFromDb(childItems, tns[index].children)
            }
          })
        }

        generateDataFromDb((reportLayout?.children as DataNode[]) ?? [])
        setGData(defaultData)
      }
    },
  })

  const [onUpdate, { loading: updateLoading }] = useMutation(
    ITEM_MUTATION_QUERY,
    {
      onCompleted: () => {
        refetch()
      },
    }
  )

  const [onDelete, { loading: deleteLoading }] = useMutation(
    ITEM_DELETE_MUTATION_QUERY
  )

  const [form] = useForm()
  const [drawerData, setDrawerData] = useState<DrawerI>({
    id: null,
    isGroup: false,
  })
  const [expandedKeys] = useState(['0-0', '0-0-0', '0-0-0-0'])
  const [open, setOpen] = useState(false)

  const showDrawer = (record: DataNode) => {
    console.log(record, 'record')
    form.setFieldValue('title', record?.title)
    setDrawerData({
      id: record.key,
      isGroup: record?.disableCheckbox ? true : false,
    })
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const onSave = () => {
    const { title } = form.getFieldsValue()
    if (drawerData?.id)
      onUpdate({
        variables: {
          id: drawerData?.id,
          fields: {
            title,
          },
        },
        onCompleted: () => {
          setOpen(false)
          refetch()
        },
      })
  }

  const onDragEnter: TreeProps['onDragEnter'] = (info) => {
    console.log(info)
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  }

  const onDrop: TreeProps['onDrop'] = (info) => {
    console.log(info)
    const dropKey = info.node.key
    const dragKey = info.dragNode.key
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data)
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback)
        }
      }
    }
    const data = [...gData]

    // Find dragObject
    let dragObj: DataNode
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj)
      })
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj)
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      })
    } else {
      let ar: DataNode[] = []
      let i: number
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!)
      } else {
        ar.splice(i! + 1, 0, dragObj!)
      }
    }

    const fields: any = {
      orderNo: info.dropPosition,
    }

    if (info.node.disableCheckbox && info.dropPosition > -1 && !info.dropToGap)
      fields.reportLayoutItemsParent = { id: info.node.key as number }

    if (info.node.disableCheckbox && info.dropPosition > -1 && info.dropToGap)
      fields.reportLayoutItemsParent = null

    onUpdate({
      variables: {
        id: info.dragNode.key,
        fields,
      },
    })
    setGData(data)
  }

  const onAddGroup = (parentId?: string) => {
    onUpdate({
      variables: {
        id: null,
        fields: {
          reportsLayoutId: data?.reportLayout?.id ?? null,
          account: null,
          reportLayoutItemsParent: parentId ?? null,
          orderNo: 0,
          title: 'Untitled Group',
          normalSide: 'DEBIT',
          isGroup: true,
          hasTotal: true,
        },
      },
    })
  }

  const onDeleteItem = () => {
    onDelete({
      variables: { id: drawerData?.id },
      onCompleted: () => {
        refetch()
        onClose()
      },
    })
  }

  const items = [
    {
      key: 'add',
      label: 'Add Group',
    },
    {
      key: 'delete',
      label: 'Delete',
    },
  ]

  const onDrawerActionClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'delete':
        onDeleteItem()
        break
      case 'add':
        onAddGroup(drawerData?.id as string)
        break
      default:
        break
    }
  }

  const onShowAddAccounts = () => {
    addAccountDialog({ parentId: drawerData?.id }, () => {
      refetch()
    })
  }

  return (
    <>
      <Card size='small' style={{ marginBottom: 10 }}>
        <Space>
          <Button icon={<PlusCircleOutlined />} onClick={() => onAddGroup()}>
            Add Group
          </Button>
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Space>
      </Card>
      <Card bordered style={{ minHeight: 800 }}>
        <Row>
          <Col span={20} />
          <Col span={4} style={{ textAlign: 'right' }}>
            <b>September 2023</b>
          </Col>
        </Row>
        <Divider />
        <Tree
          checkable
          showLine
          className='draggable-tree'
          defaultExpandAll
          defaultExpandedKeys={expandedKeys}
          // draggable
          blockNode
          onDragEnter={onDragEnter}
          onDrop={onDrop}
          treeData={gData}
          titleRender={(e: DataNode) => {
            return (
              <Row>
                <Col span={20}>
                  <Card size='small'>{e.title as string}</Card>
                  {/* <Button
                    block
                    style={{ textAlign: 'left' }}
                    type={!e.disableCheckbox ? 'dashed' : 'primary'}
                    onClick={() => showDrawer(e)}
                  >
                    {e.title as string}
                  </Button> */}
                </Col>
                <Col span={4}>
                  {!e.disableCheckbox ? (
                    <Button
                      block
                      disabled
                      style={{ textAlign: 'right' }}
                      type='text'
                    >
                      0.00
                    </Button>
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
            )
          }}
        />
      </Card>
      <Drawer
        title={drawerData.isGroup ? 'Group' : 'Row'}
        placement={'right'}
        width={500}
        onClose={onClose}
        open={open}
        footer={
          <Space wrap>
            {drawerData.isGroup && (
              <>
                <Dropdown.Button
                  menu={{ items, onClick: onDrawerActionClick }}
                  onClick={() => onShowAddAccounts()}
                >
                  Add Account
                </Dropdown.Button>

                {/* <Button onClick={onClose} type='dashed'>
                  Add Group
                </Button> */}
              </>
            )}
            {!drawerData.isGroup && (
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
        {drawerData.isGroup ? (
          <Form layout='vertical' form={form}>
            <FormInput
              name='title'
              label={`${drawerData.isGroup ? 'Group' : 'Row'} Heading`}
              propsinput={{}}
            />
          </Form>
        ) : null}
      </Drawer>
    </>
  )
}

export default TreeLayout
