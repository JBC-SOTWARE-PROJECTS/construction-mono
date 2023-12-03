import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  type InputRef,
} from 'antd'
import type { FormInstance } from 'antd/es/form'
import dayjs from 'dayjs'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  EditableCellProps,
  EditableFieldTypeI,
  EditableRowProps,
} from '../types'
import { useLazyQuery } from '@apollo/client'
import { INVOICE_PARTICULAR_LIST_GQL } from '@/components/accountReceivables/configuration/invoiceItems'

const dateFormat = 'DD MMM YYYY'

export const getFieldArrayValue = (dataIndex: any, value: any) => {
  let actualValue: any = value[dataIndex]
  const isArray = Array.isArray(dataIndex)
  if (isArray) {
    let remap = dataIndex.map((da, index) => {
      if (index == 0) actualValue = value[da]
      else actualValue[da]
    })
  }

  return actualValue
}

export const EditableFieldType = (props: EditableFieldTypeI) => {
  const { dataIndex, save, fieldType, inputRef } = props

  const [onShowProducts, { loading: productsLoading, data: productsData }] =
    useLazyQuery(INVOICE_PARTICULAR_LIST_GQL)

  const onSearch = (search: string) => {
    onShowProducts({
      variables: {
        search,
        page: 0,
        size: 10,
      },
    })
  }

  useEffect(() => {
    onShowProducts({
      variables: {
        search: '',
        page: 0,
        size: 10,
      },
    })
  }, [onShowProducts])

  const getFieldType = (type: any) => {
    switch (type) {
      case 'DATE':
        return (
          <DatePicker
            autoFocus={true}
            bordered={false}
            format={dateFormat}
            onChange={save}
            onBlur={save}
            size='middle'
            allowClear={false}
          />
        )
      case 'NUMBER':
        return (
          <InputNumber
            onPressEnter={save}
            onBlur={save}
            style={{ textAlign: 'right', width: '100%' }}
            autoFocus={true}
            bordered={false}
            size='middle'
          />
        )
      case 'SEARCH':
        return (
          <Select
            labelInValue={true}
            virtual
            style={{ width: '100%' }}
            placeholder='Please select'
            defaultOpen
            onSearch={onSearch}
            showSearch
            size='middle'
            defaultActiveFirstOption={false}
            filterOption={false}
            autoFocus={true}
            onBlur={save}
            onSelect={save}
            bordered={false}
            options={(productsData?.particulars?.content ?? []).map(
              (items: any) => ({ label: items.itemName, value: items.id })
            )}
          />
        )
      default:
        return (
          <Input
            bordered={false}
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            size='middle'
          />
        )
    }
  }

  return (
    <Form.Item style={{ margin: 0 }} name={dataIndex}>
      {getFieldType(fieldType)}
    </Form.Item>
  )
}

const EditableContext = React.createContext<FormInstance<any> | null>(null)

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  fieldType,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    if (editing) {
      if (inputRef?.current) inputRef?.current!.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    if (fieldType == 'DATE')
      form.setFieldsValue({ [dataIndex]: dayjs(record[dataIndex]) })
    else form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      const isArray = Array.isArray(dataIndex)

      toggleEdit()
      if (fieldType == 'DATE')
        handleSave(
          { ...record, [dataIndex]: dayjs(values[dataIndex]) },
          { [dataIndex]: dayjs(values[dataIndex]) }
        )
      else {
        if (isArray) {
          handleSave({ ...record }, { ...values }, dataIndex)
        } else handleSave({ ...record, ...values }, { ...values }, dataIndex)
      }
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <EditableFieldType {...{ inputRef, dataIndex, save, fieldType }} />
    ) : (
      <div
        className='editable-cell-value-wrap'
        style={{ paddingRight: 0, paddingLeft: 0 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return (
    <td
      {...restProps}
      style={{ ...(restProps?.style ?? {}), paddingTop: 5, paddingBottom: 5 }}
    >
      {childNode}
    </td>
  )
}

// ROWS

export const EditableRow: React.FC<EditableRowProps> = ({
  index,
  ...props
}) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}
