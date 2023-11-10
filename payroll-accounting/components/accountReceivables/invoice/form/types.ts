export interface DataType {
  id?: string
  particular: string
  description: string
  qty: number
  price: number
  amount: number
}

export interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof DataType
  record: DataType
  fieldType: 'DATE' | 'TEXT' | 'NUMBER' | 'OPTIONS' | 'SEARCH'
  handleSave:
    | ((record: DataType) => void)
    | ((record: DataType, fields?: any, dataIndex?: string) => void)
  style: any
}

export interface EditableRowProps {
  index: number
}

export interface EditableFieldTypeI {
  fieldType: 'DATE' | 'TEXT' | 'NUMBER' | 'OPTIONS' | 'SEARCH'
  dataIndex: string
  save: any
  inputRef: any
}
