import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { ItemGroup, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_ITEM_GROUPS } from "@/graphql/inventory/masterfile-queries";
import UpsertItemGroupModal from "@/components/inventory/masterfile/other-configurations/dialogs/upsertItemGroup";
import ItemGroupTable from "@/components/inventory/masterfile/other-configurations/groupTable";

const { Search } = Input;

export default function ItemGroupsComponent() {
  const modal = useDialog(UpsertItemGroupModal);
  const [state, setState] = useState({
    filter: "",
  });
  // ====================== queries =====================================

  const { data, loading, refetch } = useQuery<Query>(GET_RECORDS_ITEM_GROUPS, {
    variables: {
      filter: state.filter,
    },
    fetchPolicy: "cache-and-network",
  });

  const onUpsertRecord = (record?: ItemGroup) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success("Item Group successfully updated");
        } else {
          message.success("Item Group successfully added");
        }
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Item Group Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile.">
      <ProCard
        title="Item Group List"
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
        <ItemGroupTable
          dataSource={data?.itemGroupList as ItemGroup[]}
          loading={loading}
          handleOpen={(record) => onUpsertRecord(record)}
        />
      </ProCard>
    </PageContainer>
  );
}
