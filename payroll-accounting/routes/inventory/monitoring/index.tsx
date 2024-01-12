import React, { useContext, useState } from "react";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { Input, Row, Col, Form, App, message } from "antd";
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
import { AccountContext } from "@/components/accessControl/AccountContext";
import { useDialog } from "@/hooks";
import UpsertCriticalQty from "@/components/inventory/project-details/dialogs/upsertCriticalQty";
import { useOffices } from "@/hooks/payables";

const { Search } = Input;

export default function InventoryProjectMonitoringContent() {
  const { message } = App.useApp();
  const modal = useDialog(UpsertCriticalQty);
  const account = useContext(AccountContext);
  const [category, setCategory] = useState<string[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [officeId, setOfficeId] = useState<string | null>(
    account?.office?.id ?? null
  );
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
  const offices = useOffices();
  const { data, loading, refetch } = useQuery<Query>(
    GET_INVENTORY_BY_LOCATION,
    {
      variables: {
        filter: state.filter,
        office: officeId,
        group: groupId,
        category: category,
        brand: state.brand ?? "",
        page: state.page,
        size: state.size,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const onUpsertRecord = (record?: Inventory) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        message.success(result);
        refetch();
      }
    });
  };

  return (
    <PageContainer className="project-details">
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
                  <Col xs={24} sm={12} md={6}>
                    <FormSelect
                      label="Filter Location"
                      propsselect={{
                        showSearch: true,
                        value: officeId,
                        options: offices,
                        allowClear: true,
                        placeholder: "Select Location",
                        onChange: (newValue) => {
                          setOfficeId(newValue ?? null);
                        },
                      }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
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
                  <Col xs={24} sm={12} md={6}>
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
                  <Col xs={24} sm={12} md={6}>
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
              handleOpen={(e) => onUpsertRecord(e)}
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
