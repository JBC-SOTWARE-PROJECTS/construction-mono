import { PayrollEmployeeStatus } from "@/graphql/gql/graphql";
import useUpdatePayrollModuleEmployeeStatus from "@/hooks/payroll/useUpdatePayrollModuleEmployeeStatus";
import { CheckOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import {
  Button,
  ButtonProps,
  Dropdown,
  Tooltip,
  TooltipProps,
  message,
} from "antd";

import { useMemo } from "react";

/**
 * Component for updating the status of Payroll Module Employee. Based on the payroll module employee
 * id passed and the payroll module passed.
 *
 * @component
 * @example
 * <PayrollEmployeeStatusAction
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
  tooltipProps: TooltipProps;
  refetch: () => void;
  value: any;
  module: string;
  id: string;
}
function PayrollEmployeeStatusAction({
  refetch,
  value,
  module,
  id,
  ...props
}: any) {
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
  const [updatePayrollModuleEmployeeStatus, { loading }] =
    useUpdatePayrollModuleEmployeeStatus(
      module,
      upsertCallback,
      onErrorCallback
    );

  const items = useMemo(() => {
    const updateEmployeeStatus = (status: string) => {
      updatePayrollModuleEmployeeStatus(id, status);
    };

    let items: any = [
      {
        key: PayrollEmployeeStatus.Draft,
        label: "Draft",
        onClick: () => updateEmployeeStatus(PayrollEmployeeStatus.Draft),
        disabled: value === PayrollEmployeeStatus.Draft,
        icon: <EditOutlined />,
      },
      {
        key: PayrollEmployeeStatus.Finalized,
        label: "Finalize",
        onClick: () => updateEmployeeStatus(PayrollEmployeeStatus.Finalized),
        disabled: value === PayrollEmployeeStatus.Finalized,
        icon: <CheckOutlined />,
      },
    ];

    return items;
  }, [value, updatePayrollModuleEmployeeStatus, id]);
  return (
    <>
      {value === "FINALIZED" && (
        <Tooltip title="Draft">
          <Button
            icon={<EditOutlined />}
            type="default"
            loading={loading}
            style={{ marginLeft: 5 }}
            onClick={() =>
              updatePayrollModuleEmployeeStatus(id, PayrollEmployeeStatus.Draft)
            }
          >
            {props?.children}
          </Button>
        </Tooltip>
      )}

      {value === "DRAFT" && (
        <Tooltip title="Finalize">
          <Button
            icon={<CheckOutlined />}
            type="primary"
            ghost
            loading={loading}
            style={{ marginLeft: 5 }}
            onClick={() =>
              updatePayrollModuleEmployeeStatus(
                id,
                PayrollEmployeeStatus.Finalized
              )
            }
          >
            {props?.children}
          </Button>
        </Tooltip>
      )}
    </>
  );
}

export default PayrollEmployeeStatusAction;
