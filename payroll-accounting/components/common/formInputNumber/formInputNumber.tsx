import {
  Form,
  Input,
  FormItemProps,
  InputProps,
  InputNumber,
  InputNumberProps,
} from "antd"
import React, { forwardRef } from "react"
import _ from "lodash"

interface ExtendedInputProps extends FormItemProps {
  propsinputnumber: InputNumberProps
}

const FormInputNumber = (
  { propsinputnumber, ...props }: ExtendedInputProps,
  ref: any
) => {
  return (
    <Form.Item
      {...props}
      style={{ marginBottom: "6px", ...(props?.style ?? {}) }}
    >
      <InputNumber {...propsinputnumber} ref={ref} className="w-full" />
    </Form.Item>
  )
}

export default forwardRef(FormInputNumber)
