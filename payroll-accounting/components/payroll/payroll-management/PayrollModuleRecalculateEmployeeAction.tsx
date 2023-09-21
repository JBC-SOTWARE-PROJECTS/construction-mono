import AccessControl from "@/components/accessControl/AccessControl";
import { PayrollModule } from "@/graphql/gql/graphql";
import useRecalculatePayrollModuleEmployee from "@/hooks/payroll/useRecalculatePayrollModuleEmployee";
import {
  Button,
  ButtonProps,
  message,
  Modal,
  Tooltip,
  TooltipProps,
} from "antd";
import { Maybe } from "graphql/jsutils/Maybe";

/**
 * Component to recalculate of One Payroll Module Employee. Based on the payroll module employee
 * id passed and the payroll module passed.
 *
 * @component
 * @example
 * <PayrollModuleRecalculateEmployeeAction
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
  module: PayrollModule.Contribution;
  id: Maybe<string> | undefined;
}

function PayrollModuleRecalculateEmployeeAction({
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
  const [updateStatus, loading] = useRecalculatePayrollModuleEmployee(
    module,
    upsertCallback,
    onErrorCallback
  );

  const recalculatePayrollEmployee = () => {
    Modal.confirm({
      title: "Confirm",
      content: `Are you sure you want to Recalculate this Employee?`,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => updateStatus(id),
    });
  };

  return (
    <AccessControl
      allowedPermissions={allowedPermissions ? allowedPermissions : []}
    >
      <Tooltip title="Recalculate Employee" {...tooltipProps}>
        <Button
          {...buttonProps}
          loading={loading}
          onClick={recalculatePayrollEmployee}
        >
          {/* {props?.children} */}
        </Button>
      </Tooltip>
    </AccessControl>
  );
}

export default PayrollModuleRecalculateEmployeeAction;
