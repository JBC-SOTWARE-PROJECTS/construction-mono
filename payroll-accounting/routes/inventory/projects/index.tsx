import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, Row, Col, Form, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { FormSelect } from "@/components/common";
import ProjectList from "@/components/inventory/projects/projectItemList";
import { useDialog } from "@/hooks";
import UpsertSupplierModal from "@/components/inventory/masterfile/supplier/dialogs/upsertSupplier";
import { useQuery } from "@apollo/client";
import { Projects, Query } from "@/graphql/gql/graphql";
import { GET_PROJECTS_RECORDS } from "@/graphql/inventory/project-queries";
import { useOffices } from "@/hooks/payables";
import { useClients, useProjectStatus } from "@/hooks/inventory";

const { Search } = Input;

export default function ProjectComponent() {
  const modal = useDialog(UpsertSupplierModal);

  const [customer, setCustomer] = useState(null);
  const [location, setLocation] = useState(null);
  const [state, setState] = useState({
    filter: "",
    status: null,
    page: 0,
    size: 10,
  });
  // ====================== queries =====================================
  const offices = useOffices();
  const clients = useClients();
  const statusList = useProjectStatus();

  const { data, loading, refetch } = useQuery<Query>(GET_PROJECTS_RECORDS, {
    variables: {
      filter: state.filter,
      customer: customer,
      location: location,
      status: state.status,
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "cache-and-network",
  });

  const onUpsertRecord = (record?: Projects) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success("Project successfully updated");
        } else {
          message.success("Project successfully added");
        }
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Projects"
      content="Task Tracker: Easy Project Management for Productive Teams.">
      <ProCard
        title="Project List"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => console.log()}>
              Create New Project
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
                  onSearch={(e) => console.log()}
                  className="w-full"
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter By Client"
                  propsselect={{
                    showSearch: true,
                    options: clients,
                    allowClear: true,
                    placeholder: "Filter By Client",
                    onChange: (newValue) => {
                      setCustomer(newValue);
                    },
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter By Status"
                  propsselect={{
                    showSearch: true,
                    mode: "multiple",
                    options: statusList,
                    allowClear: true,
                    placeholder: "Filter By Status",
                    onChange: (newValue) => {
                      setState((prev) => ({
                        ...prev,
                        status: newValue ?? null,
                      }));
                    },
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter By Location"
                  propsselect={{
                    showSearch: true,
                    options: offices,
                    allowClear: true,
                    placeholder: "Filter By Location",
                    onChange: (newValue) => {
                      setLocation(newValue);
                    },
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <ProjectList
          dataSource={data?.projectListPageable?.content as Projects[]}
          loading={loading}
          totalElements={data?.projectListPageable?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
