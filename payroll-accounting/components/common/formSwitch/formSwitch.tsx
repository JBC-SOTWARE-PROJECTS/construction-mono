import { Form, FormItemProps, SwitchProps, Switch } from 'antd'
import React, { forwardRef } from 'react'
import _ from 'lodash'

interface ExtendedSwitchProps extends FormItemProps {
  switchprops?: SwitchProps
}

const FormSwitch = (
  { switchprops, ...props }: ExtendedSwitchProps,
  ref: any
) => {
  return (
    <Form.Item {...props} style={{ marginBottom: '6px' }}>
      <Switch {...switchprops} ref={ref} />
    </Form.Item>
  )
}

export default forwardRef(FormSwitch)
