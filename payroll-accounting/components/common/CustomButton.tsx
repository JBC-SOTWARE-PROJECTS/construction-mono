import { Form, FormItemProps, Button, ButtonProps, Tooltip } from "antd";
import React, { forwardRef } from "react";
import _ from "lodash";
import AccessControl from "@/components/accessControl/AccessControl";

interface ExtendedButtonProps extends ButtonProps {
  allowedPermissions?: string[];
  label?: string;
  tooltip?: string;
}

const CustomButton = ({ ...props }: ExtendedButtonProps) => {
  if (props?.tooltip)
    return (
      <AccessControl allowedPermissions={props.allowedPermissions || []}>
        <Tooltip title={props?.tooltip}>
          <Button htmlType="submit" {...props}>
            {props?.children}
          </Button>
        </Tooltip>
      </AccessControl>
    );

  return (
    <AccessControl allowedPermissions={props.allowedPermissions || []}>
      <Button htmlType="submit" {...props}>
        {props?.children}
      </Button>
    </AccessControl>
  );
};

export default CustomButton;
