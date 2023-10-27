import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Row, Input, Col, Form, Button } from "antd";
import FormDateRange from "@/components/common/formDateRange/filterDateRange";
import dayjs, { Dayjs } from "dayjs";
import FormDebounceSelect from "@/components/common/formDebounceSelect/formDebounceSelect";
import { OptionsValue } from "@/utility/interfaces";
import { GET_RELEASING_CHECKS } from "@/graphql/payables/release-checks";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";
import { useQuery } from "@apollo/client";
import { Query, ReleaseCheck } from "@/graphql/gql/graphql";
import FormSelect from "@/components/common/formSelect/formSelect";
import { useBanks } from "@/hooks/payables";
import { PlusCircleOutlined } from "@ant-design/icons";
import { dateFormat } from "@/utility/constant";
import { dateEndToString, dateToString } from "@/utility/helper";
import ReleasedChecksTable from "@/components/accounting/payables/disbursement/releasedChecksTable";
import ReleasingChecksModal from "@/components/accounting/payables/dialogs/releasingModal";
import { useDialog } from "@/hooks";

const { Search } = Input;

export default function ReleasingChecksComponent() {
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
  // ===================== modal =============================
  const showModal = useDialog(ReleasingChecksModal);
  // ===================== queries ==================================
  const banks = useBanks();
  const { data, loading, refetch } = useQuery<Query>(GET_RELEASING_CHECKS, {
    variables: {
      filter: state.filter,
      bank: state.bank,
      supplier: supplier?.value,
      start: dateToString(filterDates.start),
      end: dateEndToString(filterDates.end),
      page: state.page,
      size: state.size,
    },
    fetchPolicy: "cache-and-network",
  });
  // ===================== functions =====================
  const onRelease = () => {
    showModal({}, (e: any) => {
      if (e) {
        refetch();
      }
    });
  };

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
    <PageContainer content="Precision in Paper: Releasing of Checks">
      <ProCard
        title="Releasing of Checks"
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
              className="select-header"
            />
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={onRelease}>
              Release Checks
            </Button>
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <FormDateRange
                  label="Filter Release Date"
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
        <ReleasedChecksTable
          dataSource={data?.releaseChecksFilter?.content as ReleaseCheck[]}
          loading={loading}
          totalElements={data?.releaseChecksFilter?.totalElements as number}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
