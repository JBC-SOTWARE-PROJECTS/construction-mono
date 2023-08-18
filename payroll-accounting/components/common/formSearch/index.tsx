import { Form, FormItemProps, Input } from 'antd'
import { SearchProps } from 'antd/es/input'
import { forwardRef } from 'react'
const { Search } = Input

interface ExtendedSearchProps extends FormItemProps {
  propssearch: SearchProps
}

const FormSearch = ({ ...props }: ExtendedSearchProps, ref: any) => {
  const { propssearch } = props
  return (
    <Form.Item style={{ marginBottom: '6px' }} {...props}>
      <Search {...propssearch} ref={ref} />
    </Form.Item>
  )
}

export default forwardRef(FormSearch)
