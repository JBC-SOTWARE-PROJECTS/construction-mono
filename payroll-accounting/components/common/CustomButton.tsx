import { Form, FormItemProps, Button, ButtonProps } from "antd";
import React, { forwardRef } from "react";
import _ from "lodash";
import AccessControl from "@/components/accessControl/AccessControl";

interface ExtendedButtonProps extends ButtonProps {
  allowedPermissions?: string[];
  label?: string;
}

const CustomButton = ({ ...props }: ExtendedButtonProps) => {
  return (
    <AccessControl allowedPermissions={props.allowedPermissions || []}>
      <Button htmlType="submit" block {...props}>
        {props.children}
      </Button>
    </AccessControl>
  );
};

export default CustomButton;
