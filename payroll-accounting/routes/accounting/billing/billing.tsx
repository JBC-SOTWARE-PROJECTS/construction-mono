import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Row, Col, Form } from "antd";
import BillingTable from "@/components/accounting/billing/billingTable";
import { Billing, Query } from "@/graphql/gql/graphql";
import { useQuery } from "@apollo/client";
import { GET_BILLING_RECORDS } from "@/graphql/billing/queries";
import { FormSwitch } from "@/components/common";
import { useRouter } from "next/router";

const { Search } = Input;

export default function BillingComponent() {
  const router = useRouter();
  const [active, setActive] = useState(true);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });

  const { data, loading } = useQuery<Query>(GET_BILLING_RECORDS, {
    variables: {
      filter: state.filter,
      status: active,
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "cache-and-network",
  });

  const onChangeBillingStatus = (e: boolean) => {
    setActive(e);
  };

  return (
    <PageContainer
      title="Billing Portfolio Control Center"
      content="Effortlessly manage and oversee your list of billing records.">
      <ProCard
        title="Billing Folio List"
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
              <div className="w-full dev-right">
                <FormSwitch
                  label="Show only active Billing Folios"
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
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <BillingTable
              dataSource={
                data?.billingByFiltersPageProjects?.content as Billing[]
              }
              loading={loading}
              totalElements={
                data?.billingByFiltersPageProjects?.totalElements as number
              }
              handleOpen={(record) =>
                router.push(`/accounting/billing/folio/${record?.id}`)
              }
              changePage={(page) =>
                setState((prev) => ({ ...prev, page: page }))
              }
            />
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
}
