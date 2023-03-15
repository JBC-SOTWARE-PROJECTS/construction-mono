export let apiUrlPrefix = "";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  apiUrlPrefix = "http://localhost:5827";
} else {
  if (process.browser) {
    apiUrlPrefix = "https://api-construction.devcraftstudio.online";
  } else {
    apiUrlPrefix = "https://api-construction.devcraftstudio.online";
  }
}
