import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Row, Input, Col, Form } from "antd";
import FormDateRange from "@/components/common/formDateRange/filterDateRange";
import dayjs, { Dayjs } from "dayjs";
import FormDebounceSelect from "@/components/common/formDebounceSelect/formDebounceSelect";
import { OptionsValue } from "@/utility/interfaces";
import { PRINT_DISBURSEMENT_CHECKS } from "@/graphql/payables/disbursement-queries";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";
import { useQuery } from "@apollo/client";
import { DisbursementCheck, Query } from "@/graphql/gql/graphql";
import PrintChecksTable from "@/components/accounting/payables/disbursement/printChecksTable";
import FormSelect from "@/components/common/formSelect/formSelect";
import { useBanks } from "@/hooks/payables";
import { dateFormat } from "@/utility/constant";
import { stringStartDate, stringEndDate } from "@/utility/helper";

const { Search } = Input;

export default function PrintChecksComponent() {
  const banks = useBanks();
  const [supplier, setSupplier] = useState<OptionsValue>();
  const [filterDates, setFilterDates] = useState({
    start: dayjs(dayjs().startOf("month"), dateFormat),
    end: dayjs(dayjs().endOf("month"), dateFormat),
  });
  const [state, setState] = useState({
    filter: "",
    bank: null,
    page: 0,
    size: 10,
  });

  const { data, loading } = useQuery<Query>(PRINT_DISBURSEMENT_CHECKS, {
    variables: {
      filter: state.filter,
      bank: state.bank,
      supplier: supplier?.value,
      start: stringStartDate(filterDates.start),
      end: stringEndDate(filterDates.end),
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "cache-and-network",
  });

  const onRangeChange = (dates: null | (Dayjs | null)[]) => {
    if (dates) {
      setFilterDates((prev) => ({
        ...prev,
        start: dayjs(dates[0], dateFormat),
        end: dayjs(dates[1], dateFormat),
      }));
    }
  };

  return (
    <PageContainer content="Precision in Paper: Check Printing">
      <ProCard
        title="Print Checks"
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
              className="select-header-reapplication"
            />
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <FormDateRange
                  label="Filter Check Date"
                  showpresstslist={true}
                  propsrangepicker={{
                    defaultValue: [filterDates.start, filterDates.end],
                    format: dateFormat,
                    onChange: onRangeChange,
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormDebounceSelect
                  label="Filter Supplier"
                  propsselect={{
                    value: supplier,
                    allowClear: true,
                    placeholder: "Select Supplier",
                    fetchOptions: GET_SUPPLIER_OPTIONS,
                    onChange: (newValue) => {
                      setSupplier(newValue as OptionsValue);
                    },
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter Bank"
                  propsselect={{
                    showSearch: true,
                    value: state.bank,
                    options: banks,
                    allowClear: true,
                    placeholder: "Select Bank",
                    onChange: (newValue) => {
                      setState((prev) => ({ ...prev, bank: newValue }));
                    },
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <PrintChecksTable
          dataSource={data?.printChecks?.content as DisbursementCheck[]}
          loading={loading}
          totalElements={data?.printChecks?.totalElements as number}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
