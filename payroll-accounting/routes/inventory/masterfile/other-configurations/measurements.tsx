import React, { useState } from "react";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Input, Button, message, Row, Col, Form } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { UnitMeasurement, Query } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { useQuery } from "@apollo/client";
import { GET_RECORDS_ITEM_MEASUREMENT } from "@/graphql/inventory/masterfile-queries";
import UpsertUnitMeasurementModal from "@/components/inventory/masterfile/other-configurations/dialogs/upsertUnitMeasurement";
import ItemMeasurementTable from "@/components/inventory/masterfile/other-configurations/measurementTable";

const { Search } = Input;

export default function ItemMeasurementComponent() {
  const modal = useDialog(UpsertUnitMeasurementModal);
  const [state, setState] = useState({
    filter: "",
  });
  // ====================== queries =====================================

  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_ITEM_MEASUREMENT,
    {
      variables: {
        filter: state.filter,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const onUpsertRecord = (record?: UnitMeasurement) => {
    modal({ record: record }, (result: any) => {
      if (result) {
        if (record?.id) {
          message.success("Item Measurement successfully updated");
        } else {
          message.success("Item Measurement successfully added");
        }
        refetch();
      }
    });
  };

  return (
    <PageContainer
      title="Item Measurement Masterfile"
      content="Mastering Your Inventory: Configuration and Optimization of Item Masterfile.">
      <ProCard
        title="Item Measurement List"
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
        <ItemMeasurementTable
          dataSource={data?.unitMeasurementList as UnitMeasurement[]}
          loading={loading}
          handleOpen={(record) => onUpsertRecord(record)}
        />
      </ProCard>
    </PageContainer>
  );
}
