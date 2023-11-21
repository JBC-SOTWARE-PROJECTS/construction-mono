const payrollConfigurationsMenu = {
  route: {
    path: "/",
    routes: [
      {
        path: "/payroll/configurations",
        name: "Configurations",
        routes: [
          {
            path: "/payroll/configurations/schedule-types",
            name: "Work Schedule",
          },
          {
            path: "/payroll/configurations/salary-rate-config",
            name: "Salary Rate",
          },
          {
            path: "/payroll/configurations/contribution/contribution-management",
            name: "Contribtion Management",
          },
          {
            path: "/payroll/configurations/events-holiday",
            name: "Holiday & Events",
          },
          {
            path: "/payroll/configurations/adjustment-category",
            name: "Adjustment Category",
          },
          {
            path: "/payroll/configurations/other-deduction-types",
            name: "Deduction Types",
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
