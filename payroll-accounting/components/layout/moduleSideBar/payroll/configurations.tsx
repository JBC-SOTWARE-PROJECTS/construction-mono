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
        ],
      },
    ],
  },
  location: {
    pathname: "/",
  },
};

export default payrollConfigurationsMenu;
