import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: "#399B53",
  },
  components: {
    Input: {
      fontSize: 14,
    },
    Segmented: {
       itemSelectedColor: "white",
    },
    Button: {
      colorPrimary: "#399B53",
    },
  },
};

export default theme;
