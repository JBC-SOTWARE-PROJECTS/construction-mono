import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import CircularProgress from "../../../../app/components/CircularProgress";
import AccessManager from "../../../../app/components/accessControl/AccessManager";
import { useRouter } from "next/router";

const ProjectContentDetails = dynamic(
  () => import("../../../../routes/billing/projectDetails"),
  {
    loading: () => <CircularProgress />,
  }
);

const ProjectDetails = ({ account }) => {
  const router = useRouter();
  const projectId = router.query.id;
  return (
    <React.Fragment>
      <Head>
        <title>Construction IMS Project Details</title>
      </Head>
      <AccessManager roles={["ROLE_PROJECTS", "ROLE_ADMIN"]}>
        <ProjectContentDetails account={account} id={projectId} />
      </AccessManager>
    </React.Fragment>
  );
};

export default ProjectDetails;
