import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";

const ProjectDetailsComponent = asyncComponent(
  () => import("@/routes/inventory/projects/project-details/project-expense")
);

const ProjectsDetailsPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Project Expense</title>
      </Head>
      <AccessManager roles={["ROLE_ADMIN"]}>
        <div className="w-full">
          <ProjectDetailsComponent />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default ProjectsDetailsPage;
