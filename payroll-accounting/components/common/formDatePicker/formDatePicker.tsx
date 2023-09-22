import React from "react";
import { Form, FormItemProps, DatePicker, DatePickerProps } from "antd";
import { forwardRef } from "react";

interface ExtendedDateRangeProps extends FormItemProps {
  propsDatepicker?: DatePickerProps;
}

const FormDatePicker = (
  { propsDatepicker, ...props }: ExtendedDateRangeProps,
  ref: any
) => {
  return (
    <Form.Item {...props} style={{ marginBottom: "6px" }}>
      <DatePicker
        {...propsDatepicker}
        ref={ref}
        format="DD-MM-YYYY"
        className="w-full"
      />
    </Form.Item>
  );
};

export default forwardRef(FormDatePicker);
