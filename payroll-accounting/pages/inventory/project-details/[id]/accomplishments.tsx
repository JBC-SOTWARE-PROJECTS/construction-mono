import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";

const AccomplishmentComponent = asyncComponent(
  () => import("@/routes/inventory/projects/project-details/accomplishments")
);

const ProjectsDetailsPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Project Accomplishments</title>
      </Head>
      <AccessManager
        roles={["ROLE_ADMIN", "ROLE_PROJECT_ACCOMPLISHMENT_REPORTS"]}>
        <div className="w-full">
          <AccomplishmentComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default ProjectsDetailsPage;
