import { FormItemProps, Input, InputProps } from 'antd'
import { forwardRef } from 'react'
import { FormItemStyled } from '.'

interface ExtendedInputProps extends FormItemProps {
  propsinput?: InputProps
  bold?: boolean
}

const FormInputStyled = ({ ...props }: ExtendedInputProps, ref: any) => {
  const { propsinput } = props
  return (
    <FormItemStyled
      style={{ marginBottom: '6px' }}
      {...props}
      $bold={props?.bold}
    >
      <Input {...propsinput} ref={ref} />
    </FormItemStyled>
  )
}

export default forwardRef(FormInputStyled)
