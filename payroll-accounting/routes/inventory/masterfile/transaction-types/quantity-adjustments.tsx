import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Query, QuantityAdjustmentType } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_QUANTITY_ADJUSTMENT } from "@/graphql/inventory/masterfile-queries";
import UpsertQuantityAdjustmentTypeModal from "@/components/inventory/transaction-types/dialogs/upsertQauntityAdjustmentType";
import QuantityAdjustmentTypeTable from "@/components/inventory/transaction-types/quantityAdjustmentTypeTable";

const { Search } = Input;

export default function QuantityAdjustmentComponent() {
  const modal = useDialog(UpsertQuantityAdjustmentTypeModal);
  const [state, setState] = useState({
    filter: "",
  });
  // ====================== queries =====================================

  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_QUANTITY_ADJUSTMENT,
    {
      variables: {
        filter: state.filter,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const onUpsertRecord = (record?: QuantityAdjustmentType) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success(
            "Quantity Adjustment Transaction Type successfully updated"
          );
        } else {
          message.success(
            "Quantity Adjustment Transaction Type successfully added"
          );
        }
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Quantity Adjustment Transation Type Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile.">
      <ProCard
        title="Quantity Adjustment Transaction Type"
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
        <QuantityAdjustmentTypeTable
          dataSource={
            data?.quantityAdjustmentTypeFilter as QuantityAdjustmentType[]
          }
          loading={loading}
          handleOpen={(record) => onUpsertRecord(record)}
        />
      </ProCard>
    </PageContainer>
  );
}
