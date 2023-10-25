import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Row, Input, Col, Form, Button, App } from "antd";
import FormDateRange from "@/components/common/formDateRange/filterDateRange";
import dayjs, { Dayjs } from "dayjs";
import { GET_PETTY_CASH_RECORDS } from "@/graphql/payables/petty-cash-queries";
import FormSwitch from "@/components/common/formSwitch/formSwitch";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { PettyCashAccounting, Query } from "@/graphql/gql/graphql";
import { dateFormat } from "@/utility/constant";
import { dateEndToString, dateToString } from "@/utility/helper";
import PettyCashModal from "@/components/accounting/payables/dialogs/pettyCashModal";
import PettyCashTable from "@/components/accounting/payables/pettycash/pettyCashTable";
import { useDialog } from "@/hooks";
import { FormSelect } from "@/components/common";
import { usePettyCashNames } from "@/hooks/payables";

const { Search } = Input;

export default function PettyCashComponent() {
  const { message } = App.useApp();
  const pettyCashModal = useDialog(PettyCashModal);

  const [filterDates, setFilterDates] = useState({
    start: dayjs(dayjs().startOf("month"), dateFormat),
    end: dayjs(dayjs().endOf("month"), dateFormat),
  });
  const [state, setState] = useState({
    filter: "",
    payee: null,
    status: true,
    page: 0,
    size: 10,
  });

  const pettyCashNames = usePettyCashNames();
  const { data, loading, refetch } = useQuery<Query>(GET_PETTY_CASH_RECORDS, {
    variables: {
      filter: state.filter,
      payee: state.payee,
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

  const onShowModalPettyCash = (record?: PettyCashAccounting) => {
    pettyCashModal({ record: record }, (result: any) => {
      if (result?.success) {
        message.success(result?.message);
        refetch();
      } else {
        refetch();
      }
    });
  };

  return (
    <PageContainer content="Efficiency in Every Cent: Accounts Payable Petty Cash Voucher">
      <ProCard
        title="Petty Cash Voucher"
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
              onClick={() => onShowModalPettyCash()}>
              Create New
            </Button>
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <FormDateRange
                  label="Filter Petty Cash Date"
                  showpresstslist={true}
                  propsrangepicker={{
                    defaultValue: [filterDates.start, filterDates.end],
                    format: dateFormat,
                    onChange: onRangeChange,
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormSelect
                  label="Filter Payee"
                  propsselect={{
                    showSearch: true,
                    value: state.payee,
                    options: pettyCashNames,
                    allowClear: true,
                    placeholder: "Select Payee",
                    onChange: (newValue) => {
                      setState((prev) => ({ ...prev, payee: newValue }));
                    },
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <FormSwitch
                  label="Show Unapprove"
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
        <PettyCashTable
          dataSource={data?.pettyCashPage?.content as PettyCashAccounting[]}
          loading={loading}
          totalElements={data?.pettyCashPage?.totalElements as number}
          handleOpen={(record) => onShowModalPettyCash(record)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
