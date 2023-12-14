import {
  Form,
  Input,
  FormItemProps,
  InputProps,
  InputNumber,
  InputNumberProps,
} from 'antd'
import React, { forwardRef } from 'react'
import _ from 'lodash'
import { FormItemStyled } from '.'

interface ExtendedInputProps extends FormItemProps {
  propsinputnumber?: InputNumberProps
  bold?: boolean
}

const FormStyledInputNumber = (
  { propsinputnumber, ...props }: ExtendedInputProps,
  ref: any
) => {
  return (
    <FormItemStyled
      {...props}
      style={{ marginBottom: '6px' }}
      $bold={props?.bold}
    >
      <InputNumber {...propsinputnumber} ref={ref} />
    </FormItemStyled>
  )
}

export default forwardRef(FormStyledInputNumber)
