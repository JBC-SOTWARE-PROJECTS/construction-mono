import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: "#399B53",
    fontFamily: "'Lato', sans-serif",
  },
  components: {
    Input: {
      fontSize: 14,
    },
    Segmented: {
      itemSelectedBg: "#399B53",
    },
  },
};

export default theme;
