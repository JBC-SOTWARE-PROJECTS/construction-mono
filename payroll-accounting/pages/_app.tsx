import AuthManager from "@/components/accessControl/AuthManager";
import { client } from "@/utility/graphql-client";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

import "@/styles/globals.css";
import "@/styles/loader.css";
import 'react-virtualized/styles.css'
import "@/styles/virtualtable.css";
import TawkToChat from "@/components/thirdParty/tawkToSupport";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  if (router.route === "/login") {
    return (
      <React.Fragment>
        <Head>
          <title>DiverseTrade Suite</title>
        </Head>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Head>
          <title>DiverseTrade Suite</title>
        </Head>
        <ApolloProvider client={client}>
          <AuthManager>
            <Component {...pageProps} />
            {/* <TawkToChat/> */}
          </AuthManager>
        </ApolloProvider>
      </React.Fragment>
    );
  }
};

export default App;
