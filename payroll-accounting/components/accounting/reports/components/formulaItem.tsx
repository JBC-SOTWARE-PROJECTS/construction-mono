import { EditOutlined } from '@ant-design/icons'
import { gql, useQuery } from '@apollo/client'
import { Button, Card, List, Space } from 'antd'
import { useState } from 'react'
import { DrawerI } from './reportItem'
import ItemDrawer from './itemDrawer'

const ADDENDS = gql`
  query ($reportId: UUID, $formulas: [UUID]) {
    formulaItems: getFormulaItems(reportId: $reportId, formulas: $formulas) {
      id
      title
      normalSide
    }
  }
`

interface FormulaItemI {
  reportId: string
  record: any
  reportType: string
  refetchParent: any
}

export default function FormulaItem(props: FormulaItemI) {
  const { record, reportId, reportType, refetchParent } = props

  const [drawerData, setDrawerData] = useState<DrawerI>({
    id: null,
    fields: { title: '', isGroup: false },
  })
  const [open, setOpen] = useState(false)

  const { data, loading } = useQuery(ADDENDS, {
    variables: {
      reportId,
      formulas: record.formulaGroups,
    },
  })

  const showDrawer = (record: any) => {
    setDrawerData({
      id: record.id,
      fields: {
        title: record?.title,
        isFormula: record.isFormula,
        isGroup: record.isGroup,
        itemType: record.itemType,
        normalSide: record.normalSide,
        refetch: record?.refetchParent,
        refetchChild: record?.refetchChild,
        formulaGroups: record?.formulaGroups,
      },
    })
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <Card
      key={`card-${record.id}`}
      size='small'
      title={
        <List.Item style={{ padding: 0 }}>
          <List.Item.Meta
            title={
              <>
                ƒ {record?.title ?? ''}
                <Button
                  type='link'
                  key='list-loadmore-edit'
                  icon={<EditOutlined />}
                  onClick={() =>
                    showDrawer({
                      id: record?.id,
                      title: record?.title,
                      isGroup: record?.isGroup,
                      isFormula: record?.isFormula,
                      itemType: record?.itemType,
                      normalSide: record?.normalSide,
                      formulaGroups: record?.formulaGroups,
                      refetchParent: refetchParent,
                    })
                  }
                  size='small'
                />
              </>
            }
          />
        </List.Item>
      }
    >
      <Space>
        <Button type='dashed' danger>
          {record?.title ?? ''}
        </Button>
        <p>=</p>
        {(data?.formulaItems ?? []).map((f: any, index: number) => {
          if (index < (data?.formulaItems ?? []).length - 1)
            return (
              <Space key={`space-${index}-${record.id}`}>
                <Button type='dashed'>{f?.title ?? ''}</Button>
                <p>{record?.itemType ?? '+'}</p>
              </Space>
            )
          else
            return (
              <Button key={`btn-${index}-${record.id}`} type='dashed'>
                {f?.title ?? ''}
              </Button>
            )
        })}
      </Space>
      {open && (
        <ItemDrawer
          {...{
            id: drawerData?.id as string,
            reportLayout: { id: reportId },
            fields: drawerData?.fields,
            reportType,
            open,
            setOpen,
            onClose,
          }}
        />
      )}
    </Card>
  )
}
