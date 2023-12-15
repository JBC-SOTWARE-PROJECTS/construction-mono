import { Form, FormItemProps, CheckboxProps, Checkbox } from 'antd'
import React, { forwardRef } from 'react'
import _ from 'lodash'

interface ExtendedCheckBoxProps extends FormItemProps {
  propscheckbox: CheckboxProps
  checkBoxLabel?: string
}

const FormCheckbox = (
  { checkBoxLabel, propscheckbox, ...props }: ExtendedCheckBoxProps,
  ref: any
) => {
  return (
    <Form.Item {...props} style={{ marginBottom: '1px' }}>
      <Checkbox {...propscheckbox} ref={ref}>
        {checkBoxLabel}
      </Checkbox>
    </Form.Item>
  )
}

export default forwardRef(FormCheckbox)
