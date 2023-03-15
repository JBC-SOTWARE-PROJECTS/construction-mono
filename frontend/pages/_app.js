import React from "react";
import Head from "next/head";
import withRedux from "next-redux-wrapper";
import "react-notifications/lib/notifications.css";
import "antd/dist/antd.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../public/vendors/style";
import "../styles/style.min.css";
import "../styles/custom.css";

import initStore from "../redux/store";
import { Provider } from "react-redux";
import LocaleProvider from "../app/core/LocaleProvider";
import { useRouter } from "next/router";
import { apolloClient } from "../shared/global";
import { ApolloProvider } from "@apollo/react-hooks";
import AuthManager from "../app/components/accessControl/AuthManager";

const Page = ({ Component, pageProps, store }) => {
  const router = useRouter();

  if (router.route === "/login" || router.route === "/checker")
    return (
      <React.Fragment>
        <Head>
          <title>Construction Inventory Management and Billing System</title>
        </Head>
        <Provider store={store}>
          <ApolloProvider client={apolloClient}>
            <LocaleProvider>
              <Component {...pageProps} />
            </LocaleProvider>
          </ApolloProvider>
        </Provider>
      </React.Fragment>
    );

  return (
    <React.Fragment>
      <Head>
        <title>Construction Inventory Management and Billing System</title>
      </Head>

      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <LocaleProvider>
            <AuthManager>
              <Component {...pageProps} />
            </AuthManager>
          </LocaleProvider>
        </ApolloProvider>
      </Provider>
    </React.Fragment>
  );
};

export default withRedux(initStore)(Page);

Page.getInitialProps = async ({ Component, ctx }) => {
  return {
    pageProps: {
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}),
    },
  };
};
