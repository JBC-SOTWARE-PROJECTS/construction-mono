import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const PaymentTermsComponent = asyncComponent(
  () =>
    import("@/routes/inventory/masterfile/other-configurations/payment-terms")
);

const PaymentTermsPage = () => {
  return <PaymentTermsComponent />;
};

export default PaymentTermsPage;
