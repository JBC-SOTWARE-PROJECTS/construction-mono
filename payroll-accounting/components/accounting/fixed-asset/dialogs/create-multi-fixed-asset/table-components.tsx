import FormSelect from '@/components/common/form-styled/form-select'
import { useGetFixedAssetItems } from '@/hooks/fixed-asset'
import { gql } from '@apollo/client'
import { DatePicker, Form, Input, InputNumber, Select } from 'antd'
import React, { useContext } from 'react'
import { MultiFixedAssetContext } from '.'
import { FixedAssetItems } from '@/graphql/gql/graphql'

interface TableCellI {
  dataIndex: keyof FixedAssetItems
  save: any
}

const InputNumberIndexes = ['salvage_value', 'purchasePrice', 'useful_life']
const SelectIndexes = ['itemName', 'officeId']
const DateIndexes = ['depreciationStartDate', 'purchaseDate']

interface SelectI {
  save: (params: any) => void
  dataIndex: keyof FixedAssetItems
}

const ItemSelect = React.memo((props: SelectI) => {
  const context = useContext(MultiFixedAssetContext)
  const itemList = context?.fixedAssetItemList

  return (
    <Form.Item style={{ margin: 0 }} name={props.dataIndex}>
      <Select
        bordered={false}
        autoFocus
        labelInValue
        options={itemList?.data?.map((item) => ({
          label: item?.descLong,
          value: item?.id,
          key: item?.id,
        }))}
        onChange={props.save}
        onBlur={props.save}
        open
      />
    </Form.Item>
  )
})

ItemSelect.displayName = 'ItemSelect'

// eslint-disable-next-line react/display-name
const OfficeSelect = React.memo((props: SelectI) => {
  const context = useContext(MultiFixedAssetContext)
  const companyOffices = context?.companyOffices

  return (
    <Form.Item style={{ margin: 0 }} name={props.dataIndex}>
      <Select
        bordered={false}
        autoFocus
        labelInValue
        options={companyOffices?.data?.map((item) => ({
          label: item?.officeDescription,
          value: item?.id,
          key: item?.id,
        }))}
        onChange={props.save}
        onBlur={props.save}
        open
      />
    </Form.Item>
  )
})

OfficeSelect.displayName = 'OfficeSelect'

export default function TableCell(props: TableCellI) {
  const { dataIndex, save } = props
  let children = null

  const context = useContext(MultiFixedAssetContext)
  const itemList = context?.fixedAssetItemList

  if (dataIndex == 'itemName') return <ItemSelect {...props} />
  if (dataIndex == 'office') return <OfficeSelect {...props} />
  else if (DateIndexes.includes(dataIndex))
    children = (
      <DatePicker
        bordered={false}
        autoFocus
        onSelect={save}
        onBlur={save}
        style={{ width: '100%' }}
      />
    )
  else if (InputNumberIndexes.includes(dataIndex))
    children = (
      <InputNumber
        bordered={false}
        autoFocus
        onPressEnter={save}
        onBlur={save}
      />
    )
  else
    children = (
      <Input bordered={false} autoFocus onPressEnter={save} onBlur={save} />
    )

  return (
    <Form.Item style={{ margin: 0 }} name={dataIndex}>
      {children}
    </Form.Item>
  )
}
