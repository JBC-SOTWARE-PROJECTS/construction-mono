import FormSelect from '@/components/common/form-styled/form-select'
import { DatePicker, Form, Input, InputNumber, Select } from 'antd'

interface TableCellI {
  dataIndex: any
  inputRef: any
  save: any
}

export default function TableCell(props: TableCellI) {
  const { dataIndex, inputRef, save } = props
  let children = null

  if (dataIndex == 'assetName')
    children = <Select autoFocus onBlur={save} open />
  else if (dataIndex == 'depreciationStartDate')
    children = (
      <DatePicker
        autoFocus
        onSelect={save}
        onBlur={save}
        style={{ width: '100%' }}
      />
    )
  else if (
    ['salvage_value', 'purchase_price', 'useful_life'].includes(dataIndex)
  )
    children = <InputNumber autoFocus onPressEnter={save} onBlur={save} />
  else children = <Input autoFocus onPressEnter={save} onBlur={save} />

  return (
    <Form.Item
      style={{ margin: 0 }}
      name={dataIndex}
      // rules={[
      //   {
      //     required: true,
      //     message: `${title} is required.`,
      //   },
      // ]}
    >
      {children}
    </Form.Item>
  )
}
