import React, { useContext, useState } from "react";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { Input, Row, Col, Form } from "antd";
import { useQuery } from "@apollo/client";
import { Inventory, Query } from "@/graphql/gql/graphql";
import { GET_INVENTORY_BY_LOCATION } from "@/graphql/inventory/inventory-queries";
import ProjectHeader from "@/components/inventory/project-details/common/projectHeader";
import { useRouter } from "next/router";
import _ from "lodash";
import { FormSelect } from "@/components/common";
import {
  useItemBrands,
  useItemCategory,
  useItemGroups,
} from "@/hooks/inventory";
import ProjectInventoryMonitoringTable from "@/components/inventory/project-details/projectInventoryTable";
import { AppContext } from "@/components/accessControl/AppContext";

const { Search } = Input;

export default function AccomplishmentsContent() {
  const router = useRouter();
  const { query } = router;
  const { projectInfo } = useContext(AppContext);
  const [category, setCategory] = useState<string[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [state, setState] = useState({
    filter: "",
    brand: null,
    status: true,
    page: 0,
    size: 10,
  });
  // ====================== queries =====================================
  const groups = useItemGroups();
  const categories = useItemCategory({ groupId: groupId });
  const brands = useItemBrands();
  const { data, loading, refetch } = useQuery<Query>(
    GET_INVENTORY_BY_LOCATION,
    {
      variables: {
        filter: state.filter,
        office: projectInfo?.location?.id ?? null,
        group: groupId,
        category: category,
        brand: state.brand ?? "",
        page: state.page,
        size: state.size,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  return (
    <PageContainer
      className="project-details"
      pageHeaderRender={(e) => <ProjectHeader id={query?.id as string} />}>
      <ProCard
        title="Inventory Monitoring"
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
            <div className="w-full mb-5">
              <Form layout="vertical" className="filter-form">
                <Row gutter={[8, 0]}>
                  <Col xs={24} sm={12} md={8}>
                    <FormSelect
                      label="Filter Item Group"
                      propsselect={{
                        showSearch: true,
                        value: groupId,
                        options: groups,
                        allowClear: true,
                        placeholder: "Select Item Group",
                        onChange: (newValue) => {
                          setGroupId(newValue);
                          setCategory([]);
                        },
                      }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <FormSelect
                      label="Filter Item Category"
                      propsselect={{
                        showSearch: true,
                        mode: "multiple",
                        value: category,
                        options: categories,
                        allowClear: true,
                        placeholder: "Select Item Category",
                        onChange: (newValue) => {
                          setCategory(newValue);
                        },
                      }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <FormSelect
                      label="Filter Item Brand"
                      propsselect={{
                        showSearch: true,
                        value: state.brand,
                        options: brands,
                        allowClear: true,
                        placeholder: "Select Item Brand",
                        onChange: (newValue) => {
                          setState((prev) => ({ ...prev, brand: newValue }));
                        },
                      }}
                    />
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
          <Col span={24}>
            <ProjectInventoryMonitoringTable
              dataSource={
                data?.inventoryListPageableByDep?.content as Inventory[]
              }
              loading={loading}
              totalElements={
                data?.inventoryListPageableByDep?.totalElements as number
              }
              handleOpen={(e) => console.log(e)}
              changePage={(e: number) =>
                setState((prev) => ({ ...prev, page: e }))
              }
            />
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
}
