import React from "react";
import asyncComponent from "@/utility/asyncComponent";
import Head from "next/head";
import AccessManager from "@/components/accessControl/AccessManager";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import ProjectHeader from "@/components/inventory/project-details/common/projectHeader";
import { useRouter } from "next/router";

const Component = asyncComponent(
  () => import("@/routes/inventory/purchases/purchase-order")
);

const ProjectsDetailsPage = () => {
  const router = useRouter();
  const { query } = router;
  return (
    <React.Fragment>
      <Head>
        <title>PROJECT PURCHASE ORDERS</title>
      </Head>
      <AccessManager roles={["ROLE_ADMIN", "ROLE_PROJECT_PROGRESS_REPORT"]}>
        <div className="w-full">
          <PageContainer
            className="project-details"
            pageHeaderRender={(e) => <ProjectHeader id={query?.id as string} />}
          >
            <ProCard
              title="Inventory Monitoring"
              headStyle={{
                flexWrap: "wrap",
              }}
              bordered
              headerBordered
              size="small"
            >
              <Component type="projects" forProjectDisplay={true} projectId={query?.id as string} />
            </ProCard>
          </PageContainer>
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default ProjectsDetailsPage;
