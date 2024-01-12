import { EditOutlined } from '@ant-design/icons'
import { gql, useQuery } from '@apollo/client'
import { Button, List, Typography } from 'antd'
import { Key, useState } from 'react'
import ItemDrawer from './itemDrawer'
import styled from 'styled-components'
interface ReportItemI {
  key: string
  id: string
  title: string
  reportType: string
  normalSide: string
  itemType: string
  isGroup: boolean
  bordered: boolean
  config?: {
    hideGroupAccounts: boolean
    isCurrentYearEarningsFormula: boolean
    totalLabel: string
  }
  refetchParent: () => void
}

export interface DrawerI {
  id: string | null | number | Key
  fields: any
}

const ITEM_LIST = gql`
  query ($parentId: UUID) {
    reportItem: getReportItemByParent(parentId: $parentId) {
      id
      orderNo
      title
      normalSide
      reportsLayoutId {
        id
      }
      account {
        code
        accountName
      }
      isGroup
      config {
        hideGroupAccounts
        isCurrentYearEarningsFormula
        totalLabel
      }
    }
  }
`

export default function ReportItem(props: ReportItemI) {
  const {
    id,
    title,
    isGroup,
    itemType,
    normalSide,
    bordered,
    reportType,
    config,
    refetchParent,
  } = props
  const [drawerData, setDrawerData] = useState<DrawerI>({
    id: null,
    fields: { title: '', isGroup: false },
  })
  const [open, setOpen] = useState(false)
  const { data, loading, refetch } = useQuery(ITEM_LIST, {
    variables: {
      parentId: id,
    },
  })

  const showDrawer = (record: any) => {
    setDrawerData({
      id: record.id,
      fields: {
        title: record?.title,
        account: record?.account,
        isGroup: record.isGroup,
        itemType: record.itemType,
        normalSide: record.normalSide,
        config: record.config,
        refetch: record?.refetch,
        refetchChild: record?.refetchChild,
      },
    })
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <ListCss>
      <List
        key={id}
        loading={loading}
        size='small'
        bordered={false}
        header={
          <List.Item key={id} style={{ padding: 0 }}>
            <List.Item.Meta
              title={
                <>
                  {title}
                  <Button
                    type='link'
                    key='list-loadmore-edit'
                    icon={<EditOutlined />}
                    onClick={() =>
                      showDrawer({
                        id,
                        title,
                        isGroup,
                        itemType,
                        normalSide,
                        config,
                        refetch: refetchParent,
                        refetchChild: refetch,
                      })
                    }
                    size='small'
                  />
                </>
              }
            />
          </List.Item>
        }
        footer={
          <b>{config?.totalLabel ? config?.totalLabel : `Total ${title}`}</b>
        }
        dataSource={data?.reportItem ?? []}
        renderItem={(item: any) =>
          item.isGroup ? (
            <div style={{ marginLeft: 20 }} key={item.id}>
              <ReportItem
                key={`rp-${item.id}`}
                {...{
                  id: item.id as string,
                  title: item?.title ?? '',
                  reportType,
                  isGroup: item.isGroup,
                  itemType: item.itemType,
                  normalSide: item.normalSide,
                  config: item.config,
                  showDrawer: showDrawer,
                  bordered: false,
                  refetchParent: refetch,
                }}
              />
            </div>
          ) : (
            <List.Item
              key={item.id}
              actions={[
                <Button
                  type='link'
                  key='list-loadmore-edit'
                  icon={<EditOutlined />}
                  size='small'
                  onClick={() => showDrawer({ ...item, refetch })}
                />,
              ]}
              style={{ padding: 0 }}
            >
              <List.Item.Meta
                description={
                  <a style={{ marginLeft: 20 }}>
                    {item.isGroup ? item.title : item.account.accountName}
                  </a>
                }
              />
              <div>0.00</div>
            </List.Item>
          )
        }
      />
      {open && (
        <ItemDrawer
          {...{
            id: drawerData?.id as string,
            reportType,
            reportLayout: data?.reportLayout,
            fields: drawerData?.fields,
            open,
            setOpen,
            onClose,
          }}
        />
      )}
    </ListCss>
  )
}

const ListCss = styled.div`
  .ant-list-header,
  .ant-list-footer {
    padding-left: 0 !important;
  }
`
