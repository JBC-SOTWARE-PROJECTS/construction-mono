import { Form, Input, FormItemProps, InputProps } from 'antd'
import React, { forwardRef } from 'react'
import _ from 'lodash'

interface ExtendedInputProps extends FormItemProps {
  propsinput?: InputProps
}

const FormInput = ({ ...props }: ExtendedInputProps, ref: any) => {
  const { propsinput } = props
  return (
    <Form.Item {...props} style={{ marginBottom: '6px' }}>
      <Input {...propsinput} ref={ref} />
    </Form.Item>
  )
}

export default forwardRef(FormInput)
