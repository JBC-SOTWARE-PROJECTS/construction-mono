import { Form, FormItemProps, SelectProps, Select } from "antd";
import React, { forwardRef } from "react";
import _ from "lodash";

interface ExtendedSelectProps extends FormItemProps {
  propsselect: SelectProps;
}

const FormSelect = ({ ...props }: ExtendedSelectProps, ref: any) => {
  const { propsselect } = props;
  return (
    <Form.Item style={{ marginBottom: "6px" }} {...props}>
      <Select
        {...propsselect}
        filterOption={(input, option) => {
          let label: string = _.toString(option?.label ?? "");
          return label.toLowerCase().includes(input.toLowerCase());
        }}
        ref={ref}
      />
    </Form.Item>
  );
};

export default forwardRef(FormSelect);
