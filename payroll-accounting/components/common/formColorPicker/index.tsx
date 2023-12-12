import { Form, FormItemProps, ColorPickerProps, ColorPicker } from 'antd'
import React, { forwardRef } from 'react'

interface ExtendedColorPickerProps extends FormItemProps {
  propscolorpicker: ColorPickerProps
}

const FormColorPicker = ({ ...props }: ExtendedColorPickerProps) => {
  const { propscolorpicker } = props
  return (
    <Form.Item {...props} style={{ marginBottom: '1px' }}>
      <ColorPicker {...propscolorpicker} />
    </Form.Item>
  )
}

export default forwardRef(FormColorPicker)
