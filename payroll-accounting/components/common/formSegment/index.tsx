import { Form, FormItemProps, Segmented, SegmentedProps } from 'antd'
import { forwardRef } from 'react'

interface ExtendedSegmentProps extends FormItemProps {
  propssegment: SegmentedProps
}

const FormSegment = ({ ...props }: ExtendedSegmentProps, ref: any) => {
  const { propssegment } = props
  return (
    <Form.Item {...props} style={{ marginBottom: '6px' }}>
      <Segmented {...propssegment} ref={ref} />
    </Form.Item>
  )
}

export default forwardRef(FormSegment)
