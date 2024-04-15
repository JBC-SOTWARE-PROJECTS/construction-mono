import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Row, Col, Form, Button, Input } from "antd";
import { GET_AP_BEGINNING_BALANCE } from "@/graphql/payables/queries";
import { useQuery } from "@apollo/client";
import { ApBeginningBalanceDto, Query } from "@/graphql/gql/graphql";
import { AP_STATUS } from "@/utility/constant";
import _ from "lodash";
import { DownloadOutlined } from "@ant-design/icons";
import { FormSelect } from "@/components/common";
import { useSupplierTypes } from "@/hooks/payables";
import BeginningBalanceTable from "@/components/accounting/payables/config/beginningBalanceTable";
import { getUrlPrefix } from "@/utility/graphql-client";


const { Search } = Input;

export default function AgingLedgerComponent() {
  const [items, setItems] = useState<ApBeginningBalanceDto[]>([]);
  const [type, setType] = useState<string | null>();
  const [posted, setPosted] = useState<boolean | null>(true);
  const [filter, setFilter] = useState<string>("");

  //============================ queries ===============================
  const supplierTypes = useSupplierTypes();
  const { loading } = useQuery<Query>(GET_AP_BEGINNING_BALANCE, {
    variables: {
      filter: filter,
      types: type,
      status: posted,
    },
    onCompleted: (data) => {
      const result = data?.apBeginningBalance as ApBeginningBalanceDto[];
      setItems(result);
    },
  });
  // =========================== functions ==============================
  const onSelectSupplierType = (e: string | null) => {
    setType(e);
  };

  const onChangeStatus = (e: string) => {
    let result = null;
    if (e === "true") {
      result = true;
    } else if (e === "false") {
      result = false;
    }
    setPosted(result);
  };

  const onValidateValue = (e: boolean | null): string => {
    let result = "null";
    if (e !== null) {
      if (e) {
        result = "true";
      } else {
        result = "false";
      }
    }
    return result;
  };

  const downloadCsv = () => {
    if (posted == null) {
      window.open(
        getUrlPrefix() +
          "/reports/ap/print/apBeginningBalance/csv?filter=" +
          filter +
          "&supplierTypes=" +
          type +
          "&posted="
      );
    } else {
      window.open(
        getUrlPrefix() +
          "/reports/ap/print/apBeginningBalance/csv?filter=" +
          filter +
          "&supplierTypes=" +
          type +
          "&posted=" +
          posted
      );
    }
  };

  return (
    <PageContainer title="Beginning Balance">
      <ProCard
        title="Vendors/Supplier Beginning Balance"
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
              onSearch={(e) => setFilter(e)}
              className="select-header"
            />
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={downloadCsv}>
              Download Report
            </Button>
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={12}>
                <FormSelect
                  label="Filter Supplier Category"
                  propsselect={{
                    options: supplierTypes,
                    allowClear: true,
                    placeholder: "Select Supplier Types",
                    onChange: (newValue) => {
                      onSelectSupplierType(newValue);
                    },
                  }}
                />
              </Col>
              <Col xs={24} md={12} lg={12}>
                <FormSelect
                  label="Filter Status"
                  propsselect={{
                    value: onValidateValue(posted),
                    options: AP_STATUS,
                    allowClear: true,
                    placeholder: "Filter Status",
                    onChange: (newValue) => {
                      onChangeStatus(newValue);
                    },
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <BeginningBalanceTable dataSource={items} loading={loading} />
      </ProCard>
    </PageContainer>
  );
}
