import { PayrollModule } from "@/graphql/gql/graphql";
import useGetOnePayroll from "@/hooks/payroll/useGetOnePayroll";
import useMemoizedPayrollHeaderBreadcrumb, {
  payrollHeaderBreadcrumbRenderer,
} from "@/hooks/payroll/useMemoizedPayrollHeadBreadcrumb";
import { getStatusColor } from "@/utility/helper";
import { PageHeader } from "@ant-design/pro-components";
import { Tag } from "antd";
import { capitalize } from "lodash";
import React, { ReactElement } from "react";

interface IProps {
  extra: false | React.JSX.Element;
  module: PayrollModule;
  showTitle?: boolean;
  status?: string;
}

function PayrollHeader({ extra, module, showTitle = false, status }: IProps) {
  const [payroll] = useGetOnePayroll();

  const routes = useMemoizedPayrollHeaderBreadcrumb(
    `${capitalize(module)}`,
    payroll?.title as string
  );
  return (
    <PageHeader
      title={
        showTitle && (
          <>
            {payroll?.title} {capitalize(module)}{" "}
            <Tag color={getStatusColor(status as string)}>{status}</Tag>
          </>
        )
      }
      breadcrumb={{
        routes,
        itemRender: payrollHeaderBreadcrumbRenderer,
      }}
      extra={extra as any}
    />
  );
}

export default PayrollHeader;
