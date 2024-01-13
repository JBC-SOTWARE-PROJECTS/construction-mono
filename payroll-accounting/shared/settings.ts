export let apiUrlPrefix: string = "";
export let frontEndUrl: string = "";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  apiUrlPrefix = "http://localhost:5827";
  frontEndUrl = "http://localhost:6060";
} else {
  if (typeof window) {
    apiUrlPrefix = "https://api-demo.megaptk.com";
    frontEndUrl = "https://inventory.megaptk.com";
  } else {
    apiUrlPrefix = "https://api-prod.megaptk.com";
    frontEndUrl = "https://inventory.megaptk.com";
  }
}
