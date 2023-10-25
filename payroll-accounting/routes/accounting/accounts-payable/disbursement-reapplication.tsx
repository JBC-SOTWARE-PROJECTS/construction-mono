import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Row, Input, Col, Form, App } from "antd";
import FormDateRange from "@/components/common/formDateRange/filterDateRange";
import dayjs, { Dayjs } from "dayjs";
import FormDebounceSelect from "@/components/common/formDebounceSelect/formDebounceSelect";
import { OptionsValue } from "@/utility/interfaces";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";
import { GET_REAPPLICATION_RECORD } from "@/graphql/payables/disbursement-queries";
import FormSwitch from "@/components/common/formSwitch/formSwitch";
import { useQuery } from "@apollo/client";
import { Query, Reapplication } from "@/graphql/gql/graphql";
import ReapplicationTable from "@/components/accounting/payables/disbursement/reapplicationTable";
import { dateFormat } from "@/utility/constant";
import { dateEndToString, dateToString } from "@/utility/helper";
import { useDialog } from "@/hooks";
import ReapplicationModal from "@/components/accounting/payables/dialogs/reapplicationModal";

const { Search } = Input;

export default function DisbursementComponent() {
  const { message } = App.useApp();
  const [supplier, setSupplier] = useState<OptionsValue>();
  const [filterDates, setFilterDates] = useState({
    start: dayjs(dayjs().startOf("month"), dateFormat),
    end: dayjs(dayjs().endOf("month"), dateFormat),
  });
  const [state, setState] = useState({
    filter: "",
    status: true,
    page: 0,
    size: 10,
  });
  //============================== modal ===============================
  const reapplication = useDialog(ReapplicationModal);
  //==================================queries ===========================
  const { data, loading, refetch } = useQuery<Query>(GET_REAPPLICATION_RECORD, {
    variables: {
      filter: state.filter,
      supplier: supplier?.value,
      status: state.status,
      start: dateToString(filterDates.start),
      end: dateEndToString(filterDates.end),
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

  const onShowReapplication = (record: Reapplication) => {
    reapplication(
      { record: record, supplier: record?.supplier },
      (result: any) => {
        if (result?.success) {
          message.success(result?.message);
          refetch();
        } else {
          refetch();
        }
      }
    );
  };

  return (
    <PageContainer content="Vendor Relations Enhanced: Accounts Payable Disbursement Reapplication">
      <ProCard
        title="Disbursement Reapplication"
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
                  label="Filter Reapplication Date"
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
                <FormSwitch
                  label="Show Draft"
                  switchprops={{
                    checkedChildren: "Yes",
                    unCheckedChildren: "No",
                    onChange: (e) => {
                      setState((prev) => ({ ...prev, status: e }));
                    },
                    defaultChecked: true,
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <ReapplicationTable
          dataSource={data?.reapplicationPageFilter?.content as Reapplication[]}
          loading={loading}
          totalElements={data?.reapplicationPageFilter?.totalElements as number}
          handleOpen={(record) => onShowReapplication(record)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
