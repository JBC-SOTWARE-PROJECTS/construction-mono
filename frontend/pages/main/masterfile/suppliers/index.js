import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const SupplierContent = dynamic(
  () => import("../../../../routes/main/Masterfile/supplier"),
  {
    loading: () => <CircularProgress />,
  }
);

const Supplier = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Supplier Masterfile</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_MASTERFILE"]}>
      <SupplierContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default Supplier;
