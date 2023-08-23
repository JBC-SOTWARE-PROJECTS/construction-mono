import {
  Form,
  DatePicker,
  FormItemProps,
  TimeRangePickerProps,
  TimePicker,
  TimePickerProps,
} from "antd";
import React, { forwardRef } from "react";
import _ from "lodash";

interface ExtendedDateRangeProps extends FormItemProps {
  showpresstslist?: boolean;
  propstimepicker?: TimePickerProps;
}

const FormTimePicker = (
  { propstimepicker, ...props }: ExtendedDateRangeProps,
  ref: any
) => {
  return (
    <Form.Item {...props} style={{ marginBottom: "6px" }}>
      <TimePicker {...propstimepicker} ref={ref} className="w-full" />
    </Form.Item>
  );
};

export default forwardRef(FormTimePicker);
