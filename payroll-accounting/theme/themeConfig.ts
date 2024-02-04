import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    fontSize: 14,
   // colorPrimary: "#399B53",
    colorPrimary: "#ee9f27",
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
      colorPrimary: "#dc6601" //darker orange
     // colorPrimary: "#ee9f27", //logo orange
      //colorPrimary: "#0e153d",
      //colorPrimary: "#399B53",
    },
  },
};

export default theme;
