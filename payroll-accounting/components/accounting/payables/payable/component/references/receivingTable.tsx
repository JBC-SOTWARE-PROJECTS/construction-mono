import { Query, ReceivingReportItem } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater, NumberFormaterNoDecimal } from "@/utility/helper";
import { useQuery } from "@apollo/client";
import { Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";

import { GET_REC_ITEMS_RECORDS } from "@/graphql/payables/queries";

interface IProps {
  recId?: string;
}

export default function ReceivingItemsTable({ recId }: IProps) {
  const { data, loading } = useQuery<Query>(GET_REC_ITEMS_RECORDS, {
    variables: {
      id: recId,
    },
    fetchPolicy: "cache-and-network",
  });

  const columns: ColumnsType<ReceivingReportItem> = [
    {
      title: "Reference #",
      dataIndex: "receivingReport.rrNo",
      key: "receivingReport.rrNo",
      width: 120,
      render: (_, record) => <span>{record?.receivingReport?.rrNo}</span>,
    },
    {
      title: "Date Delivered",
      dataIndex: "receivingReport.receiveDate",
      key: "receivingReport.receiveDate",
      width: 120,
      render: (_, record) => (
        <span>{DateFormatter(record?.receivingReport?.receiveDate)}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "item.descLong",
      key: "item.descLong",
      width: 600,
      render: (_, record) => <span>{record?.item?.descLong}</span>,
    },
    {
      title: "Qty",
      dataIndex: "receiveQty",
      key: "receiveQty",
      align: "center",
      render: (qty) => <span>{NumberFormaterNoDecimal(qty)}</span>,
    },
    {
      title: "Unit",
      dataIndex: "item.unit_of_usage.unitDescription",
      key: "item.unit_of_usage.unitDescription",
      align: "center",
      render: (_, record) => (
        <span>{record.item?.unit_of_usage?.unitDescription}</span>
      ),
    },
    {
      title: "Unit Cost",
      dataIndex: "receiveUnitCost",
      key: "receiveUnitCost",
      width: 130,
      align: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Inventory Cost",
      dataIndex: "recInventoryCost",
      key: "recInventoryCost",
      width: 130,
      align: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 130,
      align: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Discount Amount",
      dataIndex: "receiveDiscountCost",
      key: "receiveDiscountCost",
      width: 130,
      align: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Net of Discount",
      dataIndex: "receiveDiscountCost",
      key: "receiveDiscountCost",
      width: 130,
      align: "right",
      render: (amount, record) => {
        let net = record.totalAmount - amount;
        return (
          <span>
            <small>{currency} </small>
            {NumberFormater(net)}
          </span>
        );
      },
    },
    {
      title: "Input Tax",
      dataIndex: "inputTax",
      key: "inputTax",
      width: 130,
      align: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
      width: 130,
      align: "right",
      fixed: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },

    {
      title: "Free Goods",
      dataIndex: "isFg",
      key: "isFg",
      align: "center",
      width: 100,
      fixed: "right",
      render: (status) => {
        let text = status ? "Yes" : "No";
        let color = status ? "green" : "red";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "netAmount",
      key: "netAmount",
      align: "center",
      width: 100,
      fixed: "right",
      render: (status) => {
        let text = status ? "Completed" : "Partial";
        let color = status ? "green" : "orange";
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];
  return (
    <Table
      rowKey="id"
      size="small"
      columns={columns}
      loading={loading}
      dataSource={[] as ReceivingReportItem[]}
      pagination={{
        showSizeChanger: false,
        pageSize: 5,
      }}
      scroll={{ x: 2200 }}
    />
  );
}
