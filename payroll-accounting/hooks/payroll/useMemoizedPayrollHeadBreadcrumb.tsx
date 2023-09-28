import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

const useMemoizedPayrollHeaderBreadcrumb = (
  pageTitle: string,
  payrollTitle?: string
) => {
  const router = useRouter();

  // const hasOtherDeductionRole = useHasRole("PAYROLL_OTHER_DEDUCTION_USER");
  // const hastimekeepingRole = useHasRole("TIMEKEEPING_USER");
  // const hasallowanceRole = useHasRole("PAYROLL_DE_MINIMIS_USER");
  // const hasContributionsRole = useHasRole("PAYROLL_CONTRIBUTIONS_USER");
  // const hasAdjustmentRole = useHasRole("PAYROLL_ADJUSTMENT_USER");
  // const hasHazardPayRole = useHasRole("PAYROLL_HAZARD_PAY_USER");

  const hasOtherDeductionRole = true;
  const hastimekeepingRole = true;
  const hasLoansRole = true;
  const hasContributionsRole = true;
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
        title: "Payroll Timekeeping",
        path: `${basePath}/p-timekeeping`,
        disabled: pathname === `${basePathName}/p-timekeeping`,
        hasRole: hastimekeepingRole,
      },
      {
        key: `${basePath}/p-allowance`,
        title: "Payroll Allowance",
        path: `${basePath}/p-allowance`,
        disabled: pathname === `${basePathName}/p-allowance`,
        hasRole: hasallowanceRole,
      },
      {
        key: `${basePath}/p-other-deductions`,
        title: "Payroll Other Deduction",
        path: `${basePath}/p-other-deduction`,
        disabled: pathname === `${basePathName}/p-other-deduction`,
        hasRole: hasOtherDeductionRole,
      },
      // {
      //   key: `${basePath}/p-adjustments`,
      //   title: "Payroll Adjustments",
      //   path: `${basePath}/p-adjustments`,
      //   disabled: pathname === `${basePathName}/p-adjustments`,
      //   hasRole: hasAdjustmentRole,
      // },
      {
        key: `${basePath}/p-loans`,
        title: "Payroll Loans",
        path: `${basePath}/p-loans`,
        disabled: pathname === `${basePathName}/p-loans`,
        hasRole: hasLoansRole,
      },
      {
        key: `${basePath}/p-contributions`,
        title: "Payroll Contributions",
        path: `${basePath}/p-contributions`,
        disabled: pathname === `${basePathName}/p-contributions`,
        hasRole: hasContributionsRole,
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
