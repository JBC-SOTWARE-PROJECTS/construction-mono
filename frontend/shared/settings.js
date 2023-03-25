export let apiUrlPrefix = "";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  apiUrlPrefix = "http://localhost:5827";
} else {
  if (process.browser) {
    apiUrlPrefix = "https://api-demo.devcraftstudio.online";
  } else {
    apiUrlPrefix = "https://api-demo.devcraftstudio.online";
  }
}
