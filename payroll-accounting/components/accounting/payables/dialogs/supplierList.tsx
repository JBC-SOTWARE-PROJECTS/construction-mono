import React from "react";
import { Query, Supplier } from "@/graphql/gql/graphql";
import { GET_SUPPLIER_LIST } from "@/graphql/payables/queries";
import { TeamOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Button, Input, Col, Modal, Row, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { useLocalStorage } from "@/utility/helper";

interface IProps {
  hide: (hideProps: any) => void;
}

const { Search } = Input;

export default function SupplierListModal(props: IProps) {
  const { hide } = props;
  const [filter, setFilter] = useLocalStorage("filter_supplier", "");
  // ===================== Queries ==============================
  const { data, loading } = useQuery<Query>(GET_SUPPLIER_LIST, {
    variables: {
      filter: filter,
      size: 10,
      page: 0,
    },
    fetchPolicy: "cache-and-network",
  });

  //================== functions ====================

  const onSelectSupplier = (record: Supplier) => {
    if (!_.isEmpty(record)) {
      hide(record);
    }
  };

  // ================ columns ================================
  const columns: ColumnsType<Supplier> = [
    {
      title: "Supplier",
      dataIndex: "supplierFullname",
      key: "supplierFullname",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Button
          size="small"
          type="dashed"
          onClick={() => onSelectSupplier(record)}>
          Select
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <TeamOutlined /> Select Supplier
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "600px" }}
      onCancel={() => hide(false)}
      footer={false}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Search onSearch={(e) => setFilter(e)} defaultValue={filter} />
        </Col>
        <Col span={24}>
          <Table
            rowKey="id"
            size="small"
            loading={loading}
            columns={columns}
            pagination={false}
            dataSource={
              data?.supplier_list_pageable_active?.content as Supplier[]
            }
          />
        </Col>
      </Row>
    </Modal>
  );
}
