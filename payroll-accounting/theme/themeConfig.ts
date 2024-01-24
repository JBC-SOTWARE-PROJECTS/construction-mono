import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    fontSize: 14,
   // colorPrimary: "#399B53",
    colorPrimary: "#0e153d",
  },
  components: {
    Input: {
      fontSize: 14,
    },
    Segmented: {
      itemSelectedBg: "#fca311",
      //itemSelectedBg: "#399B53",
      // itemSelectedColor: "white",
    },
    Button: {
      colorPrimary: "#0e153d",
      //colorPrimary: "#399B53",
    },
  },
};

export default theme;
