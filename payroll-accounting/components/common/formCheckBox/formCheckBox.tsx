import { Form, FormItemProps, CheckboxProps, Checkbox } from "antd";
import React, { forwardRef } from "react";
import _ from "lodash";

interface ExtendedCheckBoxProps extends FormItemProps {
  propscheckbox: CheckboxProps;
  checkBoxLabel?: string
}

const FormSelect = ({ ...props }: ExtendedCheckBoxProps, ref: any) => {
  const { propscheckbox, checkBoxLabel } = props;
  return (
    <Form.Item {...props} style={{ marginBottom: "1px" }}>
      <Checkbox  {...propscheckbox} ref={ref}>
        {checkBoxLabel}
      </Checkbox>
    </Form.Item>
  );
};

export default forwardRef(FormSelect);
