import React, { useCallback, useState } from "react";
import { Query, Wtx2307 } from "@/graphql/gql/graphql";
import { GET_2307_LIST_PAGE } from "@/graphql/payables/wtx-queries";
import { currency } from "@/utility/constant";
import { getUrlPrefix } from "@/utility/graphql-client";
import {
  DateFormatter,
  NumberFormater,
  dateEndToString,
  dateToString,
} from "@/utility/helper";
import { FilterDates, OptionsValue } from "@/utility/interfaces";
import { PrinterOutlined, ReconciliationOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Row, Col, Table, Pagination, Button, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { useDialog } from "@/hooks";
import WTXConsolidatedModal from "../dialogs/wtxConsolidatedModal";


interface IProps {
  filter: string;
  supplier: OptionsValue | undefined;
  filterDates: FilterDates;
  status: boolean;
  setPage: (e: number) => void;
  page: number;
  selectedRowkeys: React.Key[];
  setSelectedRowkeys: (e: React.Key[]) => void;
  selected: any;
  setSelected: (e: Wtx2307[]) => void;
}

export default function WTXListTable({
  filterDates,
  supplier,
  setPage,
  ...props
}: IProps) {
  // ================= state and queries ===========================
  const modal = useDialog(WTXConsolidatedModal);

  const { data, loading, refetch } = useQuery<Query>(GET_2307_LIST_PAGE, {
    variables: {
      filter: props.filter,
      supplier: supplier?.value,
      start: dateToString(filterDates.start),
      end: dateEndToString(filterDates.end),
      status: props.status,
      size: 10,
      page: props.page,
    },
    fetchPolicy: "cache-and-network",
  });
  // ============== functions =============================================
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Wtx2307[]) => {
      props.setSelectedRowkeys(selectedRowKeys);
      props.setSelected(selectedRows);
    },
    getCheckboxProps: (record: Wtx2307) => ({
      disabled: record.process ?? false,
    }),
  };

  const onConsolidate = useCallback(() => {
    modal(
      { items: props.selected, supplier: supplier, filterDates: filterDates },
      (result: any) => {
        if (result) {
          refetch();
          props.setSelectedRowkeys([]);
          props.setSelected([]);
        }
      }
    );
  }, [props, supplier, filterDates, modal, refetch]);
  // =============== column ==============================================
  const columns: ColumnsType<Wtx2307> = [
    {
      title: "Date",
      dataIndex: "wtxDate",
      key: "wtxDate",
      width: 125,
      render: (text) => <span>{DateFormatter(text)}</span>,
    },
    {
      title: "Source Document",
      dataIndex: "sourceDoc",
      key: "sourceDoc",
      render: (text, record) => <span key={text}>{text ?? record?.refNo}</span>,
    },
    {
      title: "Ref. No",
      dataIndex: "refNo",
      key: "refNo",
    },
    {
      title: "Supplier",
      dataIndex: "supplier.supplierFullname",
      key: "supplier.supplierFullname",
      render: (text, record) => (
        <span key={text}>{record.supplier?.supplierFullname}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "ewtAmount",
      key: "ewtAmount",
      align: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "process",
      key: "process",
      align: "center",
      width: 150,
      render: (value) => {
        if (value) {
          return <Tag color="green">Consolidated</Tag>;
        } else {
          return <span>--</span>;
        }
      },
    },
    {
      title: "#",
      key: "action",
      width: 100,
      render: (text, record) => (
        <Button
          key={text}
          icon={<PrinterOutlined />}
          size="small"
          type="primary"
          onClick={() =>
            window.open(`${getUrlPrefix()}/reports/ap/print/2307/${record.id}`)
          }>
          Print
        </Button>
      ),
    },
  ];

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <div className="dev-right">
          <Button
            type="dashed"
            icon={<ReconciliationOutlined />}
            disabled={_.isEmpty(props.selected) || _.isEmpty(supplier?.value)}
            onClick={onConsolidate}>
            Consolidate 2307
          </Button>
        </div>
      </Col>
      <Col span={24}>
        <Table
          rowSelection={{
            selectedRowKeys: props.selectedRowkeys,
            ...rowSelection,
          }}
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={data?.wtxListPage?.content as Wtx2307[]}
          pagination={false}
          loading={loading}
          footer={() => (
            <Pagination
              current={props.page + 1}
              pageSize={10}
              responsive={true}
              showSizeChanger={false}
              total={data?.wtxListPage?.totalElements as number}
              onChange={(page) => setPage(page - 1)}
            />
          )}
        />
      </Col>
    </Row>
  );
}
