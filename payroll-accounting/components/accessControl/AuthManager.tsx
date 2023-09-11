import React from "react";
import _ from "lodash";
import {
  AccountConsumer,
  AccountProvider,
  NULLACCOUNT,
} from "./AccountContext";
import { GET_ACCOUNT } from "@/graphql/AuthQuery";
import { IUserEmployee } from "../../utility/interfaces";
import { useQuery } from "@apollo/client";
import CircularProgress from "../circularProgress";
import dynamic from "next/dynamic";
import Custom403 from "@/pages/403";
import { ModalProvider } from "react-modal-hook";

const DiverseTradeLayout = dynamic(() => import("../layout"), {
  ssr: false,
});

const AuthManager = (props: any) => {
  const { loading, error, data } = useQuery(GET_ACCOUNT);

  const blank = <CircularProgress />;

  if (error) {
    const err: any = error.networkError;
    if (err && err.statusCode === 403) {
      return (
        <>
          <Custom403 />
        </>
      );
    }
    if (err && err.statusCode === 401) {
      window.location.href = "/login";
    }
  }

  if (!data || loading) {
    return blank;
  }

  return (
    <AccountProvider value={_.get(data, "account", NULLACCOUNT)}>
      <AccountConsumer>
        {(value: IUserEmployee) => {
          const childrenWithProps = React.Children.map(
            props.children,
            (child) =>
              React.cloneElement(child, { account: value || NULLACCOUNT })
          );
          return (
            <ModalProvider>
              <DiverseTradeLayout account={value}>
                {childrenWithProps}
              </DiverseTradeLayout>
            </ModalProvider>
          );
        }}
      </AccountConsumer>
    </AccountProvider>
  );
};

export default AuthManager;
