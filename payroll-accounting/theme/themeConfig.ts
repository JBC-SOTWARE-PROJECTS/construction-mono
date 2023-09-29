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
      itemSelectedBg: "#399B53",
    },
    Button: {
      colorPrimary: "#399B53",
    },
  },
};

export default theme;
