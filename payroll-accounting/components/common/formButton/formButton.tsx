import { Form, FormItemProps, Button, ButtonProps } from "antd";
import React, { forwardRef } from "react";
import _ from "lodash";

interface ButtonExtend extends ButtonProps {
  btnlabel?: string;
}

interface ExtendedInputProps extends FormItemProps {
  buttonprops: ButtonExtend;
}

const FormButton = ({ ...props }: ExtendedInputProps, ref: any) => {
  const { buttonprops } = props;
  const { btnlabel } = buttonprops;
  return (
    <Form.Item {...props}>
      <Button type="primary" htmlType="submit" block {...buttonprops}>
        {btnlabel}
      </Button>
    </Form.Item>
  );
};

export default forwardRef(FormButton);
