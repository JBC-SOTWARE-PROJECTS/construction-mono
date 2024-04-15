import React, { useState } from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Col, Row, Space, Input, Table, Modal, Typography, Tag } from "antd";
import _ from "lodash";
import {
  PoDeliveryMonitoring,
  PurchaseOrderItemsMonitoring,
  Query,
} from "@/graphql/gql/graphql";
import { useQuery } from "@apollo/client";
import { ColumnsType } from "antd/es/table";
import ColumnTitle from "../../../common/columnTitle/columnTitle";
import styled from "styled-components";
import { GET_RECORDS_PO_DEL_MON } from "@/graphql/inventory/purchases-queries";
import { NumberFormaterDynamic } from "@/utility/helper";

interface IProps {
  hide: (hideProps: any) => void;
  record: PurchaseOrderItemsMonitoring;
}

const { Search } = Input;

export default function POMonitoringModal(props: IProps) {
  const { hide, record } = props;
  const [state, setState] = useState({
    filter: "",
  });
  // ======================= queries ===========================
  const { loading, data } = useQuery<Query>(GET_RECORDS_PO_DEL_MON, {
    variables: {
      filter: state.filter,
      id: record?.id,
    },
  });

  const columns: ColumnsType<PoDeliveryMonitoring> = [
    {
      title: "SRR #",
      dataIndex: "receivingReport.rrNo",
      key: "receivingReport.rrNo",
      render: (text, record) => (
        <span key={text}>{record?.receivingReport?.rrNo}</span>
      ),
    },
    {
      title: "Ref #",
      dataIndex: "receivingReport.receivedRefNo",
      key: "receivingReport.receivedRefNo",
      render: (text, record) => (
        <span key={text}>{record?.receivingReport?.receivedRefNo}</span>
      ),
    },
    {
      title: (
        <ColumnTitle
          descripton="Delivered Qty (UoU)"
          popup="Unit of Usage"
          popupColor="#399b53"
        />
      ),
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => <span>{NumberFormaterDynamic(quantity)}</span>,
    },
    {
      title: (
        <ColumnTitle
          descripton="Rec. Unit (UoU)"
          popup="Unit of Usage"
          popupColor="#399b53"
        />
      ),
      dataIndex: "receivingReportItem",
      key: "receivingReportItem",
      render: (text, record) => (
        <span key={text}>
          {record?.receivingReportItem?.item?.unit_of_usage?.unitDescription}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = status === "DELIVERED" ? "green" : "orange";
        return (
          <span>
            <Tag color={color} key={color}>
              {status}
            </Tag>
          </span>
        );
      },
    },
  ];

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <ShoppingCartOutlined /> Delivered Orders{" "}
            <Tag color="magenta">{record?.item?.descLong}</Tag>
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "1600px" }}
      footer={false}
      onCancel={() => hide(false)}>
      <CustomCSS>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
              className="w-full"
            />
          </Col>
          <Col span={24}>
            <Table
              rowKey="id"
              size="small"
              loading={loading}
              columns={columns}
              dataSource={
                data?.getPOMonitoringByPoItemFilter as PoDeliveryMonitoring[]
              }
              pagination={{ pageSize: 10, showSizeChanger: false }}
            />
          </Col>
        </Row>
      </CustomCSS>
    </Modal>
  );
}

const CustomCSS = styled.div`
  th.ant-table-cell {
    background: #fff !important;
    color: #399b53 !important;
    padding-bottom: 6px !important;
    border-bottom: 4px solid #f0f0f0 !important;
  }
`;
