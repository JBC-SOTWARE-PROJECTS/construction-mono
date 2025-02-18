import { Col } from "antd";
import React from "react";
import { TerminalWindowsPayor } from "../../../../data-types/interfaces";
import PayorFolioDetails from "./details/folio";

export interface PaymentRoute {
  "payor-type": string;
  "payment-type": string;
}

const TerminalWindowPayor = React.memo((props: TerminalWindowsPayor) => {
  console.log("Payor window ...");

  const getPayorDetails: React.FC<TerminalWindowsPayor> = (params) => {
    let payorType = params.payorType;
    let paymentType = params.paymentType;
    switch (payorType) {
      case "FOLIO":
        return (
          <PayorFolioDetails
            {...{
              ...params.billing,
              paymentType,
              payorType,
              randomGender: props.randomGender,
              dispatch: props.dispatch,
              id: params?.id,
              // ...query,
            }}
          />
        );
        break;
      case "WALK-IN":
        return (
          <PayorFolioDetails
            {...{
              ...params.billing,
              paymentType,
              payorType,
              randomGender: props.randomGender,
              dispatch: props.dispatch,
              // ...query,
            }}
          />
        );
        break;

      default:
        return <></>;
        break;
    }
  };

  return <Col span={24}>{getPayorDetails(props)}</Col>;
});

TerminalWindowPayor.displayName = "TerminalWindowPayor";

export default TerminalWindowPayor;
