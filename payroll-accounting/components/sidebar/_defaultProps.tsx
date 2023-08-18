import { MenuOutlined } from "@ant-design/icons";

const defaultProps = {
  route: {
    path: "/",
    routes: [
      {
        path: "/",
        name: "Main Menu",
        icon: <MenuOutlined />,
      },
    ],
  },
  location: {
    pathname: "/",
  },
};

export default defaultProps;
