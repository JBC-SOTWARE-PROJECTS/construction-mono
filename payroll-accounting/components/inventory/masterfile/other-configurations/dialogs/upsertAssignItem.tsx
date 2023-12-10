import React from "react";
import { Item, ItemGroup, OfficeItem } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  message,
  Table,
} from "antd";
import _ from "lodash";
import {
  GET_RECORDS_LOCATION_ITEM,
  UPSERT_RECORD_LOCATION_ITEM,
} from "@/graphql/inventory/masterfile-queries";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput, FormSelect } from "@/components/common";
import { ColumnsType } from "antd/es/table";
import { useOffices } from "@/hooks/payables";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Item | null | undefined;
}

export default function UpsertAssignItemLocationModal(props: IProps) {
  const { hide, record } = props;
  // ===================== Queries ==============================
  const offices = useOffices();
  const { loading, data, refetch } = useQuery(GET_RECORDS_LOCATION_ITEM, {
    variables: {
      id: record?.id,
    },
    fetchPolicy: "network-only",
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_LOCATION_ITEM,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsertOfficeItem?.id)) {
          message.success("Item Successfully assigned");
          refetch({
            id: record?.id,
          });
        }
        if (_.isEmpty(data?.upsertOfficeItem)) {
          message.error(
            "Item is already assigned on this office. Please try again."
          );
          refetch({
            id: record?.id,
          });
        }
      },
    }
  );

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (data: any) => {
    // insert
    upsertRecord({
      variables: {
        depId: data.office,
        itemId: record?.id,
        trade: true,
        assign: true,
        id: null,
      },
    });
  };

  const updateTradeAssign = (
    record: OfficeItem,
    trade: boolean,
    assign: boolean
  ) => {
    // update
    upsertRecord({
      variables: {
        depId: record?.office?.id,
        itemId: record?.id,
        trade: trade,
        assign: assign,
        id: record?.id,
      },
    });
  };

  const columns: ColumnsType<OfficeItem> = [
    {
      title: "Office",
      dataIndex: "office.officeDescription",
      key: "office.officeDescription",
      render: (_, record) => <span>{record?.office?.officeDescription}</span>,
    },
    {
      title: "Tradable",
      dataIndex: "allow_trade",
      key: "allow_trade",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Checkbox
          key={record?.id + "allow_trade"}
          defaultChecked={record.allow_trade ?? false}
          onChange={(e) => {
            updateTradeAssign(
              record,
              e?.target?.checked,
              record?.is_assign ?? false
            );
          }}
        />
      ),
    },
    {
      title: "Assigned",
      dataIndex: "is_assign",
      key: "is_assign",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Checkbox
          key={record?.id + "is_assign"}
          defaultChecked={record.is_assign ?? false}
          onChange={(e) => {
            updateTradeAssign(
              record,
              record.allow_trade ?? false,
              e?.target?.checked
            );
          }}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">Assign Item Location</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "800px" }}
      onCancel={() => hide(false)}>
      <Form
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormSelect
              name="office"
              label="Select Location to Assign"
              rules={requiredField}
              propsselect={{
                allowClear: true,
                options: offices,
                placeholder: "Select Location to Assign",
              }}
            />
          </Col>
          <Col span={24}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={upsertLoading}>
              Add Location
            </Button>
          </Col>
        </Row>
      </Form>
      <div className="w-full mt-5">
        <Table
          rowKey="id"
          size="small"
          loading={loading}
          columns={columns}
          dataSource={data?.officeListByItem as OfficeItem[]}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </div>
    </Modal>
  );
}
