import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";

const PositionContent = dynamic(
  () => import("../../../../routes/admin/Position"),
  {
    loading: () => <CircularProgress />,
  }
);

const Position = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Position</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN"]}>
      <div className="gx-main-content-wrapper-full-width">
        <PositionContent account={account} />
      </div>
    </AccessManager>
  </React.Fragment>
);

export default Position;
