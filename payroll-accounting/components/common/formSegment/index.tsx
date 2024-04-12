import { Form, FormItemProps, Segmented, SegmentedProps } from "antd"
import { forwardRef } from "react"

interface ExtendedSegmentProps extends FormItemProps {
  propssegment: SegmentedProps
}

const FormSegment = ({ ...props }: ExtendedSegmentProps, ref: any) => {
  const { propssegment } = props
  return (
    <Form.Item style={{ marginBottom: "6px" }} {...props}>
      <Segmented {...propssegment} ref={ref} />
    </Form.Item>
  )
}

export default forwardRef(FormSegment)
