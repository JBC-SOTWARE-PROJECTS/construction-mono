import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Row, Col, Form, Button, DatePickerProps } from "antd";
import { useQuery } from "@apollo/client";
import { ApAgingSummaryDto, Query } from "@/graphql/gql/graphql";
import { AP_STATUS, dateFormat } from "@/utility/constant";
import _ from "lodash";
import dayjs, { Dayjs } from "dayjs";
import { stringStartDate } from "@/utility/helper";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import { FormSelect, FormDatePicker } from "@/components/common";
import { useSupplierTypes } from "@/hooks/payables";
import { GET_AGING_SUMMARY_RECORDS } from "@/graphql/payables/config-queries";
import AgingSummaryTable from "@/components/accounting/payables/config/agingSummaryTable";

export default function AgingLedgerComponent() {
  const [items, setItems] = useState<ApAgingSummaryDto[]>([]);
  const [type, setType] = useState<string | null>();
  const [posted, setPosted] = useState<boolean | null>(true);
  const [filterDates, setFilterDates] = useState<Dayjs>(dayjs());

  //============================ queries ===============================
  const supplierTypes = useSupplierTypes();
  const { loading } = useQuery<Query>(GET_AGING_SUMMARY_RECORDS, {
    variables: {
      filter: stringStartDate(filterDates),
      supplierTypes: type,
      posted: posted,
    },
    onCompleted: (data) => {
      const result = data?.apAgingSummary as ApAgingSummaryDto[];
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

  const onChangeDate: DatePickerProps["onChange"] = (date) => {
    if (date) {
      const start = dayjs(date, dateFormat);
      setFilterDates(start);
    }
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

  return (
    <PageContainer title="AP Aging Summary Report">
      <ProCard
        title="Aging Summary"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => console.log("")}>
              Download Report
            </Button>
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={() => console.log("")}>
              Print Report
            </Button>
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={8}>
                <FormDatePicker
                  label="Filter Date"
                  propsdatepicker={{
                    allowClear: false,
                    value: filterDates,
                    onChange: onChangeDate,
                  }}
                />
              </Col>
              <Col xs={24} md={12} lg={8}>
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
              <Col xs={24} md={12} lg={8}>
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
        <AgingSummaryTable dataSource={items} loading={loading} />
      </ProCard>
    </PageContainer>
  );
}
