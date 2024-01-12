import React, { useState } from "react";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { Input, Row, Col, Form, Button, Space, App } from "antd";
import { Query, Shift } from "@/graphql/gql/graphql";
import { useMutation, useQuery } from "@apollo/client";
import {
  CLOSE_SHIFT,
  GET_SHIFTING_RECORDS,
  OPEN_SHIFT,
} from "@/graphql/cashier/queries";
import { FormSwitch } from "@/components/common";
import _ from "lodash";
import CollectionReportTable from "@/components/accounting/cashier/collectionReportTable";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDialog } from "@/hooks";
import UpsertShiftingRemarks from "@/components/accounting/cashier/dialog/upsertRemarks";

const { Search } = Input;

export default function CollectionReportComponent() {
  const { message } = App.useApp();
  const modal = useDialog(UpsertShiftingRemarks);
  const [active, setActive] = useState(true);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });

  const { data, loading, refetch } = useQuery<Query>(GET_SHIFTING_RECORDS, {
    variables: {
      filter: state.filter,
      status: active,
    },
    fetchPolicy: "cache-and-network",
  });

  const [openRecord, { loading: openLoading }] = useMutation(OPEN_SHIFT, {
    ignoreResults: false,
    onCompleted: (data) => {
      if (data?.addShift?.id) {
        message.success("Shift successfully created");
        refetch();
      } else {
        message.error(
          "Cannot Add another shifting record. Please contact administrator."
        );
      }
    },
  });

  const [closeRecord, { loading: closeLoading }] = useMutation(CLOSE_SHIFT, {
    ignoreResults: false,
    onCompleted: (data) => {
      if (data?.closeShift?.id) {
        message.success("Shift successfully closed");
        refetch();
      } else {
        message.error("Something went wrong. Please contact administrator.");
      }
    },
  });

  const onChangeBillingStatus = (e: boolean) => {
    setActive(e);
  };

  const openShift = () => {
    openRecord();
  };
  const closeShift = () => {
    closeRecord();
  };

  const upsertRemarks = (record: Shift) => {
    modal({ record: record }, (e: any) => {
      if (e) {
        message.success(e);
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Collection Report"
      content="Provide a reliable point of service for monetary interactions.">
      <ProCard
        title="Collection Report Lists"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <Space>
            <Button
              type="primary"
              danger
              icon={<PlusCircleOutlined />}
              onClick={() => closeShift()}>
              Close Current Active Shift
            </Button>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => openShift()}>
              Start New Shift
            </Button>
          </Space>
        }>
        <Form layout="horizontal" className="filter-form">
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Search
                size="middle"
                placeholder="Search here.."
                onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
              />
            </Col>
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
              <CollectionReportTable
                dataSource={data?.activeShiftList as Shift[]}
                loading={loading || openLoading || closeLoading}
                handlePrint={(record) => console.log(record)}
                handleRemarks={(record) => upsertRemarks(record)}
              />
            </Col>
          </Row>
        </div>
      </ProCard>
    </PageContainer>
  );
}
