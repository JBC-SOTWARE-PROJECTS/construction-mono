import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";

const ProjectDetailsComponent = asyncComponent(
  () => import("@/routes/inventory/projects/project-details/bill-quantities")
);

const ProjectsDetailsPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Project Management</title>
      </Head>
      <AccessManager roles={["ROLE_ADMIN", "ROLE_PROJECT_BILL_QUANTITIES"]}>
        <div className="w-full">
          <ProjectDetailsComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default ProjectsDetailsPage;
