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
import { ProjectProgress, Query } from "@/graphql/gql/graphql";
import { GET_RECORDS_PROJECT_PROGRESS } from "@/graphql/inventory/project-queries";
import ProjectHeader from "@/components/inventory/project-details/common/projectHeader";
import { useRouter } from "next/router";
import _ from "lodash";
import UpsertProgressReport from "@/components/inventory/project-details/dialogs/upsertProgress";
import ProgressLists from "@/components/inventory/project-details/progressLists";

const { Search } = Input;

export default function AccomplishmentsContent() {
  const { message } = App.useApp();
  const modal = useDialog(UpsertProgressReport);
  const router = useRouter();
  const { query } = router;

  const [state, setState] = useState({
    filter: "",
    page: 0,
  });
  // ====================== queries =====================================
  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_PROJECT_PROGRESS,
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

  const onUpsertRecord = (record?: ProjectProgress) => {
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
        title="Progress Reports"
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
              Add Progress Report
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
        <ProgressLists
          dataSource={data?.pProgressByPage?.content as ProjectProgress[]}
          loading={loading}
          totalElements={data?.pProgressByPage?.totalElements as number}
          handleOpen={(e) => onUpsertRecord(e)}
          handleChangePage={(e: number) =>
            setState((prev) => ({ ...prev, page: e }))
          }
        />
      </ProCard>
    </PageContainer>
  );
}
