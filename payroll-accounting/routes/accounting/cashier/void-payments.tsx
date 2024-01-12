import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Row, Col, Form } from "antd";
import { Query, Shift } from "@/graphql/gql/graphql";
import { useQuery } from "@apollo/client";
import { GET_SHIFTING_RECORDS } from "@/graphql/cashier/queries";
import { FormSwitch } from "@/components/common";
import _ from "lodash";
import VoidPaymentTable from "@/components/accounting/cashier/voidPaymentTable";

const { Search } = Input;

export default function VoidPaymentComponent() {
  const [active, setActive] = useState(true);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });

  const { data, loading } = useQuery<Query>(GET_SHIFTING_RECORDS, {
    variables: {
      filter: state.filter,
      status: active,
    },
    fetchPolicy: "cache-and-network",
  });

  const onChangeBillingStatus = (e: boolean) => {
    setActive(e);
  };

  const showModalList = (record: Shift) => {};

  return (
    <PageContainer
      title="Void Payments"
      content="Provide a reliable point of service for monetary interactions.">
      <ProCard
        title="Cashier Current Active Shift"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
              className="select-header-list"
            />
          </ProFormGroup>
        }>
        <Form layout="horizontal" className="filter-form">
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <div className="w-full h-full dev-right items-center">
                <FormSwitch
                  label="Show only active shift"
                  switchprops={{
                    checkedChildren: "Yes",
                    unCheckedChildren: "No",
                    checked: active,
                    onChange: onChangeBillingStatus,
                  }}
                />
              </div>
            </Col>
          </Row>
        </Form>
        <div className="w-full mt-2-5">
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <VoidPaymentTable
                dataSource={data?.activeShiftList as Shift[]}
                loading={loading}
                handleOpen={(record) => showModalList(record)}
              />
            </Col>
          </Row>
        </div>
      </ProCard>
    </PageContainer>
  );
}
