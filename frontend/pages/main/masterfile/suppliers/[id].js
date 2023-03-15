import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";
import { useRouter } from "next/router";

const SupplierItemContent = dynamic(
  () => import("../../../../routes/main/Masterfile/supplieritem"),
  {
    loading: () => <CircularProgress />,
  }
);

const SupplierItem = ({ account }) => {
  const router = useRouter();
  let supId = router.query.id;

  return (
    <React.Fragment>
      <Head>
        <title>Construction IMS Supplier Items</title>
      </Head>
      <AccessManager roles={["ROLE_ADMIN", "ROLE_INVENTORY_MASTERFILE"]}>
        <SupplierItemContent account={account} id={supId} />
      </AccessManager>
    </React.Fragment>
  );
};

export default SupplierItem;
