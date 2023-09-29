const payrollConfigurationsMenu = {
  route: {
    path: "/",
    routes: [
      {
        path: "/payroll/allowance-management",
        name: "Allowance Management",
        routes: [
          {
            path: "/payroll/allowance-management/allowance-type",
            name: "Allowance Type",
          },
          {
            path: "/payroll/allowance-management/allowance-package",
            name: "Allowance Package",
          },
        ],
      },
    ],
  },
  location: {
    pathname: "/",
  },
};

export default payrollConfigurationsMenu;
