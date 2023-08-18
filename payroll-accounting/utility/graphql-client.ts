import { apiUrlPrefix } from "@/shared/settings";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import axios from "axios";
import _ from "lodash";

const httpLink = createHttpLink({
  uri: apiUrlPrefix + "/graphql",
  fetch: fetch,
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
    },
  };
});

const defaultOptions: any = {
  watchQuery: {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  },
  query: {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  },
  mutate: {
    errorPolicy: "all",
  },
};

export const getUrlPrefix = () => {
  return apiUrlPrefix;
};

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ networkError }) => {
  if (networkError) {
    const err: any = networkError;
    if (err.statusCode === 401) {
      const browser = typeof window === "undefined";
      if (!browser) {
        alert("Your sesssion has expired. You will be forced to logout");
        window.location.href = "/login";
      }
    }
  }
});

const defaultConfig = {
  withCredentials: true,
  crossDomain: true,
  headers: { "X-Requested-With": "XMLHttpRequest" },
  xsrfCookieName: "CSRF-TOKEN",
  xsrfHeaderName: "X-Csrf-Token",
};

export const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export let get = (path: any, config?: any, track = false) => {
  if (!config) config = {};

  config = _.assign({}, defaultConfig, config);

  config.track = track;

  return axios.get(apiUrlPrefix + path, config).then((response) => {
    return response.data;
  });
};

export let post = (path: any, body?: any, config?: any, track = true) => {
  if (!config) config = {};

  config = _.assign({}, defaultConfig, config);

  config.track = track;

  return axios.post(apiUrlPrefix + path, body || {}, config);
};

export let put = (path: any, body?: any, config?: any) => {
  if (!config) config = {};

  config = _.assign({}, defaultConfig, config);

  return axios.put(apiUrlPrefix + path, body || {}, config);
};

export let patch = (path: any, body?: any, config?: any, track = true) => {
  if (!config) config = {};

  config = _.assign({}, defaultConfig, config);
  config.track = track;

  return axios.patch(apiUrlPrefix + path, body || {}, config);
};

export let _delete = (path: any, config?: any) => {
  if (!config) config = {};

  config = _.assign({}, defaultConfig, config);

  return axios.delete(apiUrlPrefix + path, config);
};
