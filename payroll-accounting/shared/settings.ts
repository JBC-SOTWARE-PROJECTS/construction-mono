export let softwareName: string = "DiverseTrade";
export let systemTagline: string = "Business Solutions Systems";
export let apiUrlPrefix: string = "";
export let frontEndUrl: string = "";
export let currencyDisplay: string = "₱";


if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  apiUrlPrefix = "http://localhost:5827";
  frontEndUrl = "http://localhost:6060";
} else {
  if (typeof window) {
    apiUrlPrefix = "https://api-demo.megaptk.com";
   // frontEndUrl = "https://inventory.megaptk.com"; //PROD
    frontEndUrl = "https://inventory-demo.syncprosolutions.com"; // DEMO
  } else {
    apiUrlPrefix = "https://api-demo.megaptk.com";
   // frontEndUrl = "https://inventory.megaptk.com"; //PROD
    frontEndUrl = "https://inventory-demo.syncprosolutions.com"; //DEMO
  }
}
