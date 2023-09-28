import { PayrollModule } from "@/graphql/gql/graphql";
import useGetOnePayroll from "@/hooks/payroll/useGetOnePayroll";
import useMemoizedPayrollHeaderBreadcrumb, {
  payrollHeaderBreadcrumbRenderer,
} from "@/hooks/payroll/useMemoizedPayrollHeadBreadcrumb";
import { PageHeader } from "@ant-design/pro-components";
import { capitalize } from "lodash";
import React, { ReactElement } from "react";

interface IProps {
  extra: false | React.JSX.Element;
  module: PayrollModule;
}

function PayrollHeader({ extra, module }: IProps) {
  const [payroll] = useGetOnePayroll();

  const routes = useMemoizedPayrollHeaderBreadcrumb(
    `Payroll ${capitalize(module)}`,
    payroll?.title as string
  );
  return (
    <PageHeader
      breadcrumb={{
        routes,
        itemRender: payrollHeaderBreadcrumbRenderer,
      }}
      extra={extra as any}
    />
  );
}

export default PayrollHeader;
