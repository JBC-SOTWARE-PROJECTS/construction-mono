import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { TransactionType, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_TRANSACTION_TYPE } from "@/graphql/inventory/masterfile-queries";
import UpsertTransactionTypeModal from "@/components/inventory/transaction-types/dialogs/upsertTransactionType";
import InventoryTransactionTypeTable from "@/components/inventory/transaction-types/transactionTypeTable";

const { Search } = Input;

interface IProps {
  type: string;
  title: string;
}

export default function TransactionTypesComponent({ type, title }: IProps) {
  const modal = useDialog(UpsertTransactionTypeModal);
  const [state, setState] = useState({
    filter: "",
  });
  // ====================== queries =====================================

  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_TRANSACTION_TYPE,
    {
      variables: {
        filter: state.filter,
        tag: type,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const onUpsertRecord = (record?: TransactionType) => {
    modal({ record: { ...record, tag: type } }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success("Inventory Transaction Type successfully updated");
        } else {
          message.success("Inventory Transaction Type successfully added");
        }
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Inventory Transaction Type Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile.">
      <ProCard
        title={`${title} List`}
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
        <InventoryTransactionTypeTable
          dataSource={data?.transTypeByTagFilter as TransactionType[]}
          loading={loading}
          handleOpen={(record) => onUpsertRecord(record)}
        />
      </ProCard>
    </PageContainer>
  );
}
