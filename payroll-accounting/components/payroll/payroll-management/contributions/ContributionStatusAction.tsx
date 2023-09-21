import { SettingOutlined } from "@ant-design/icons";
import { Button, Dropdown, message } from "antd";

import AccessControl from "@/components/accessControl/AccessControl";
import { gql, useMutation } from "@apollo/client";
import { useMemo } from "react";
export const ContributionTypes = {
  SSS: "SSS",
  PHIC: "PHIC",
  HDMF: "HDMF",
};

/**
 * Component for updating the status of SSS Contribution Status. Based on the contribution module employee ids
 *
 * @component
 * @example
 * <ContributionStatusAction
 *  id={id}
 *  value={employee?.status}
 *  buttonProps={{ type: 'primary', ghost: true }}
 *  refetch={refetch}
 *  allowedPermissions={contributionStatusActionsPermissions}
 *  record={record}
 * />
 *
 */
function ContributionStatusAction({
  buttonProps,
  refetch,
  record = {},
  id,
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

  const [updateContributionStatus, { loading }] = useMutation(
    gql`
      mutation ($contributionType: String, $id: UUID) {
        data: updateEmployeeContributionStatus(
          contributionType: $contributionType
          id: $id
        ) {
          success
          message
        }
      }
    `,
    {
      onCompleted: upsertCallback,
      onError: onErrorCallback,
    }
  );

  const items = useMemo(() => {
    const updateStatus = (contributionType: string) => {
      updateContributionStatus({
        variables: {
          id: id,
          contributionType: contributionType,
        },
      });
    };

    const { isActiveSSS, isActivePHIC, isActiveHDMF } = record;

    let items: any[] = [
      {
        key: ContributionTypes.SSS,
        label: `${isActiveSSS ? "Disable" : "Enable"} SSS Contributions`,
        onClick: () => updateStatus(ContributionTypes.SSS),
        danger: isActiveSSS,
      },
      {
        key: ContributionTypes.PHIC,
        label: `${isActivePHIC ? "Disable" : "Enable"} PHIC Contributions`,
        onClick: () => updateStatus(ContributionTypes.PHIC),
        danger: isActivePHIC,
      },
      {
        key: ContributionTypes.HDMF,
        label: `${isActiveHDMF ? "Disable" : "Enable"} HDMF Contributions`,
        onClick: () => updateStatus(ContributionTypes.HDMF),
        // className:
        //   styles[`payroll-employee-status-action-${ContributionTypes.HDMF}`],
        danger: isActiveHDMF,
      },
    ];

    return items;
  }, [record, updateContributionStatus, id]);

  return (
    <AccessControl
      allowedPermissions={["enable_or_disable_employee_contribution"]}
    >
      <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
        <Button
          shape="circle"
          type="primary"
          icon={<SettingOutlined />}
          {...buttonProps}
          loading={loading}
          style={{ marginLeft: 5 }}
          tooltipTitle={"Update Contribution Status"}
        />
      </Dropdown>
    </AccessControl>
  );
}

export default ContributionStatusAction;
