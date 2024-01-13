export let apiUrlPrefix = "";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  apiUrlPrefix = "http://192.168.2.157:5827";
} else {
  if (process.browser) {
    apiUrlPrefix = "https://api-demo.megaptk.com"
  } else {
    apiUrlPrefix = "https://api-demo.megaptk.com";
  }
}
