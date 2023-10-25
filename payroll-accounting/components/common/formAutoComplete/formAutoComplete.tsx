import {
  Form,
  Input,
  FormItemProps,
  AutoCompleteProps,
  AutoComplete,
} from "antd";
import React, { forwardRef } from "react";
import _ from "lodash";

interface ExtendedInputProps extends FormItemProps {
  propsinput?: AutoCompleteProps;
}

const FormAutoComplete = ({ ...props }: ExtendedInputProps, ref: any) => {
  const { propsinput } = props;
  return (
    <Form.Item {...props} style={{ marginBottom: "6px" }}>
      <AutoComplete {...propsinput} ref={ref} className="w-full" />
    </Form.Item>
  );
};

export default forwardRef(FormAutoComplete);
