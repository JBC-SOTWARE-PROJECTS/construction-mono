import { Form, FormItemProps, CheckboxProps, Checkbox } from 'antd'
import React, { forwardRef } from 'react'
import _ from 'lodash'
import { CheckboxGroupProps } from 'antd/es/checkbox'

interface ExtendedCheckBoxProps extends FormItemProps {
  propscheckboxgroup: CheckboxGroupProps
}

const FormCheckBoxGroup = (
  { propscheckboxgroup, ...props }: ExtendedCheckBoxProps,
  ref: any
) => {
  return (
    <Form.Item {...props} style={{ marginBottom: '1px' }}>
      <Checkbox.Group {...propscheckboxgroup} ref={ref} />
    </Form.Item>
  )
}

export default forwardRef(FormCheckBoxGroup)
