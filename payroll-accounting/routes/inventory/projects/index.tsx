import React from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { FormSelect } from "@/components/common";

const { Search } = Input;

export default function ProjectComponent() {
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
              Add Project
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
                    options: [],
                    allowClear: true,
                    placeholder: "Filter By Client",
                    // onChange: (newValue) => {
                    //   setGroupId(newValue);
                    //   setCategory([]);
                    // },
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter By Status"
                  propsselect={{
                    showSearch: true,
                    mode: "multiple",
                    options: [],
                    allowClear: true,
                    placeholder: "Filter By Status",
                    // onChange: (newValue) => {
                    //   setCategory(newValue);
                    // },
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter By Location"
                  propsselect={{
                    showSearch: true,
                    options: [],
                    allowClear: true,
                    placeholder: "Filter By Location",
                    // onChange: (newValue) => {
                    //   setState((prev) => ({ ...prev, brand: newValue }));
                    // },
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </ProCard>
    </PageContainer>
  );
}
