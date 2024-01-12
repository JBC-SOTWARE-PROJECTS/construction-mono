import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, Row, Col, Form, App, Statistic } from "antd";
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
import { formatter } from "@/components/accounting/billing/component/billingHeader";
import MaterialsUsedTable from "@/components/inventory/project-details/materialsUsedTable";

const { Search } = Input;

export default function MaterialsUsedContent() {
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
        title="Project Expenses"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        size="small">
        <Row gutter={[0, 8]}>
          <Col span={24}>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
              className="w-full"
            />
          </Col>
          <Col span={24}>
            <div className="w-full dev-right">
              <Statistic
                title="Total Materials Expenses"
                value={1}
                formatter={(e) => {
                  let value = Number(e);
                  return formatter(value, "currency-red");
                }}
              />
            </div>
            <MaterialsUsedTable
              dataSource={[]}
              loading={loading}
              totalElements={0}
              handleChangePage={(e: number) =>
                setState((prev) => ({ ...prev, page: e }))
              }
            />
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
}
