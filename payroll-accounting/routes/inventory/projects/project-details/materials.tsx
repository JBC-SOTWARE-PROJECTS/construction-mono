import React, { useState } from "react";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { Input, Row, Col, Statistic } from "antd";
import { useQuery } from "@apollo/client";
import { ProjectUpdatesMaterials, Query } from "@/graphql/gql/graphql";
import { GET_MATERIAL_USED_BY_PROJECT } from "@/graphql/inventory/project-queries";
import ProjectHeader from "@/components/inventory/project-details/common/projectHeader";
import { useRouter } from "next/router";
import _ from "lodash";
import { formatter } from "@/components/accounting/billing/component/billingHeader";
import MaterialsUsedTable from "@/components/inventory/project-details/materialsUsedTable";
import { responsiveColumn18, responsiveColumn4 } from "@/utility/constant";
import { getTotalMaterials } from "@/hooks/projects";

const { Search } = Input;

export default function MaterialsUsedContent() {
  const router = useRouter();
  const { query } = router;

  const [state, setState] = useState({
    filter: "",
    page: 0,
  });
  // ====================== queries =====================================
  const totaMaterials = getTotalMaterials((query?.id as string) ?? null);
  const { data, loading } = useQuery<Query>(GET_MATERIAL_USED_BY_PROJECT, {
    variables: {
      filter: state.filter,
      id: query?.id ?? null,
      page: state.page,
      size: 20,
    },
    fetchPolicy: "cache-and-network",
  });

  return (
    <PageContainer
      className="project-details"
      pageHeaderRender={(e) => <ProjectHeader id={query?.id as string} />}>
      <ProCard
        title="Materials Used"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        size="small">
        <Row gutter={[0, 8]}>
          <Col {...responsiveColumn18}>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
              className="w-full"
            />
          </Col>
          <Col {...responsiveColumn4}>
            <div className="w-full dev-right">
              <Statistic
                title="Total Materials Expenses"
                value={totaMaterials}
                formatter={(e) => {
                  let value = Number(e);
                  return formatter(value, "currency-red");
                }}
              />
            </div>
          </Col>
          <Col span={24}>
            <MaterialsUsedTable
              dataSource={
                data?.pMaterialByPage?.content as ProjectUpdatesMaterials[]
              }
              loading={loading}
              totalElements={data?.pMaterialByPage?.totalElements as number}
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
