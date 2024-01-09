import { Form } from 'antd'
import styled from 'styled-components'

export const FormItemStyled = styled(Form.Item)<{ $bold?: boolean }>`
  font-weight: ${(props) => (props.$bold ? '600' : 'normal')};
`

export { default as FormInput } from './form-input'
export { default as FormTextarea } from './form-textarea'
export { default as FormSelect } from './form-select'
export { default as FormInputNumber } from './form-input-number'
export { default as FormDatePicker } from './form-date-picker'
