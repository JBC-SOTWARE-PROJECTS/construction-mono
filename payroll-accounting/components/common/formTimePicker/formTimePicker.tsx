import { Form, FormItemProps, TimePicker, TimePickerProps } from "antd";
import { forwardRef } from "react";

interface ExtendedDateRangeProps extends FormItemProps {
  propstimepicker?: TimePickerProps;
}

const FormTimePicker = (
  { propstimepicker, ...props }: ExtendedDateRangeProps,
  ref: any
) => {
  return (
    <Form.Item {...props} style={{ marginBottom: "6px", ...props?.style }}>
      <TimePicker {...propstimepicker} ref={ref} className="w-full" />
    </Form.Item>
  );
};

export default forwardRef(FormTimePicker);
