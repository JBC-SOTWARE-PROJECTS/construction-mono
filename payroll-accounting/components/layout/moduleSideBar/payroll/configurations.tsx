import { MenuOutlined } from "@ant-design/icons";

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
        ],
      },
    ],
  },
  location: {
    pathname: "/",
  },
};

export default payrollConfigurationsMenu;
