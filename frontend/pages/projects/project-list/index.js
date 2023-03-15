import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../app/components/CircularProgress";
import AccessManager from "../../../app/components/accessControl/AccessManager";

const ProjectContent = dynamic(() => import("../../../routes/billing/projects"), {
  loading: () => <CircularProgress />,
});

const Projects = ({ account }) => (
  <React.Fragment>
    <Head>
      <title>Construction IMS Project List</title>
    </Head>
    <AccessManager roles={["ROLE_PROJECTS", "ROLE_ADMIN"]}>
      <ProjectContent account={account} />
    </AccessManager>
  </React.Fragment>
);

export default Projects;
