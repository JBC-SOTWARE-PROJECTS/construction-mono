export let apiUrlPrefix: string = "";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  apiUrlPrefix = "http://localhost:5827";
} else {
  if (typeof window) {
    apiUrlPrefix = "http://localhost:5827";
  } else {
    apiUrlPrefix = "http://localhost:5827";
  }
}
