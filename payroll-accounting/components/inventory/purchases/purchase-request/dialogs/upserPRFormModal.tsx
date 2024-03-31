import React, { useContext, useMemo, useState } from "react";
import { PurchaseRequest } from "@/graphql/gql/graphql";
import {
  DeleteFilled,
  SaveOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  InputNumber,
  Row,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import _ from "lodash";
import {
  DateFormatterText,
  NumberFormaterDynamic,
  requiredField,
  shapeOptionValue,
} from "@/utility/helper";
import {
  FormSelect,
  FullScreenModal,
  FormDatePicker,
  FormDebounceSelect,
  FormTextArea,
} from "@/components/common";
import {
  PURCHASE_CATEGORY,
  PR_TYPE,
  responsiveColumn4,
  responsiveColumn42,
} from "@/utility/constant";
import { useAssets, useInventoryAttachments } from "@/hooks/inventory";
import dayjs from "dayjs";
import Alert from "antd/es/alert/Alert";
import styled from "styled-components";
import { AccountContext } from "@/components/accessControl/AccountContext";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";
import { useOffices, useProjects } from "@/hooks/payables";
import type { UploadProps } from "antd";
import { ColumnsType } from "antd/lib/table";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";
import {
  DELETE_RECORD_PURCHASE_REQUEST,
  GET_RECORDS_PURCHASE_REQ_ITEMS,
  UPSERT_RECORD_PURCHASE_REQUEST,
} from "@/graphql/inventory/purchases-queries";
import { Query } from "../../../../../graphql/gql/graphql";
import { IFormPurchaseRequest } from "@/interface/inventory/inventory-form";
import { useDialog } from "@/hooks";
import SupplierItemSelector from "@/components/inventory/supplierItemSelector";
import { PurchaseRequestItemExtended } from "@/utility/inventory-helper";
import update from "immutability-helper";
import InventoryItemSelector from "@/components/inventory/inventoryItemSelector";
import DocumentUpload from "@/components/common/document-upload";
import { apiUrlPrefix } from "@/shared/settings";

interface IProps {
  hide: (hideProps: any) => void;
  record?: PurchaseRequest | null | undefined;
  prCategory: string;
}

export default function UpsertPRFormModal(props: IProps) {
  const { hide, record, prCategory } = props;
  const [form] = Form.useForm();
  const account = useContext(AccountContext);
  const [category, setCategory] = useState(record?.category ?? prCategory);
  const [editable, setEditable] = useState<any>({});
  const [items, setItems] = useState<PurchaseRequestItemExtended[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  // ====================== modals =============================
  const supplierItems = useDialog(SupplierItemSelector);
  const inventoryItems = useDialog(InventoryItemSelector);
  // ===================== Queries ==============================
  const offices = useOffices();
  const projects = useProjects({ office: null });
  const assets = useAssets();
  const { attachments, loadingAttachments, fetchAttachments } =
    useInventoryAttachments(record?.id);

  const { loading, refetch } = useQuery<Query>(GET_RECORDS_PURCHASE_REQ_ITEMS, {
    variables: {
      id: record?.id,
    },
    onCompleted: (data) => {
      let result = (data?.prItemByParent ??
        []) as PurchaseRequestItemExtended[];
      setItems(result);
    },
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_PURCHASE_REQUEST,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsertPR?.id)) {
          if (record?.id) {
            hide("Purchase Request Information Updated");
          } else {
            hide("Purchase Request Information Added");
          }
        }
      },
    }
  );

  const [removeRecord, { loading: removeLoading }] = useMutation(
    DELETE_RECORD_PURCHASE_REQUEST,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.removePrItem?.id)) {
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
    let propsObject = { itemIds, formModule: "PR" };
    if (supplier) {
      //show items with supplier
      let extendedProps = { ...propsObject, supplier: supplier?.value };
      supplierItems(extendedProps, (result: PurchaseRequestItemExtended[]) => {
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
      //show all items that is belong to this office
      inventoryItems(propsObject, (result: PurchaseRequestItemExtended[]) => {
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
    }
  };

  const _delete = (record: PurchaseRequestItemExtended) => {
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

  const onSubmit = (data: IFormPurchaseRequest) => {
    let payload = { ...data } as PurchaseRequest;
    payload.requestedOffice = { id: data?.requestedOffice };
    payload.supplier = { id: data?.supplier?.value };
    payload.project = null;
    payload.assets = null;
    if (data?.category === "PROJECTS") {
      payload.project = { id: data?.project };
    } else if (data?.category === "SPARE_PARTS") {
      payload.assets = { id: data?.assets };
    }
    if (_.isEmpty(record?.id)) {
      payload.requestingOffice = account?.office;
      payload.userId = account?.id;
      payload.userFullname = account?.fullName;
    }
    upsertRecord({
      variables: {
        id: record?.id,
        fields: payload,
        items: items,
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

  const onChangeArray = (
    record: PurchaseRequestItemExtended,
    newValue: number
  ) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    let data = update(payload, {
      [index]: {
        requestedQty: {
          $set: newValue || 0,
        },
      },
    });
    setItems(data);
  };

  // ====================== useMemo =======================
  const requestBy = useMemo(() => {
    if (record?.id) {
      return record.userFullname;
    } else {
      return account.fullName;
    }
  }, [record]);

  const transDate = useMemo(() => {
    if (record?.id) {
      return DateFormatterText(record?.prDateRequested);
    } else {
      return dayjs().format("MMMM DD, YYYY");
    }
  }, [record]);

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
  const columns: ColumnsType<PurchaseRequestItemExtended> = [
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
          descripton="Unit of Measurement (UoP/UoU)"
          popup="Unit of Purchase/Unit of Usage"
          popupColor="#399b53"
        />
      ),
      dataIndex: "unitMeasurement",
      key: "unitMeasurement",
      width: 250,
    },
    {
      title: (
        <ColumnTitle
          descripton="Qty (UoP)"
          popup="Unit of Purchase"
          popupColor="#399b53"
          editable={true}
        />
      ),
      dataIndex: "requestedQty",
      key: "requestedQty",
      align: "right",
      width: 200,
      onCell: (e) => {
        return {
          onClick: () => {
            if (record?.isApprove) {
              message.error(
                "This Purchase Request is already approved. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({ ...prev, [e.id]: true }));
            }
          }, // double click row
        };
      },
      render: (text, obj) => {
        let defaultValue = Number(text);
        return editable[obj.id] ? (
          <InputNumber
            className="w-full"
            autoFocus
            defaultValue={defaultValue}
            onBlur={(e) => {
              let newValue = Number(e?.target?.value);
              setEditable((prev: any) => ({ ...prev, [obj.id]: false }));
              onChangeArray(obj, newValue);
            }}
          />
        ) : (
          <span>{NumberFormaterDynamic(obj.requestedQty)}</span>
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
          disabled={record?.isApprove ?? false}
          icon={<DeleteFilled />}
        />
      ),
    },
  ];

  const minMaxRows = useMemo(() => {
    if (
      category === "PERSONAL" ||
      category === "FIXED_ASSET" ||
      category === "CONSIGNMENT" ||
      !category
    ) {
      return 6;
    } else {
      return 4;
    }
  }, [category]);

  return (
    <FullScreenModal
      hide={() => hide(false)}
      allowFullScreen={true}
      icon={<ShoppingOutlined />}
      title="Purchase Request Details"
      extraTitle={record?.prNo}
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
            disabled={record?.isApprove || _.isEmpty(items) || upsertLoading}>
            {`Save ${record?.id ? "Changes" : ""} & Close`}
          </Button>
        </div>
      }>
      <CustomCSS>
        <div className="header-container">
          <Alert
            type="info"
            message={
              <div className="w-full">
                <p>Transaction Date: {transDate}</p>
                <p>Requested By: {requestBy}</p>
              </div>
            }
          />
        </div>
        <Form
          form={form}
          name="upsertForm"
          layout="vertical"
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          disabled={record?.isApprove ?? false}
          initialValues={{
            ...record,
            prDateNeeded: dayjs(record?.prDateNeeded ?? new Date()),
            requestedOffice: record?.requestedOffice?.id ?? null,
            supplier: selectInValueInit(record?.id, "supplier"),
            project: record?.project?.id ?? null,
            assets: record?.assets?.id ?? null,
            category: record?.category ?? prCategory,
          }}>
          <Row gutter={[16, 0]}>
            <Col {...responsiveColumn4}>
              <FormDatePicker
                label="PR Date Needed"
                name="prDateNeeded"
                rules={requiredField}
                propsdatepicker={{
                  allowClear: false,
                }}
              />
              <FormSelect
                name="requestedOffice"
                label="Request To"
                rules={requiredField}
                propsselect={{
                  options: offices,
                  allowClear: true,
                  placeholder: "Request To",
                }}
              />
              <FormSelect
                name="prType"
                label="Urgency"
                rules={requiredField}
                propsselect={{
                  options: PR_TYPE,
                  allowClear: true,
                  placeholder: "PR Urgency Type",
                }}
              />
              <FormDebounceSelect
                name="supplier"
                label="Filter Supplier"
                defaultSearchLabel={record?.supplier?.supplierFullname ?? ""}
                propsselect={{
                  allowClear: true,
                  placeholder: "Select Supplier",
                  fetchOptions: GET_SUPPLIER_OPTIONS,
                }}
              />
            </Col>
            <Col {...responsiveColumn4}>
              <FormSelect
                name="category"
                label="Request Category"
                rules={requiredField}
                propsselect={{
                  options: PURCHASE_CATEGORY,
                  allowClear: true,
                  onChange: (e) => {
                    setCategory(e);
                  },
                  placeholder: "Request Category",
                }}
              />
              {category === "PROJECTS" && (
                <FormSelect
                  name="project"
                  label="Project"
                  rules={requiredField}
                  propsselect={{
                    options: projects,
                    allowClear: true,
                    placeholder: "Select Project",
                  }}
                />
              )}
              {category === "SPARE_PARTS" && (
                <FormSelect
                  name="assets"
                  label="Equipments (Assets)"
                  rules={requiredField}
                  propsselect={{
                    options: assets,
                    allowClear: true,
                    placeholder: "Select Equipments (Assets)",
                  }}
                />
              )}
              <FormTextArea
                name="remarks"
                label="Remarks/Notes"
                propstextarea={{
                  autoSize: {
                    minRows: minMaxRows,
                    maxRows: minMaxRows,
                  },
                  placeholder: "Remarks / Notes",
                }}
              />
            </Col>
            <Col {...responsiveColumn42}>
              <DocumentUpload
                allowUpload={!_.isEmpty(record?.id) && !record?.isApprove}
                uploadProps={uploadProps}
                loading={loadingAttachments}
                uploading={uploading}
                attachments={attachments}
                fetchAttachments={fetchAttachments}
              />
            </Col>
          </Row>
          <Divider plain>Purchase Request Items</Divider>
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
                  Request Item
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
