import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, Row, Col, Form, App } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { ProjectUpdates, Query } from "@/graphql/gql/graphql";
import { GET_RECORDS_PROJECT_ACCOMPLISHMENTS } from "@/graphql/inventory/project-queries";
import ProjectHeader from "@/components/inventory/project-details/common/projectHeader";
import { useRouter } from "next/router";
import _ from "lodash";
import UpsertAccomplishmentReport from "@/components/inventory/project-details/dialogs/upsertAccomplishments";
import AccomplishmentLists from "@/components/inventory/project-details/accomplishmentLists";

const { Search } = Input;

export default function AccomplishmentsContent() {
  const { message } = App.useApp();
  const modal = useDialog(UpsertAccomplishmentReport);
  const router = useRouter();
  const { query } = router;

  const [state, setState] = useState({
    filter: "",
    page: 0,
  });
  // ====================== queries =====================================
  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_PROJECT_ACCOMPLISHMENTS,
    {
      variables: {
        filter: state.filter,
        id: query?.id ?? null,
        page: state.page,
        size: 20,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const onUpsertRecord = (record?: ProjectUpdates) => {
    modal({ record: record, projectId: query?.id ?? null }, (result: any) => {
      if (result) {
        message.success(result);
        refetch();
      }
    });
  };

  return (
    <PageContainer
      className="project-details"
      pageHeaderRender={(e) => <ProjectHeader id={query?.id as string} />}>
      <ProCard
        title="Accomplishment Reports"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        size="small"
        extra={
          <ProFormGroup size="small">
            <Button
              size="small"
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onUpsertRecord()}>
              Add Accomplishment Report
            </Button>
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Search
                  size="middle"
                  placeholder="Search here.."
                  onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
                  className="w-full"
                />
              </Col>
            </Row>
          </Form>
        </div>
        <AccomplishmentLists
          dataSource={data?.pUpdatesByPage?.content as ProjectUpdates[]}
          loading={loading}
          totalElements={data?.pUpdatesByPage?.totalElements as number}
          handleOpen={(e) => onUpsertRecord(e)}
          handleChangePage={(e: number) =>
            setState((prev) => ({ ...prev, page: e }))
          }
        />
      </ProCard>
    </PageContainer>
  );
}
