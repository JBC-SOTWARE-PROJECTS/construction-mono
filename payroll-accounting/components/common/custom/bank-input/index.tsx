import { Form, FormItemProps, InputNumber, InputNumberProps } from "antd"
import styled from "styled-components"

interface ExtendedInputProps extends FormItemProps {
  propsinputnumber: InputNumberProps
}

export default function BankInput({ ...props }: ExtendedInputProps, ref: any) {
  const { propsinputnumber } = props
  return (
    <InputCSS>
      <Form.Item
        {...props}
        style={{ marginBottom: "6px", ...(props?.style ?? {}) }}
      >
        <InputNumber
          parser={(value) =>
            value?.replace(/\$\s?|(,*)/g, "") as unknown as number
          }
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          {...propsinputnumber}
          ref={ref}
          className="w-full"
        />
      </Form.Item>
    </InputCSS>
  )
}
const InputCSS = styled.div`
  input {
    text-align: right !important;
    padding-right: 30px !important;
  }
`
