import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import AccessManager from "@/components/accessControl/AccessManager";
import CircularProgress from "@/components/circularProgress";
import { IPageProps } from "@/utility/interfaces";

const AdjustmentCategory = dynamic(
  () => import("@/routes/payroll/configurations/adjustment-category"),
  {
    loading: () => <CircularProgress />,
  }
);

const AdjustmentCategoryPage = ({ account }: IPageProps) => (
  <React.Fragment>
    <Head>
      <title>Adjustment Category Management</title>
    </Head>
    <AccessManager roles={["ROLE_ADMIN", "MANAGE_ADJUSMENT_CATEGORY_TYPES"]}>
      <div className="gx-main-content-wrapper-full-width">
        <AdjustmentCategory />
      </div>
    </AccessManager>
  </React.Fragment>
);

export default AdjustmentCategoryPage;
