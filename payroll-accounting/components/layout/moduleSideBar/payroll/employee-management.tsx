const payrollConfigurationsMenu = {
  route: {
    path: "/",
    routes: [
      {
        path: "/payroll/employee-management",
        name: "Configurations",
        routes: [
          {
            path: "/payroll/employee-management/work-schedule",
            name: "Work Schedule",
          },
          {
            path: "/payroll/employee-management/attendance",
            name: "Attendance",
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
