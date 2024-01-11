export let apiUrlPrefix: string = "";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  apiUrlPrefix = "http://localhost:5827";
} else {
  if (typeof window) {
    demo = "https://api-demo.megaptk.com"
  } else {
    apiUrlPrefix = "https://api-prod.megaptk.com";
  }
}
