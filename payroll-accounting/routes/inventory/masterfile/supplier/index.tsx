import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Query, Supplier } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_SUPPLER } from "@/graphql/inventory/masterfile-queries";
import UpsertSupplierModal from "@/components/inventory/masterfile/supplier/dialogs/upsertSupplier";
import SupplierTable from "@/components/inventory/masterfile/supplier/supplierTable";

const { Search } = Input;

export default function SupplierComponent() {
  const modal = useDialog(UpsertSupplierModal);
  const [state, setState] = useState({
    filter: "",
    page: 0,
    size: 10,
  });
  // ====================== queries =====================================
  const { data, loading, refetch } = useQuery<Query>(GET_RECORDS_SUPPLER, {
    variables: {
      filter: state.filter,
      size: state.size,
      page: state.page,
    },
    fetchPolicy: "cache-and-network",
  });

  const onUpsertRecord = (record?: Supplier) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success("Supplier successfully updated");
        } else {
          message.success("Supplier successfully added");
        }
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Supplier Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile.">
      <ProCard
        title="Supplier List"
        headStyle={{
          flexWrap: "wrap",
        }}
        bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => onUpsertRecord()}>
              Create New
            </Button>
          </ProFormGroup>
        }>
        <div className="w-full mb-5">
          <Search
            size="middle"
            placeholder="Search here.."
            onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
            className="w-full"
          />
        </div>
        <SupplierTable
          dataSource={data?.supplier_list_pageable?.content as Supplier[]}
          loading={loading}
          totalElements={data?.supplier_list_pageable?.totalElements as number}
          handleOpen={(record) => onUpsertRecord(record)}
          handleAssign={(record) => onUpsertRecord(record)}
          changePage={(page) => setState((prev) => ({ ...prev, page: page }))}
        />
      </ProCard>
    </PageContainer>
  );
}
