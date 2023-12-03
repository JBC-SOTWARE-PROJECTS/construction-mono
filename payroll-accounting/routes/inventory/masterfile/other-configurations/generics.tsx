import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Generic, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_ITEM_GENERICS } from "@/graphql/inventory/masterfile-queries";
import UpsertItemGenericsModal from "@/components/inventory/masterfile/other-configurations/dialogs/upsertItemGenerics";
import ItemGenericTable from "@/components/inventory/masterfile/other-configurations/genericsTable";

const { Search } = Input;

export default function ItemGenericsComponent() {
  const modal = useDialog(UpsertItemGenericsModal);
  const [state, setState] = useState({
    filter: "",
  });
  // ====================== queries =====================================

  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_ITEM_GENERICS,
    {
      variables: {
        filter: state.filter,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const onUpsertRecord = (record?: Generic) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success("Item Generics successfully updated");
        } else {
          message.success("Item Generics successfully added");
        }
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Item Generics Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile.">
      <ProCard
        title="Item Generics List"
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
        <ItemGenericTable
          dataSource={data?.genericList as Generic[]}
          loading={loading}
          handleOpen={(record) => onUpsertRecord(record)}
        />
      </ProCard>
    </PageContainer>
  );
}
