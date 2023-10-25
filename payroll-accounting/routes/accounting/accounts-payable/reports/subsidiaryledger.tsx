import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Row, Input, Col, Form } from "antd";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";
import { useLazyQuery } from "@apollo/client";
import { AccountsPayable, ApLedgerDto, Query } from "@/graphql/gql/graphql";
import { dateFormat } from "@/utility/constant";
import _ from "lodash";
import FormDateRange from "@/components/common/formDateRange/filterDateRange";
import FormDebounceSelect from "@/components/common/formDebounceSelect/formDebounceSelect";
import { OptionsValue } from "@/utility/interfaces";
import dayjs, { Dayjs } from "dayjs";

import { stringEndDate, stringStartDate } from "@/utility/helper";
import { useDialog } from "@/hooks";
import SubsidiaryTable from "@/components/accounting/payables/config/subsidiaryTable";
import { GET_LEDGER_RECORDS } from "@/graphql/payables/config-queries";

const { Search } = Input;

export default function SubsidiaryLedgerComponent() {
  const [items, setItems] = useState<ApLedgerDto[]>([]);
  const [supplier, setSupplier] = useState<OptionsValue>();
  const [filterDates, setFilterDates] = useState({
    start: dayjs(dayjs().startOf("month"), dateFormat),
    end: dayjs(dayjs().endOf("month"), dateFormat),
  });
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });
  //============================modals=================================
  // const payableModal = useDialog(PayableModal);
  // const disbursementModal = useDialog(DisbursementModal);
  // const debitMemo = useDialog(DebitMemoModal);
  //============================ queries ===============================
  const [lazyQuery, { loading }] = useLazyQuery<Query>(GET_LEDGER_RECORDS, {
    onCompleted: (data) => {
      const result = data?.apLedger as ApLedgerDto[];
      setItems(result);
    },
  });

  // const [getPayable, { loading: loadingPayable }] = useLazyQuery<Query>(
  //   GET_RECORDS_PAYABLE_BY_ID,
  //   {
  //     onCompleted: (data) => {
  //       let result = data?.apById as AccountsPayable;
  //       if (result) {
  //         payableModal(
  //           { record: result, supplier: result?.supplier },
  //           () => {}
  //         );
  //       }
  //     },
  //   }
  // );
  // const [getDisbursement, { loading: loadingDisbursement }] =
  //   useLazyQuery<Query>(GET_DISBURSEMENT_RECORD_BY_ID, {
  //     onCompleted: (data) => {
  //       let result = data?.disbursementById as Disbursement;
  //       if (result) {
  //         disbursementModal(
  //           { record: result, supplier: result?.supplier },
  //           () => {}
  //         );
  //       }
  //     },
  //   });

  // const [getDebitMemo, { loading: loadingDebitMemo }] = useLazyQuery<Query>(
  //   GET_DEBIT_MEMO_RECORD_BY_ID,
  //   {
  //     onCompleted: (data) => {
  //       let result = data?.debitMemoById as DebitMemo;
  //       if (result) {
  //         if (result) {
  //           let type = result?.debitType as string;
  //           debitMemo(
  //             {
  //               record: result,
  //               supplier: result?.supplier,
  //               type: type,
  //             },
  //             () => {}
  //           );
  //         }
  //       }
  //     },
  //   }
  // );

  // =========================== functions ==============================
  const onSelectSupplier = (e: OptionsValue) => {
    lazyQuery({
      variables: {
        supplier: e.value,
        start: stringStartDate(filterDates.start),
        end: stringEndDate(filterDates.end),
        filter: state.filter,
      },
    });
    setSupplier(e);
  };

  const onSearch = (e: string) => {
    lazyQuery({
      variables: {
        supplier: supplier?.value,
        start: stringStartDate(filterDates.start),
        end: stringEndDate(filterDates.end),
        filter: e,
      },
    });
    setState((prev) => ({ ...prev, filter: e }));
  };

  const onRangeChange = (dates: null | (Dayjs | null)[]) => {
    if (dates) {
      const start = dayjs(dates[0], dateFormat);
      const end = dayjs(dates[1], dateFormat);
      lazyQuery({
        variables: {
          supplier: supplier?.value,
          start: stringStartDate(start),
          end: stringEndDate(end),
          filter: state.filter,
        },
      });
      setFilterDates((prev) => ({
        ...prev,
        start: start,
        end: end,
      }));
    }
  };

  const showModals = (record: ApLedgerDto) => {
    // if (record?.ledger_type === "AP" || record?.ledger_type === "PF") {
    //   getPayable({ variables: { id: record.ref_id } });
    // } else if (record?.ledger_type === "CK" || record?.ledger_type === "CS") {
    //   getDisbursement({ variables: { id: record.ref_id } });
    // } else if (record?.ledger_type === "DM" || record?.ledger_type === "DA") {
    //   getDebitMemo({ variables: { id: record.ref_id } });
    // }
  };

  return (
    <PageContainer title="Vendor/Supplier Subsidiary Ledger">
      <ProCard
        title="Subsidiary Ledger"
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
              onSearch={(e) => onSearch(e)}
              className="select-header"
            />
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <FormDateRange
                  label="Filter Dates"
                  showpresstslist={true}
                  propsrangepicker={{
                    defaultValue: [filterDates.start, filterDates.end],
                    format: dateFormat,
                    onChange: onRangeChange,
                  }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <FormDebounceSelect
                  label="Filter Supplier"
                  propsselect={{
                    value: supplier,
                    placeholder: "Select Supplier",
                    fetchOptions: GET_SUPPLIER_OPTIONS,
                    onChange: (newValue) => {
                      onSelectSupplier(newValue as OptionsValue);
                    },
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <SubsidiaryTable
          dataSource={items}
          loading={loading}
          handleOpen={(record) => showModals(record)}
        />
      </ProCard>
    </PageContainer>
  );
}
