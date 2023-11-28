import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import useHasRole from "../useHasRole";

const useMemoizedPayrollHeaderBreadcrumb = (
  pageTitle: string,
  payrollTitle?: string
) => {
  const router = useRouter();

  const hastimekeepingRole = true;
  const hasContributionsRole = useHasRole("PAYROLL_CONTRIBUTIONS_USER");
  const hasOtherDeductionRole = true;
  const hasLoansRole = true;
  const hasAdjustmentRole = true;
  const hasallowanceRole = true;
  const payrollId = router?.query?.id;
  const pathname = router.pathname;

  const calculateRoute = () => {
    const basePathName = "/payroll/payroll-management/[id]";
    const basePath = `/payroll/payroll-management/${payrollId}`;

    const menus = [
      {
        key: `${basePath}/p-timekeeping`,
        title: "Timekeeping",
        path: `${basePath}/p-timekeeping`,
        disabled: pathname === `${basePathName}/p-timekeeping`,
        hasRole: hastimekeepingRole,
      },
      {
        key: `${basePath}/p-allowance`,
        title: "Allowance",
        path: `${basePath}/p-allowance`,
        disabled: pathname === `${basePathName}/p-allowance`,
        hasRole: hasallowanceRole,
      },
      {
        key: `${basePath}/p-adjustments`,
        title: "Adjustments",
        path: `${basePath}/p-adjustments`,
        disabled: pathname === `${basePathName}/p-adjustments`,
        hasRole: hasAdjustmentRole,
      },
      {
        key: `${basePath}/p-loans`,
        title: "Loans",
        path: `${basePath}/p-loans`,
        disabled: pathname === `${basePathName}/p-loans`,
        hasRole: hasLoansRole,
      },
      {
        key: `${basePath}/p-contributions`,
        title: "Contributions",
        path: `${basePath}/p-contributions`,
        disabled: pathname === `${basePathName}/p-contributions`,
        hasRole: hasContributionsRole,
      },
      {
        key: `${basePath}/p-other-deductions`,
        title: "Other Deductions",
        path: `${basePath}/p-other-deductions`,
        disabled: pathname === `${basePathName}/p-other-deductions`,
        hasRole: hasOtherDeductionRole,
      },
    ];

    const items = menus
      .filter(({ hasRole }) => hasRole)
      .map(({ title: key, path, disabled }) => ({
        key,
        label: (
          <Link href={path} passHref legacyBehavior>
            <a>{key}</a>
          </Link>
        ),
        disabled,
      }));

    const routes = [
      {
        path: basePath,
        breadcrumbName: payrollTitle,
      },
      {
        path: "module",
        breadcrumbName: pageTitle,
        items,
      },
    ];
    return routes;
  };

  return useMemo(calculateRoute, [
    hasOtherDeductionRole,
    hastimekeepingRole,
    hasallowanceRole,
    hasContributionsRole,
    hasAdjustmentRole,
    payrollId,
    pathname,
    payrollTitle,
    pageTitle,
  ]);
};

export default useMemoizedPayrollHeaderBreadcrumb;

export const payrollHeaderBreadcrumbRenderer = (
  route: any,
  params: any,
  routes: any,
  paths: any
) => {
  const { items, breadcrumbName } = route;
  return route.path === "module" ? (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <span style={{ cursor: "pointer" }}>
        {breadcrumbName}
        <span style={{ marginLeft: 5 }}>
          <DownOutlined />
        </span>
      </span>
    </Dropdown>
  ) : (
    <Link href={`/${paths.join("/")}`} passHref legacyBehavior>
      <a>{route.breadcrumbName}</a>
    </Link>
  );
};
