import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: "#ee9f27",
  },
  components: {
    Input: {
      fontSize: 14,
    },
    Segmented: {
      itemSelectedBg: "#fca311",
    },
    Button: {
      colorPrimary: "#dc6601" //darker orange
    },
  },
};

export default theme;