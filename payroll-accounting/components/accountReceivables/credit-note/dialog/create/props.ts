import { DatePickerType } from 'antd/lib/date-picker'
import { ModalStyles } from './styles'
import { MenuProps } from 'antd'

export const cnDateFormat = 'DD MMM YYYY'

export const CnCreateModalProps = {
  open: true,
  closable: false,
  width: '100%',
  style: ModalStyles.style,
  styles: ModalStyles.maskStyle,
  className: 'full-page-modal',
}

export const CnCommonFormProps = {
  style: { minWidth: 300 },
  size: 'large',
}

export const CnEditableFieldTypeProps = {
  datePicker: {
    autoFocus: true,
    bordered: false,
    format: cnDateFormat,
    size: 'middle',
    allowClear: false,
  },
  inputNumber: {
    style: { textAlign: 'right', width: '100%' },
    autoFocus: true,
    bordered: false,
    size: 'middle',
  },
  select: {
    labelInValue: true,
    virtual: true,
    style: { width: '100%' },
    placeholder: 'Please select',
    defaultOpen: true,
    showSearch: true,
    size: 'middle',
    defaultActiveFirstOption: false,
    filterOption: false,
    autoFocus: true,
    bordered: false,
  },
}

export const CnTableActionItems: MenuProps['items'] = [
  {
    label: 'Remove',
    key: 'remove',
  },
]
