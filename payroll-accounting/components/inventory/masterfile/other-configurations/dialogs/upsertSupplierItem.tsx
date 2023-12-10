import React, { useState } from "react";
import { Item, SupplierItem } from "@/graphql/gql/graphql";
import { DeleteFilled, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  message,
  Table,
  InputNumber,
} from "antd";
import _ from "lodash";
import {
  GET_RECORDS_SUPPLIER_BY_ITEM,
  UPSERT_RECORD_SUPPLIER_BY_ITEM,
  DELETE_RECORD_SUPPLIER_BY_ITEM,
} from "@/graphql/inventory/masterfile-queries";
import { NumberFormater, requiredField } from "@/utility/helper";
import { FormInputNumber, FormSelect } from "@/components/common";
import { ColumnsType } from "antd/es/table";
import { useSupplier } from "@/hooks/inventory";
import ColTitlePopUp from "@/components/inventory/colTitlePopUp";
import { responsiveColumn2 } from "@/utility/constant";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Item | null | undefined;
}

export default function UpsertAssignSupplierItemModal(props: IProps) {
  const { hide, record } = props;
  const [editable, setEditable] = useState<any>({});
  const [state, setState] = useState({ loading: false });
  const [form] = Form.useForm();
  // ===================== Queries ==============================
  const supplierList = useSupplier();
  const { loading, data, refetch } = useQuery(GET_RECORDS_SUPPLIER_BY_ITEM, {
    variables: {
      id: record?.id,
    },
    fetchPolicy: "network-only",
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_SUPPLIER_BY_ITEM,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsertSupplierItem?.id)) {
          message.success("Success");
          refetch({
            id: record?.id,
          });
          form.resetFields();
        }
        if (_.isEmpty(data?.upsertSupplierItem)) {
          message.error(
            "Item is already assigned on this Supplier. Please try again."
          );
          refetch({
            id: record?.id,
          });
        }
        setState({ ...state, loading: false });
      },
    }
  );

  const [removeRecord, { loading: removeLoading }] = useMutation(
    DELETE_RECORD_SUPPLIER_BY_ITEM,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.removeItemSupplier)) {
          message.success("Supplier Removed");
          refetch({
            id: record?.id,
          });
        }
      },
    }
  );

  //======================= =================== =================================================//
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (data: any) => {
    // insert
    setState({ ...state, loading: true });
    let payload = _.clone(data);
    payload.supplier = { id: data?.supplier };
    payload.item = { id: record?.id };
    upsertRecord({
      variables: {
        fields: payload,
        itemId: record?.id,
        supId: data?.supplier,
        id: null,
      },
    });
  };

  const onChangeUnitCost = (data: SupplierItem, newValue: number) => {
    // update
    let payload = _.clone(data);
    payload.supplier = { id: data?.supplier?.id };
    payload.item = { id: record?.id };
    payload.cost = newValue;

    upsertRecord({
      variables: {
        fields: payload,
        itemId: record?.id,
        supId: data?.supplier?.id,
        id: data?.id,
      },
    });
  };

  const _delete = (id: string) => {
    // confirm({
    //   title: "Do you want to delete these supplier?",
    //   icon: <ExclamationCircleOutlined />,
    //   content: "Please click ok to proceed.",
    //   onOk() {
    //     removeRecord({
    //       variables: {
    //         id: id,
    //       },
    //     });
    //   },
    //   onCancel() {
    //     console.log("Cancel");
    //   },
    // });
  };

  const columns: ColumnsType<SupplierItem> = [
    {
      title: "Supplier",
      dataIndex: "supplier.supplierFullname",
      key: "supplier.supplierFullname",
      render: (_, record) => <span>{record?.supplier?.supplierFullname}</span>,
    },
    {
      title: (
        <ColTitlePopUp
          descripton="Unit Cost (UoU)"
          popup="Unit of Usage"
          editable={true}
        />
      ),
      dataIndex: "cost",
      key: "cost",
      width: 170,
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            setEditable({ ...editable, [e.id]: true });
          }, // double click row
        };
      },
      render: (_, payload) => {
        return editable[payload.id] ? (
          <InputNumber
            defaultValue={payload.cost}
            autoFocus
            onBlur={(e) => {
              let newValue = Number(e?.target?.value);
              onChangeUnitCost(payload, newValue);
              setEditable({ ...editable, [payload.id]: false });
            }}
            style={{ width: 150 }}
          />
        ) : (
          <span>
            {NumberFormater(payload.cost) +
              " per " +
              record?.unit_of_usage?.unitDescription}
          </span>
        );
      },
    },
    {
      title: (
        <ColTitlePopUp descripton="Unit Cost (UoP)" popup="Unit of Purchase" />
      ),
      dataIndex: "costPurchase",
      key: "costPurchase",
      width: 150,
      render: (_, payload) => {
        return (
          <span>
            {NumberFormater(payload.costPurchase) +
              " per " +
              record?.unit_of_purchase?.unitDescription}
          </span>
        );
      },
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      width: 50,
      render: (_, record) => (
        <Button
          type="primary"
          danger
          size="small"
          onClick={() => {
            _delete(record?.id);
          }}
          icon={<DeleteFilled />}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">Assign Item Supplier</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "1000px" }}
      onCancel={() => hide(false)}
      footer={false}>
      <Form
        form={form}
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}>
        <Row gutter={[8, 0]}>
          <Col {...responsiveColumn2}>
            <FormSelect
              name="supplier"
              label="Select Supplier to Assign"
              rules={requiredField}
              propsselect={{
                allowClear: true,
                options: supplierList,
                placeholder: "Select Supplier to Assign",
              }}
            />
          </Col>
          <Col {...responsiveColumn2}>
            <FormInputNumber
              name="cost"
              rules={requiredField}
              label="Unit Cost (UoU)"
              propsinputnumber={{
                placeholder: "Unit Cost (UoU)",
              }}
            />
          </Col>
          <Col span={24}>
            <Button
              type="primary"
              htmlType="submit"
              block
              icon={<SaveOutlined />}
              loading={state?.loading}>
              Assign Supplier
            </Button>
          </Col>
        </Row>
      </Form>
      <div className="w-full mt-5">
        <Table
          rowKey="id"
          size="small"
          loading={loading || upsertLoading || removeLoading}
          columns={columns}
          dataSource={data?.allSupplierByItem as SupplierItem[]}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </div>
    </Modal>
  );
}
