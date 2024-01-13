import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Row, Col, Form, Button } from "antd";
import { Billing, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_OTC_RECORD } from "@/graphql/billing/queries";
import UpsertCompanyModal from "@/components/administrative/company/dialogs/upsertCompanyModal";
import { FormSwitch } from "@/components/common";
import { PlusCircleOutlined } from "@ant-design/icons";
import OTCTable from "@/components/accounting/billing/otcTable";
import { useRouter } from "next/router";

const { Search } = Input;

export default function OTCTransactionComponent() {
  const modal = useDialog(UpsertCompanyModal);
  const router = useRouter();
  const [active, setActive] = useState(true);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });

  const { data, loading } = useQuery<Query>(GET_OTC_RECORD, {
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

  const onUpsertRecord = () => {};

  return (
    <PageContainer
      title="Over the Counter (OTC) Transactions"
      content="Effortlessly manage and oversee your list of OTC records.">
      <ProCard
        title="OTC Transaction List"
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
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onUpsertRecord()}>
              New Customer
            </Button>
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
            <OTCTable
              dataSource={data?.billingOTCByFiltersPage?.content as Billing[]}
              loading={loading}
              totalElements={
                data?.billingOTCByFiltersPage?.totalElements as number
              }
              handleOpen={(record) =>
                router.push(`/accounting/otc/folio/${record?.id}`)
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
