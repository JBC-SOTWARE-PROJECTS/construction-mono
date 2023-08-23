import { Form, FormItemProps, Button, ButtonProps } from "antd";
import React, { forwardRef } from "react";
import _ from "lodash";
import AccessControl from "@/components/accessControl/AccessControl";

interface ButtonExtend extends ButtonProps {
  btnlabel?: string;
}

interface ExtendedInputProps extends FormItemProps {
  buttonprops: ButtonExtend;
  allowedPermissions?: string[];
}

const FormButton = ({ ...props }: ExtendedInputProps, ref: any) => {
  const { buttonprops } = props;
  const { btnlabel } = buttonprops;
  return (
    <AccessControl allowedPermissions={props.allowedPermissions || []}>
      <Form.Item {...props}>
        <Button type="primary" htmlType="submit" block {...buttonprops}>
          {btnlabel}
        </Button>
      </Form.Item>
    </AccessControl>
  );
};

export default forwardRef(FormButton);
