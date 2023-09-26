import { Form, DatePicker, FormItemProps } from "antd";
import React, { forwardRef } from "react";
import _ from "lodash";
import type { DatePickerProps } from "antd";

interface ExtendedDatePickerProps extends FormItemProps {
  propsdatepicker: DatePickerProps;
}

const FormDatePicker = (
  { propsdatepicker, ...props }: ExtendedDatePickerProps,
  ref: any
) => {
  return (
    <Form.Item {...props} style={{ marginBottom: "6px" }}>
      <DatePicker {...propsdatepicker} ref={ref} className="w-full" />
    </Form.Item>
  );
};

export default forwardRef(FormDatePicker);
