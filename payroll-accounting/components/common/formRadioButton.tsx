import {
  Form,
  Input,
  FormItemProps,
  InputProps,
  Radio,
  RadioGroupProps,
} from 'antd'
import { TextAreaProps } from 'antd/es/input'
import { RadioButtonProps } from 'antd/es/radio/radioButton'
import React, { forwardRef } from 'react'

const { TextArea } = Input

interface ExtendedRadioButtonProps extends FormItemProps {
  propsradiobutton?: RadioGroupProps
}

const FormRadioButton = ({ ...props }: ExtendedRadioButtonProps, ref: any) => {
  const { propsradiobutton } = props
  return (
    <Form.Item style={{ marginBottom: '6px' }} {...props}>
      <Radio.Group {...propsradiobutton} ref={ref} />
    </Form.Item>
  )
}

export default forwardRef(FormRadioButton)
