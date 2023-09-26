import { DatePicker, DatePickerProps, Form, FormItemProps } from "antd";
import { forwardRef } from "react";

interface ExtendedDateRangeProps extends FormItemProps {
  propstimepicker?: DatePickerProps;
}

const FormDateTimePicker = (
  { propstimepicker, ...props }: ExtendedDateRangeProps,
  ref: any
) => {
  return (
    <Form.Item {...props} style={{ marginBottom: "6px" }}>
      <DatePicker {...propstimepicker} ref={ref} className="w-full" />
    </Form.Item>
  );
};

export default forwardRef(FormDateTimePicker);
