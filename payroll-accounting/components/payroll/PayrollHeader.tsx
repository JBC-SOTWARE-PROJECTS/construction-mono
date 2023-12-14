import { PayrollModule, PayrollStatus } from "@/graphql/gql/graphql";
import useGetOnePayroll from "@/hooks/payroll/useGetOnePayroll";
import useMemoizedPayrollHeaderBreadcrumb, {
  payrollHeaderBreadcrumbRenderer,
} from "@/hooks/payroll/useMemoizedPayrollHeadBreadcrumb";
import { getStatusColor } from "@/utility/helper";
import { PageHeader } from "@ant-design/pro-components";
import { Divider, Tag } from "antd";
import { capitalize } from "lodash";
import React, { ReactElement } from "react";
import CustomButton from "../common/CustomButton";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { statusMap } from "@/utility/constant";

interface IProps {
  extra: false | React.JSX.Element;
  module: PayrollModule;
  showTitle?: boolean;
  status?: string;
  handleClickFinalize: any;
  loading: boolean;
}

function PayrollHeader({
  extra,
  module,
  showTitle = false,
  status,
  handleClickFinalize,
  loading,
}: IProps) {
  const [payroll] = useGetOnePayroll();

  const routes = useMemoizedPayrollHeaderBreadcrumb(
    `${capitalize(module.replace("_", " "))}`,
    payroll?.title as string
  );
  return (
    <>
      <PageHeader
        title={
          showTitle && (
            <>
              {payroll?.title} {capitalize(module.replace("_", " "))}{" "}
              <Tag color={getStatusColor(status as string)}>{status}</Tag>
            </>
          )
        }
        breadcrumb={{
          routes,
          itemRender: payrollHeaderBreadcrumbRenderer,
        }}
        extra={
          <>
            {extra}
            {payroll?.status === PayrollStatus.Active && (
              <CustomButton
                type="primary"
                icon={
                  status === "FINALIZED" ? <EditOutlined /> : <CheckOutlined />
                }
                onClick={handleClickFinalize}
                loading={loading}
              >
                Set as {statusMap[status as any]}
              </CustomButton>
            )}
          </>
        }
      />
      <Divider style={{ margin: "5px 0px 16px" }} />
    </>
  );
}

export default PayrollHeader;
