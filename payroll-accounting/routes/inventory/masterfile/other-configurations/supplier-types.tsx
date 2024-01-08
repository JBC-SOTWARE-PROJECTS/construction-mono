import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Query, SupplierType } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_SUPPLIER_TYPES } from "@/graphql/inventory/masterfile-queries";
import UpsertSupplierTypeModal from "@/components/inventory/masterfile/other-configurations/dialogs/upsertSupplierTypes";
import SupplierTypeTable from "@/components/inventory/masterfile/other-configurations/supplierTypeTable";

const { Search } = Input;

export default function SupplierTypesComponent() {
  const modal = useDialog(UpsertSupplierTypeModal);
  const [state, setState] = useState({
    filter: "",
  });
  // ====================== queries =====================================

  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_SUPPLIER_TYPES,
    {
      variables: {
        filter: state.filter,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const onUpsertRecord = (record?: SupplierType) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success("Supplier Type successfully updated");
        } else {
          message.success("Supplier Type successfully added");
        }
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Supplier Types Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile.">
      <ProCard
        title="Supplier Types List"
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
          <Form layout="vertical" className="filter-form">
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Search
                  size="middle"
                  placeholder="Search here.."
                  onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
                  className="w-full"
                />
              </Col>
            </Row>
          </Form>
        </div>
        <SupplierTypeTable
          dataSource={data?.supplierTypeList as SupplierType[]}
          loading={loading}
          handleOpen={(record) => onUpsertRecord(record)}
        />
      </ProCard>
    </PageContainer>
  );
}
