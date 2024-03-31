import React, { useState } from "react";
import { QuantityAdjustment, Query, Inventory } from "@/graphql/gql/graphql";
import {
  BackwardOutlined,
  EditOutlined,
  FileAddOutlined,
  FileProtectOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Divider,
  Form,
  Row,
  Tag,
  App,
  Table,
  InputNumber,
} from "antd";
import _ from "lodash";
import FullScreenModal from "@/components/common/fullScreenModal/fullScreenModal";
import { responsiveColumn4 } from "@/utility/constant";
import {
  FormDatePicker,
  FormInputNumber,
  FormSelect,
  FormTextArea,
} from "@/components/common";
import {
  DateFormatter,
  NumberFormater,
  NumberFormaterNoDecimal,
  requiredField,
} from "@/utility/helper";
import { ColumnsType } from "antd/es/table";
import { useDialog } from "@/hooks";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";
import {
  GET_RECORDS_QUANTITY_ADJUSTMENTS,
  UPSERT_QTY_ADJUSTMENT,
  UPSERT_RECORD_ADJUSTMENT,
} from "@/graphql/inventory/adjustments-queries";
import { useAdjustmentTypes } from "@/hooks/inventory";
import ButtonPosted from "../commons/buttonPosted";
import UpsertQuantityAdjustmentRemarks from "./upsertRemarks";
import PostQuantityAdjustmentModal from "../post-dialogs/postsQuantityAdjustment";
import AccessControl from "@/components/accessControl/AccessControl";


interface IProps {
  hide: (hideProps: any) => void;
  record: Inventory;
  office: string;
}

export default function QuantityAdjustmentModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, record, office } = props;
  const [parentForm] = Form.useForm();
  const [editable, setEditable] = useState<any>({});
  const modalRemarks = useDialog(UpsertQuantityAdjustmentRemarks);
  const postInventory = useDialog(PostQuantityAdjustmentModal);
  //================== queries ===================================
  const adjTypes = useAdjustmentTypes();
  const { data, loading, refetch } = useQuery<Query>(
    GET_RECORDS_QUANTITY_ADJUSTMENTS,
    {
      variables: {
        id: record?.item?.id,
      },
      fetchPolicy: "cache-and-network",
    }
  );
  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_ADJUSTMENT,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.quantityAdjustmentInsert?.id)) {
          message.success("Quantity Adjustment Added");
          refetch();
          parentForm.resetFields();
        }
      },
    }
  );
  const [upsertQty, { loading: upsertQtyLoading }] = useMutation(
    UPSERT_QTY_ADJUSTMENT,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsertQty?.id)) {
          message.success("Quantity Updated");
          refetch();
        }
      },
    }
  );

  // =========== call back error =====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };
  // ============== submit ===============================
  const onSubmit = (data: QuantityAdjustment) => {
    let payload = _.clone(data);
    payload.quantityAdjustmentType = { id: data?.quantityAdjustmentType };
    if (office) {
      payload.office = { id: office };
    }
    payload.item = record?.item;
    //check location
    if (!office) {
      return message.error(
        "Inventory Location Unidentified. Please contact the administrator for assistance."
      );
    }
    //check unit cost
    if (data?.unit_cost <= 0) {
      message.error("Unit cost must not be less than or equal to zero");
    } else {
      upsertRecord({
        variables: {
          fields: payload,
        },
      });
    }
  };
  // ====================== save quantity change ========================
  const onChangeQuantity = (record: QuantityAdjustment, newValue: number) => {
    if (record.quantity !== newValue) {
      upsertQty({
        variables: {
          qty: newValue,
          id: record?.id,
        },
      });
    }
  };
  // ==================== edit remark ==============================
  const onEditRemarks = (record: QuantityAdjustment) => {
    modalRemarks({ record: record }, (result: string) => {
      if (result) {
        message.success(result);
        refetch();
      }
    });
  };
  // ====================== post or void ===================
  const onPostOrVoidView = (
    record: QuantityAdjustment,
    status: boolean,
    viewOnly: boolean
  ) => {
    postInventory(
      { record: record, status: status, viewOnly: viewOnly },
      (result: string) => {
        if (result) {
          message.success(result);
          refetch();
        }
      }
    );
  };
  // ================ column tabs descriptions ================================
  const columns: ColumnsType<QuantityAdjustment> = [
    {
      title: "Date Adjust",
      dataIndex: "dateTrans",
      key: "dateTrans",
      width: 140,
      render: (text) => <span key={text}>{DateFormatter(text)}</span>,
    },
    {
      title: "Reference #",
      dataIndex: "refNum",
      key: "refNum",
      width: 140,
    },
    {
      title: <ColumnTitle descripton="Unit (UoU)" popup="Unit of Usage" />,
      dataIndex: "uou",
      key: "uou",
      width: 200,
    },
    {
      title: "Location",
      dataIndex: "office",
      key: "office",
      render: (_, record) => <span>{record.office?.officeDescription}</span>,
    },
    {
      title: "Adjustment Type",
      dataIndex: "quantityAdjustmentType",
      key: "quantityAdjustmentType",
      width: 300,
      render: (_, record) => (
        <Tag>{record.quantityAdjustmentType?.description}</Tag>
      ),
    },
    {
      title: (
        <ColumnTitle
          descripton="Qty (UoU)"
          popup="Unit of Usage"
          editable={true}
        />
      ),
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      onCell: (e) => {
        return {
          onClick: () => {
            if (e?.isPosted || e?.isCancel) {
              message.error(
                "This Quantity Adjustment is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable({ ...editable, [e.id + "quantity"]: true });
            }
          }, // double click row
        };
      },
      render: (text, record) => {
        let defaultValue = Number(text);
        return editable[record.id + "quantity"] ? (
          <AccessControl
            allowedPermissions={["allow_edit_qty_adjustment"]}
            renderNoAccess={
              <Tag bordered={false} color="red">
                Access Denied
              </Tag>
            }>
            <InputNumber
              autoFocus
              defaultValue={defaultValue}
              onBlur={(e) => {
                let newValue = Number(e?.target?.value);
                setEditable({ ...editable, [record.id + "quantity"]: false });
                onChangeQuantity(record, newValue);
              }}
            />
          </AccessControl>
        ) : (
          <span key={text}>{NumberFormaterNoDecimal(record.quantity)}</span>
        );
      },
    },
    {
      title: (
        <ColumnTitle descripton="Unit Cost (UoU)" popup="Unit of Usage" />
      ),
      dataIndex: "unit_cost",
      key: "unit_cost",
      width: 150,
      align: "right",
      render: (unit_cost) => <span>{NumberFormater(unit_cost)}</span>,
    },
    {
      title: "Status",
      dataIndex: "isPosted",
      key: "isPosted",
      align: "center",
      width: 140,
      render: (status, record) => {
        let color = status ? "green" : "blue";
        let text = status ? "Posted" : "New";
        if (record.isCancel) {
          color = "red";
          text = "Voided";
        }
        // for viewing please set status to true to view the current entries not the reverse
        if (status) {
          return (
            <ButtonPosted onClick={() => onPostOrVoidView(record, true, true)}>
              {text}
            </ButtonPosted>
          );
        } else {
          return (
            <span>
              <Tag bordered={false} color={color} key={color}>
                {text}
              </Tag>
            </span>
          );
        }
      },
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: 100,
      render: (_, record) => {
        let posted = record?.isPosted;
        return (
          <AccessControl allowedPermissions={["allow_edit_qty_adjustment"]}>
            <Button
              type="primary"
              danger={posted ? true : false}
              disabled={record.isCancel ?? false}
              size="small"
              onClick={() => onPostOrVoidView(record, !posted, false)}
              icon={
                record?.isPosted ? <UndoOutlined /> : <FileProtectOutlined />
              }>
              {record?.isPosted ? "Void" : "Post"}
            </Button>
          </AccessControl>
        );
      },
    },
  ];

  // ============================= UI =======================================

  return (
    <FullScreenModal
      hide={hide}
      allowFullScreen={true}
      icon={<FileAddOutlined />}
      title={`Quantity Adjustment`}
      extraTitle={record?.item?.descLong}
      footer={
        <Button
          type="primary"
          danger
          size="large"
          onClick={() => hide(false)}
          icon={<BackwardOutlined />}>
          Return
        </Button>
      }>
      <Form
        form={parentForm}
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          unit_cost: record?.last_wcost ?? 0,
        }}>
        <Row gutter={[8, 0]}>
          <Col {...responsiveColumn4}>
            <FormDatePicker
              label="Transaction Date"
              name="dateTrans"
              rules={requiredField}
              propsdatepicker={{
                allowClear: false,
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormInputNumber
              label="Quantity (+ -) (UoU)"
              name="quantity"
              rules={requiredField}
              propsinputnumber={{
                placeholder: "Quantity (+ -)",
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormInputNumber
              label="Unit Cost (UoU)"
              name="unit_cost"
              rules={requiredField}
              propsinputnumber={{
                placeholder: "Unit Cost (UoU)",
                readOnly: true,
              }}
            />
          </Col>
          <Col {...responsiveColumn4}>
            <FormSelect
              label="Adjustment Type"
              name="quantityAdjustmentType"
              rules={requiredField}
              propsselect={{
                options: adjTypes,
                allowClear: true,
                placeholder: "Select Adjustment Type",
              }}
            />
          </Col>
          <Col span={24}>
            <FormTextArea
              label="Remarks/Notes (Particular)"
              name="remarks"
              rules={requiredField}
              propstextarea={{
                rows: 6,
                placeholder: "Remarks/Notes",
              }}
            />
          </Col>
          <AccessControl allowedPermissions={["allow_edit_qty_adjustment"]}>
            <Col span={24}>
              <Button
                type="primary"
                htmlType="submit"
                form="upsertForm"
                loading={upsertLoading}
                disabled={upsertLoading}
                icon={<SaveOutlined />}
                block>
                Save Quantity Adjustment
              </Button>
            </Col>
          </AccessControl>
        </Row>
      </Form>
      {/*  */}
      <Divider plain>Transaction Details</Divider>
      <Row>
        <Col span={24}>
          <Table
            rowKey="id"
            size="small"
            dataSource={data?.quantityListByItem as QuantityAdjustment[]}
            loading={loading || upsertQtyLoading}
            columns={columns}
            expandable={{
              expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>
                  Remarks/Notes (Particular):{" "}
                  {record.remarks ? <Tag>{record.remarks}</Tag> : "--"}
                  {record?.isPosted || record?.isCancel ? null : (
                    <AccessControl
                      allowedPermissions={["allow_edit_qty_adjustment"]}>
                      <Button
                        size="small"
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => onEditRemarks(record)}>
                        Edit Remarks
                      </Button>
                    </AccessControl>
                  )}
                </p>
              ),
            }}
            pagination={{
              pageSize: 15,
              showSizeChanger: false,
            }}
          />
        </Col>
      </Row>
    </FullScreenModal>
  );
}
