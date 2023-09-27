import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Row, Col, Form, Button, App } from "antd";
import { Query, Supplier, AccountsPayable } from "@/graphql/gql/graphql";
import { useQuery } from "@apollo/client";
import { FormDateRange, FormSwitch } from "@/components/common";
import { dateFormat } from "@/utility/constant";
import _ from "lodash";
import { dateEndToString, dateToString } from "@/utility/helper";
import { PlusCircleOutlined } from "@ant-design/icons";
import FormDebounceSelect from "@/components/common/formDebounceSelect/formDebounceSelect";
import dayjs, { Dayjs } from "dayjs";
import { useDialog } from "@/hooks";
import { OptionsValue } from "@/utility/interfaces";
import PayableModal from "@/components/accounting/payables/dialogs/payableModal";
import SupplierListModal from "@/components/accounting/payables/dialogs/supplierList";
import {
  GET_RECORDS_PAYABLES,
  GET_SUPPLIER_OPTIONS,
} from "@/graphql/payables/queries";
import PayableTable from "@/components/accounting/payables/payable/payableTable";

const { Search } = Input;

export default function AccountsPayableComponent() {
  const { message } = App.useApp();
  const supplierList = useDialog(SupplierListModal);
  const payableModal = useDialog(PayableModal);
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

  const { data, loading, refetch } = useQuery<Query>(GET_RECORDS_PAYABLES, {
    variables: {
      filter: state.filter,
      supplier: supplier?.value ?? null,
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

  const onCreatePayable = () => {
    supplierList({}, (selected: Supplier) => {
      if (selected) {
        payableModal({ supplier: selected }, (result: any) => {
          if (result) {
            message.success(result?.message);
            refetch();
          }
        });
      }
    });
  };

  const onEditPayable = (record: AccountsPayable) => {
    payableModal(
      { record: record, supplier: record?.supplier },
      (result: any) => {
        if (result) {
          message.success(result?.message);
          refetch();
        } else {
          refetch();
        }
      }
    );
  };

  return (
    <PageContainer
      title="Accounts Payable"
      content="Monitor and control payment processes and transactions.">
      <ProCard
        title="Payables"
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
              onClick={onCreatePayable}>
              Create New
            </Button>
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <FormDateRange
                  label="Filter Accounts Payable Date"
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
        <PayableTable
          dataSource={data?.apListFilter?.content as AccountsPayable[]}
          loading={loading}
          totalElements={data?.apListFilter?.totalElements as number}
          handleOpen={(record) => onEditPayable(record)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
