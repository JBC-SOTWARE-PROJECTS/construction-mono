import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const ViewBilling = dynamic(
  () => import("../../../routes/billing/viewbilling"),
  {
    loading: () => <CircularProgress />,
  }
);

const BillingView = ({ account }) => {
  const router = useRouter();
  const billId = router.query.id;

  return (
    <React.Fragment>
      <Head>
        <title>Construction IMS Billing Accounts</title>
      </Head>
      <AccessManager roles={["ROLE_BILLING", "ROLE_ADMIN"]}>
        <ViewBilling account={account} id={billId} type="PROJECT" />
      </AccessManager>
    </React.Fragment>
  );
};

export default BillingView;
