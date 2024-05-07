import React, { useContext, useMemo, useState } from "react";
import { ReturnSupplier } from "@/graphql/gql/graphql";
import {
  DeleteFilled,
  RedoOutlined,
  SaveOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import _ from "lodash";
import {
  NumberFormater,
  NumberFormaterDynamic,
  requiredField,
  shapeOptionValue,
} from "@/utility/helper";
import {
  FormSelect,
  FullScreenModal,
  FormDatePicker,
  FormDebounceSelect,
  FormInput,
} from "@/components/common";
import { responsiveColumn4, responsiveColumn42 } from "@/utility/constant";
import {
  useInventoryAttachments,
  useTransactionTypes,
} from "@/hooks/inventory";
import dayjs from "dayjs";
import styled from "styled-components";
import { AccountContext } from "@/components/accessControl/AccountContext";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";
import { useOffices } from "@/hooks/payables";
import type { UploadProps } from "antd";
import { ColumnsType } from "antd/lib/table";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";
import { Query } from "../../../../../graphql/gql/graphql";
import { IFromReturnSupplier } from "@/interface/inventory/inventory-form";
import { useDialog } from "@/hooks";
import SupplierItemSelector from "@/components/inventory/supplierItemSelector";
import { ReturnItemsExtended } from "@/utility/inventory-helper";
import update from "immutability-helper";
import DocumentUpload from "@/components/common/document-upload";
import { apiUrlPrefix } from "@/shared/settings";
import {
  DELETE_RECORD_RETURN_ITEM,
  GET_RECORDS_RETURN_ITEMS,
  UPSERT_RECORD_RETURN_ITEMS,
} from "@/graphql/inventory/deliveries-queries";

interface IProps {
  hide: (hideProps: any) => void;
  record?: ReturnSupplier | null | undefined;
  prCategory: string;
}

export default function UpsertReturnFormModal(props: IProps) {
  const { hide, record } = props;
  const [form] = Form.useForm();
  const account = useContext(AccountContext);
  const [editable, setEditable] = useState<any>({});
  const [items, setItems] = useState<ReturnItemsExtended[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  // ====================== modals =============================
  const supplierItems = useDialog(SupplierItemSelector);
  // ===================== Queries ==============================
  const offices = useOffices();
  const transactionList = useTransactionTypes("RETURNS");
  const { attachments, loadingAttachments, fetchAttachments } =
    useInventoryAttachments(record?.id);

  const { loading, refetch } = useQuery<Query>(GET_RECORDS_RETURN_ITEMS, {
    variables: {
      id: record?.id,
    },
    onCompleted: (data) => {
      let result = (data?.rtsItemByParent ?? []) as ReturnItemsExtended[];
      setItems(result);
    },
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_RETURN_ITEMS,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsertRTS?.id)) {
          if (record?.id) {
            hide("Return Supplier Information Updated");
          } else {
            hide("Return Supplier Information Added");
          }
        }
      },
    }
  );

  const [removeRecord, { loading: removeLoading }] = useMutation(
    DELETE_RECORD_RETURN_ITEM,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.removeRtsItem?.id)) {
          message.success("Item removed");
          refetch({
            id: record?.id,
          });
        }
      },
    }
  );

  //================== functions ====================

  const onRequestItems = () => {
    const { getFieldValue } = form;
    const payloadItems = _.cloneDeep(items);
    let supplier = getFieldValue("supplier");
    let itemIds = _.map(payloadItems, "item.id");
    let propsObject = { itemIds, formModule: "RTS" };
    if (supplier) {
      //show items with supplier
      let extendedProps = { ...propsObject, supplier: supplier?.value };
      supplierItems(extendedProps, (result: ReturnItemsExtended[]) => {
        if (!_.isEmpty(result)) {
          if (_.isEmpty(payloadItems)) {
            // ========== set =======================
            setItems(result);
          } else {
            // ========== concatonate ================
            setItems((prev) => [...prev, ...result]);
          }
        }
      });
    } else {
      message.warning("Please select supplier");
    }
  };

  const _delete = (record: ReturnItemsExtended) => {
    let payload = _.clone(items);
    if (record.isNew) {
      _.remove(payload, function (n) {
        return n.id === record.id;
      });
      setItems(payload);
      message.success("Item removed");
    } else {
      removeRecord({
        variables: {
          id: record.id,
        },
      });
    }
  };

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (data: IFromReturnSupplier) => {
    let payload = { ...data } as ReturnSupplier;
    payload.office = { id: data?.office };
    payload.supplier = { id: data?.supplier?.value };
    payload.transType = { id: data?.transType };
    if (_.isEmpty(record?.id)) {
      payload.returnUser = account?.id;
      payload.returnBy = account?.fullName;
    }

    upsertRecord({
      variables: {
        fields: payload,
        items: items,
        id: record?.id,
      },
    });
  };

  // ===================== uploads ================
  const uploadProps: UploadProps = {
    name: "file",
    method: "POST",
    multiple: true,
    action: `${apiUrlPrefix}/attachment/inventory`,
    data: {
      id: record?.id,
    },
    accept: "image/*,application/pdf",
    onChange(info) {
      if (info.file.status === "uploading") {
        setUploading(true);
      }
      if (info.file.status === "done") {
        message.success(`Attachment uploaded successfully`);
        setUploading(false);
        fetchAttachments();
      } else if (info.file.status === "error") {
        message.error(`Attachment upload failed.`);
        setUploading(false);
        fetchAttachments();
      }
    },
    showUploadList: false,
  };
  // ================ end uploads ============================

  const onChangeArray = (record: ReturnItemsExtended, newValue: number) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    let data = update(payload, {
      [index]: {
        returnQty: {
          $set: newValue || 0,
        },
      },
    });
    setItems(data);
  };

  const onChangeUnitCost = (record: ReturnItemsExtended, newValue: number) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    let data = update(payload, {
      [index]: {
        returnUnitCost: {
          $set: newValue || 0,
        },
      },
    });
    setItems(data);
  };

  const onChangeRemarks = (record: ReturnItemsExtended, newValue: string) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    let data = update(payload, {
      [index]: {
        return_remarks: {
          $set: newValue,
        },
      },
    });
    setItems(data);
  };

  // =================== init ===============================

  const selectInValueInit = (id?: string, type?: string) => {
    if (_.isEmpty(id)) {
      return null;
    } else {
      if (type === "supplier") {
        if (record?.supplier?.id) {
          return shapeOptionValue(
            record?.supplier?.supplierFullname,
            record?.supplier?.id
          );
        } else {
          return null;
        }
      }
    }
  };

  // =================== columns =========================
  const columns: ColumnsType<ReturnItemsExtended> = [
    {
      title: "Item Description",
      dataIndex: "item.descLong",
      key: "item.descLong",
      render: (__, obj) => (
        <span>
          {obj.item?.descLong}{" "}
          {obj.isNew && (
            <Tag bordered={false} color="green">
              New
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: (
        <ColumnTitle
          descripton="Unit of Measurement (UoU)"
          popup="Unit of Usage"
          popupColor="#399b53"
        />
      ),
      dataIndex: "uou",
      key: "uou",
      width: 250,
    },
    {
      title: (
        <ColumnTitle
          descripton="Qty (UoU)"
          popup="Unit of Usage"
          popupColor="#399b53"
          editable={true}
        />
      ),
      dataIndex: "returnQty",
      key: "returnQty",
      align: "right",
      width: 200,
      onCell: (e) => {
        return {
          onClick: () => {
            if (record?.isPosted) {
              message.error(
                "This Return Supplier is already approved. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({
                ...prev,
                [`${e.id}-returnQty`]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (text, obj) => {
        let defaultValue = Number(text);
        return editable[`${obj.id}-returnQty`] ? (
          <InputNumber
            className="w-full"
            autoFocus
            defaultValue={defaultValue}
            onBlur={(e) => {
              let newValue = Number(e?.target?.value);
              setEditable((prev: any) => ({
                ...prev,
                [`${obj.id}-returnQty`]: false,
              }));
              onChangeArray(obj, newValue);
            }}
          />
        ) : (
          <span>{NumberFormaterDynamic(obj.returnQty)}</span>
        );
      },
    },
    {
      title: (
        <ColumnTitle
          descripton="Unit Cost (UoU)"
          popup="Unit of Usage"
          popupColor="#399b53"
          editable={true}
        />
      ),
      dataIndex: "returnUnitCost",
      key: "returnUnitCost",
      align: "right",
      width: 200,
      onCell: (e) => {
        return {
          onClick: () => {
            if (record?.isPosted) {
              message.error(
                "This Return Supplier is already approved. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({
                ...prev,
                [`${e.id}-returnUnitCost`]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (text, obj) => {
        let defaultValue = Number(text);
        return editable[`${obj.id}-returnUnitCost`] ? (
          <InputNumber
            className="w-full"
            autoFocus
            defaultValue={defaultValue}
            onBlur={(e) => {
              let newValue = Number(e?.target?.value);
              setEditable((prev: any) => ({
                ...prev,
                [`${obj.id}-returnUnitCost`]: false,
              }));
              onChangeUnitCost(obj, newValue);
            }}
          />
        ) : (
          <span>{NumberFormater(obj.returnUnitCost)}</span>
        );
      },
    },
    {
      title: (
        <ColumnTitle
          descripton="Remarks/Notes"
          popupColor="#399b53"
          editable={true}
        />
      ),
      dataIndex: "return_remarks",
      key: "return_remarks",
      align: "right",
      width: 300,
      onCell: (e) => {
        return {
          onClick: () => {
            if (record?.isPosted) {
              message.error(
                "This Return Supplier is already approved. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({
                ...prev,
                [`${e.id}-return_remarks`]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (text, obj) => {
        return editable[`${obj.id}-return_remarks`] ? (
          <Input
            className="w-full"
            autoFocus
            defaultValue={text}
            onBlur={(e) => {
              let newValue = e?.target?.value as string;
              setEditable((prev: any) => ({
                ...prev,
                [`${obj.id}-return_remarks`]: false,
              }));
              onChangeRemarks(obj, newValue);
            }}
          />
        ) : (
          <span>{text}</span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 80,
      render: (_, obj) => (
        <Button
          type="primary"
          danger
          size="small"
          onClick={() => {
            _delete(obj);
          }}
          disabled={disabledStatus}
          icon={<DeleteFilled />}
        />
      ),
    },
  ];

  const disabledStatus = useMemo(() => {
    if (record?.isPosted || record?.isVoid) {
      return true;
    } else {
      return false;
    }
  }, [record]);

  return (
    <FullScreenModal
      hide={() => hide(false)}
      allowFullScreen={true}
      icon={<RedoOutlined />}
      title="Return To Supplier Details"
      extraTitle={record?.rtsNo}
      footer={
        <div className="w-full">
          <Button
            block
            type="primary"
            size="large"
            htmlType="submit"
            form="upsertForm"
            loading={upsertLoading}
            icon={<SaveOutlined />}
            disabled={disabledStatus || _.isEmpty(items) || upsertLoading}>
            {`Save ${record?.id ? "Changes" : ""} & Close`}
          </Button>
        </div>
      }>
      <CustomCSS>
        <Form
          form={form}
          name="upsertForm"
          layout="vertical"
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          disabled={disabledStatus}
          initialValues={{
            ...record,
            returnDate: dayjs(record?.returnDate ?? new Date()),
            receivedRefDate: dayjs(record?.receivedRefDate ?? new Date()),
            office: record?.office?.id ?? null,
            supplier: selectInValueInit(record?.id, "supplier"),
            returnBy: record?.id ? record?.returnBy : account?.fullName,
            transType: record?.transType?.id ?? null,
          }}>
          <Row gutter={[16, 0]}>
            <Col {...responsiveColumn4}>
              <FormDatePicker
                label="Return Date"
                name="returnDate"
                rules={requiredField}
                propsdatepicker={{
                  allowClear: false,
                }}
              />
              <FormSelect
                name="office"
                label="Returning Office"
                rules={requiredField}
                propsselect={{
                  showSearch: true,
                  options: offices,
                  allowClear: true,
                  placeholder: "Request To",
                }}
              />
              <FormDebounceSelect
                name="supplier"
                label="Filter Supplier"
                rules={requiredField}
                defaultSearchLabel={record?.supplier?.supplierFullname ?? ""}
                propsselect={{
                  allowClear: true,
                  placeholder: "Select Supplier",
                  fetchOptions: GET_SUPPLIER_OPTIONS,
                }}
              />
              <FormInput
                name="receivedRefNo"
                label="Reference Number"
                rules={requiredField}
                propsinput={{
                  placeholder: "Reference Number",
                }}
              />
            </Col>
            <Col {...responsiveColumn4}>
              <FormDatePicker
                label="Reference Date"
                name="receivedRefDate"
                rules={requiredField}
                propsdatepicker={{
                  allowClear: false,
                }}
              />
              <FormSelect
                name="transType"
                label="Transaction Type"
                rules={requiredField}
                propsselect={{
                  options: transactionList,
                  allowClear: true,
                  placeholder: "Transaction Type",
                }}
              />
              <FormInput
                name="received_by"
                label="Received By"
                rules={requiredField}
                propsinput={{
                  placeholder: "Received By",
                }}
              />
              <FormInput
                name="returnBy"
                label="Return By"
                propsinput={{
                  placeholder: "Return By",
                  readOnly: true,
                }}
              />
            </Col>
            <Col {...responsiveColumn42}>
              <DocumentUpload
                allowUpload={!_.isEmpty(record?.id) && !disabledStatus}
                uploadProps={uploadProps}
                loading={loadingAttachments}
                uploading={uploading}
                attachments={attachments}
                fetchAttachments={fetchAttachments}
              />
            </Col>
          </Row>
          <Divider plain>Return Items</Divider>
          <Card
            bordered={false}
            style={{ boxShadow: "none" }}
            styles={{
              header: { border: 0 },
              body: { padding: 0 },
            }}
            title={<></>}
            extra={[
              <Space key="controls" split={<Divider type="vertical" />}>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={onRequestItems}>
                  Return Item
                </Button>
              </Space>,
            ]}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={items}
              size="small"
              loading={loading || removeLoading}
              scroll={{ x: 1000 }}
              pagination={false}
            />
          </Card>
        </Form>
      </CustomCSS>
    </FullScreenModal>
  );
}

const CustomCSS = styled.div`
  th.ant-table-cell {
    background: #fff !important;
    color: #399b53 !important;
    padding-bottom: 6px !important;
    border-bottom: 4px solid #f0f0f0 !important;
  }

  .ant-card .ant-card-head {
    padding: 0px !important;
    min-height: 36px !important;
  }

  .ant-divider-horizontal.ant-divider-with-text {
    margin: 8px 0 !important;
  }

  .ant-alert {
    padding: 2px 10px !important;
  }
  .header-container {
    margin-bottom: 5px;
  }
`;
