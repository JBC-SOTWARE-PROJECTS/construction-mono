import { MenuOutlined } from "@ant-design/icons";

const payrollConfigurationsMenu = {
  route: {
    path: "/",
    routes: [
      {
        path: "/payroll/attendance",
        name: "Attendance",
        routes: [
          {
            path: "/payroll/attendance/upload-biometric",
            name: "Upload Biometric Data",
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
