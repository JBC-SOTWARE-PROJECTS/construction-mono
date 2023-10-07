import AccessControl from "@/components/accessControl/AccessControl";
import { PayrollModule } from "@/graphql/gql/graphql";
import useRecalculateAllPayrollModuleEmployee from "@/hooks/payroll/useRecalculateAllPayrollModuleEmployee";
import { Button, message, Modal, Tooltip, TooltipProps } from "antd";
import { ButtonProps } from "antd/lib/button";

/**
 * Component to recalculate of All Payroll Module Employees. Based on the payroll module
 * id passed and the payroll module passed.
 *
 * @component
 * @example
 * <PayrollModuleRecalculateAllEmployeeAction
 *    id={item?.id}
 *    module={PayrollModule.OTHER_DEDUCTION}
 *    buttonProps={{
 *      type: 'primary'
 *    }}
 * />
 *
 */

interface IProps {
  buttonProps: ButtonProps;
  tooltipProps?: TooltipProps;
  refetch: () => void;
  allowedPermissions?: string[];
  children?: any;
  module: PayrollModule;
  id: string;
}

function PayrollModuleRecalculateAllEmployeeAction({
  buttonProps,
  tooltipProps,
  refetch,
  allowedPermissions,
  module,
  id,
  ...props
}: IProps) {
  const upsertCallback = (result: any) => {
    let { data } = result || {};
    if (data?.success) {
      message.success(data?.message || "Successfully updated employee status.");
      if (refetch) refetch();
    } else {
      message.error(
        data?.message ||
          "Failed to update employee status. Please try again later."
      );
    }
  };
  const onErrorCallback = () => {
    message.error("Failed to update employee status. Please try again later.");
  };
  const [recalculateEmployee, loading] = useRecalculateAllPayrollModuleEmployee(
    module,
    upsertCallback,
    onErrorCallback
  );

  const recalculatePayrollEmployee = () => {
    Modal.confirm({
      title: "Confirm",
      content: `Are you sure you want to Recalculate ALL of the Employees?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => recalculateEmployee(id),
    });
  };

  return (
    <AccessControl
      allowedPermissions={allowedPermissions ? allowedPermissions : []}
    >
      <Tooltip title="Recalculate All Employees" {...tooltipProps}>
        <Button
          {...buttonProps}
          loading={loading}
          onClick={recalculatePayrollEmployee}
        >
          {props?.children}
        </Button>
      </Tooltip>
    </AccessControl>
  );
}

export default PayrollModuleRecalculateAllEmployeeAction;
