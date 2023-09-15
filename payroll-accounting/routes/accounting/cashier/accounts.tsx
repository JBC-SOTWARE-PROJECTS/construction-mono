import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Row, Col, Form, Statistic } from "antd";
import CashierTable from "@/components/accounting/cashier/cashierTable";
import { Billing, Query } from "@/graphql/gql/graphql";
import { useQuery } from "@apollo/client";
import { GET_ACCOUNTS_FOLIO_RECORD } from "@/graphql/cashier/queries";
import { FormSwitch } from "@/components/common";
import { col2, currency } from "@/utility/constant";
import _ from "lodash";
import { NumberFormater } from "@/utility/helper";

const { Search } = Input;

const formatter = (value: number) => (
  <p className="currency-red">
    {currency + " "}
    {NumberFormater(value)}
  </p>
);

export default function CashierComponent() {
  const [active, setActive] = useState(true);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });

  const { data, loading } = useQuery<Query>(GET_ACCOUNTS_FOLIO_RECORD, {
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
      title="Financial Point of Service (Cashier)"
      content="Provide a reliable point of service for monetary interactions."
    >
      <ProCard
        title="Account Folio's List"
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
        }
      >
        <Form layout="horizontal" className="filter-form">
          <Row gutter={[8, 8]}>
            <Col {...col2}>
              <Statistic
                title="Total Collectibles Amount"
                value={Number(data?.totalBalances)}
                formatter={(e) => {
                  let value = Number(e);
                  return formatter(value);
                }}
              />
            </Col>
            <Col {...col2}>
              <div className="w-full h-full dev-right items-center">
                <FormSwitch
                  label="Show only active Account Folios"
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
              <CashierTable
                dataSource={data?.billingAllByFiltersPage?.content as Billing[]}
                loading={loading}
                totalElements={
                  data?.billingAllByFiltersPage?.totalElements as number
                }
                handleOpen={(record) => console.log(record)}
                changePage={(page) =>
                  setState((prev) => ({ ...prev, page: page }))
                }
              />
            </Col>
          </Row>
        </div>
      </ProCard>
    </PageContainer>
  );
}
