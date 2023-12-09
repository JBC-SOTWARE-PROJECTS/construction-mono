import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { ItemCategory, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_ITEM_CATEGORY } from "@/graphql/inventory/masterfile-queries";
import UpsertItemCategoryModal from "@/components/inventory/masterfile/other-configurations/dialogs/upsertItemCategory";
import ItemCategoryTable from "@/components/inventory/masterfile/other-configurations/categoryTable";

const { Search } = Input;

export default function ItemGroupsComponent() {
  const modal = useDialog(UpsertItemCategoryModal);
  const [state, setState] = useState({
    filter: "",
  });
  // ====================== queries =====================================

  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_ITEM_CATEGORY,
    {
      variables: {
        filter: state.filter,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const onUpsertRecord = (record?: ItemCategory) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success("Item Category successfully updated");
        } else {
          message.success("Item Category successfully added");
        }
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Item Category Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile.">
      <ProCard
        title="Item Category List"
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
        <ItemCategoryTable
          dataSource={data?.itemCategoryList as ItemCategory[]}
          loading={loading}
          handleOpen={(record) => onUpsertRecord(record)}
        />
      </ProCard>
    </PageContainer>
  );
}
