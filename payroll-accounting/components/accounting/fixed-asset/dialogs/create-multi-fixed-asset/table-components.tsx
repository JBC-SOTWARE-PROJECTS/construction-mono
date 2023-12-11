import FormSelect from '@/components/common/form-styled/form-select'
import { useGetFixedAssetItems } from '@/hooks/fixed-asset'
import { gql } from '@apollo/client'
import {
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Select,
} from 'antd'
import React, { useContext } from 'react'
import { MultiFixedAssetContext } from '.'
import { FixedAssetItems } from '@/graphql/gql/graphql'
import { DepreciationMethods } from '@/constant/fixed-asset'
import dayjs from 'dayjs'
import { FAEditableContext } from './table'

interface FormFields {
  itemName: { value: string; label: string } | null
  office: { value: string; label: string } | null
}
interface TableCellI {
  dataIndex: keyof FixedAssetItems
  save: any
}

interface SelectI {
  save: (params: any) => void
  dataIndex: keyof FixedAssetItems
}

const ItemSelect = React.memo((props: SelectI) => {
  const context = useContext(MultiFixedAssetContext)
  const itemList = context?.fixedAssetItemList

  return (
    <Form.Item
      style={{ margin: 0 }}
      name={props.dataIndex}
      rules={[
        {
          required: true,
        },
      ]}
    >
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
    <Form.Item
      style={{ margin: 0 }}
      name={props.dataIndex}
      rules={[
        {
          required: true,
        },
      ]}
    >
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

const DepreciationMethodSelect = React.memo((props: SelectI) => {
  return (
    <Form.Item
      style={{ margin: 0 }}
      name={props.dataIndex}
      rules={[
        {
          required: true,
        },
      ]}
    >
      <Select
        bordered={false}
        autoFocus
        options={DepreciationMethods}
        onChange={props.save}
        onBlur={props.save}
        open
      />
    </Form.Item>
  )
})

DepreciationMethodSelect.displayName = 'DepreciationMethodSelect'

const UsefulLifeInput = React.memo((props: SelectI) => {
  return (
    <Form.Item
      style={{ margin: 0 }}
      name={props.dataIndex}
      rules={[
        {
          required: true,
        },
      ]}
    >
      <InputNumber
        bordered={false}
        autoFocus
        onPressEnter={props.save}
        onBlur={props.save}
        formatter={(value) => `${value} year(s)`}
        parser={(value) => value!.replace('year(s)', '')}
      />
    </Form.Item>
  )
})

UsefulLifeInput.displayName = 'UsefulLifeInput'

const DepreciationDatePicker = React.memo((props: SelectI) => {
  const form: FormInstance<FormFields> = useContext(FAEditableContext)!

  const validateDepreciationDate = (_: any, value: any) => {
    const purchaseDate = form.getFieldValue('purchaseDate')
    const depreciationMethod = form.getFieldValue('depreciationMethod')
    if (value && dayjs(value).isBefore(purchaseDate, 'day')) {
      return Promise.reject(
        new Error('Depreciation Date must not be earlier than Purchase Date')
      )
    }

    if (depreciationMethod !== 'NO_DEPRECIATION' && !value)
      return Promise.reject(new Error('Depreciation Date is required'))

    return Promise.resolve()
  }

  return (
    <Form.Item
      style={{ margin: 0 }}
      name={props.dataIndex}
      rules={[
        {
          validator: validateDepreciationDate,
        },
      ]}
    >
      <DatePicker
        bordered={false}
        autoFocus
        onSelect={props.save}
        onBlur={props.save}
        style={{ width: '100%' }}
      />
    </Form.Item>
  )
})

DepreciationDatePicker.displayName = 'DepreciationDatePicker'

const PruchaseDatePicker = React.memo((props: SelectI) => {
  const form: FormInstance<FormFields> = useContext(FAEditableContext)!

  const validateDepreciationDate = (_: any, value: any) => {
    const depreciationStartDate = form.getFieldValue('depreciationStartDate')
    const depreciationMethod = form.getFieldValue('depreciationMethod')
    if (value && dayjs(value).isAfter(depreciationStartDate, 'day')) {
      return Promise.reject(
        new Error('Depreciation Date must not be earlier than Purchase Date')
      )
    }

    if (depreciationMethod !== 'NO_DEPRECIATION' && !value)
      return Promise.reject(new Error('Depreciation Date is required'))

    return Promise.resolve()
  }

  return (
    <Form.Item
      style={{ margin: 0 }}
      name={props.dataIndex}
      rules={[
        {
          required: true,
          validator: validateDepreciationDate,
        },
      ]}
    >
      <DatePicker
        bordered={false}
        autoFocus
        onSelect={props.save}
        onBlur={props.save}
        style={{ width: '100%' }}
      />
    </Form.Item>
  )
})

PruchaseDatePicker.displayName = 'PruchaseDatePicker'

const InputNumberIndexes = ['salvage_value', 'purchasePrice', 'useful_life']

export default function TableCell(props: TableCellI) {
  const { dataIndex, save } = props
  let children = null

  const context = useContext(MultiFixedAssetContext)
  const itemList = context?.fixedAssetItemList

  if (dataIndex == 'itemName') return <ItemSelect {...props} />
  if (dataIndex == 'office') return <OfficeSelect {...props} />
  if (dataIndex == 'depreciationStartDate')
    return <DepreciationDatePicker {...props} />
  if (dataIndex == 'usefulLife') return <UsefulLifeInput {...props} />
  if (dataIndex == 'depreciationMethod')
    return <DepreciationMethodSelect {...props} />
  else if (dataIndex == 'purchaseDate') return <PruchaseDatePicker {...props} />
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
