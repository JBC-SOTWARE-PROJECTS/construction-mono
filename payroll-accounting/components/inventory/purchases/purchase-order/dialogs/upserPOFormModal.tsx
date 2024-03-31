import React, { useContext, useEffect, useMemo, useState } from "react";
import { PurchaseOrder, PurchaseRequestItem } from "@/graphql/gql/graphql";
import {
  DeleteFilled,
  SaveOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
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
  DateFormatterText,
  NumberFormater,
  NumberFormaterDynamic,
  requiredField,
  shapeOptionValue,
  typeLabel,
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
  poType,
} from "@/utility/constant";
import {
  useAssets,
  useInventoryAttachments,
  usePrNumbersNoPo,
} from "@/hooks/inventory";
import dayjs from "dayjs";
import Alert from "antd/es/alert/Alert";
import styled from "styled-components";
import { AccountContext } from "@/components/accessControl/AccountContext";
import { GET_SUPPLIER_OPTIONS } from "@/graphql/payables/queries";
import { usePaymentTerms, useProjects } from "@/hooks/payables";
import type { UploadProps } from "antd";
import { ColumnsType } from "antd/lib/table";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";
import {
  DELETE_RECORD_PO_ITEM,
  DELETE_RECORD_PURCHASE_REQUEST,
  GET_PR_ITEMS_BY_PRNOS,
  GET_RECORDS_PO_ITEMS,
  GET_RECORDS_PURCHASE_REQ_ITEMS,
  UPSERT_RECORD_PURCHASE_ORDER,
  UPSERT_RECORD_PURCHASE_REQUEST,
} from "@/graphql/inventory/purchases-queries";
import { Query } from "../../../../../graphql/gql/graphql";
import {
  IFormPurchaseOrder,
  IFormPurchaseRequest,
} from "@/interface/inventory/inventory-form";
import { useDialog } from "@/hooks";
import SupplierItemSelector from "@/components/inventory/supplierItemSelector";
import {
  PurchaseOrderItemsExtended,
  formatObjPrItemsToPoItems,
} from "@/utility/inventory-helper";
import update from "immutability-helper";
import DocumentUpload from "@/components/common/document-upload";
import { apiUrlPrefix } from "@/shared/settings";

interface IProps {
  hide: (hideProps: any) => void;
  record?: PurchaseOrder | null | undefined;
  poCategory: string;
}

export default function UpsertPOFormModal(props: IProps) {
  const { hide, record, poCategory } = props;
  const [form] = Form.useForm();
  const account = useContext(AccountContext);
  const [category, setCategory] = useState(record?.category ?? poCategory);
  const [editable, setEditable] = useState<any>({});
  const [items, setItems] = useState<PurchaseOrderItemsExtended[]>([]);
  const [forRemove, setForRemove] = useState<PurchaseOrderItemsExtended[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [prItems, setPrItems] = useState<PurchaseRequestItem[]>([]);
  const [prNo, setPrNo] = useState<string[]>(
    record?.prNos ? record.prNos.split(",") : []
  );
  // ====================== modals =============================
  const supplierItems = useDialog(SupplierItemSelector);
  // ===================== Queries ==============================
  const projects = useProjects({ office: null });
  const assets = useAssets();
  const paymentTerms = usePaymentTerms();
  const prNumberList = usePrNumbersNoPo();

  const { attachments, loadingAttachments, fetchAttachments } =
    useInventoryAttachments(record?.id);

  const { loading, refetch } = useQuery<Query>(GET_RECORDS_PO_ITEMS, {
    variables: {
      id: record?.id,
    },
    onCompleted: (data) => {
      let result = (data?.poItemByParent ?? []) as PurchaseOrderItemsExtended[];
      setItems(result);
    },
  });

  const [getPurchaseReqItems, { loading: prItemsLoading }] =
    useLazyQuery<Query>(GET_PR_ITEMS_BY_PRNOS);

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_PURCHASE_ORDER,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsertPO?.id)) {
          if (record?.id) {
            hide("Purchase Order Information Updated");
          } else {
            hide("Purchase Order Information Added");
          }
        }
      },
    }
  );

  const [removeRecord, { loading: removeLoading }] = useMutation(
    DELETE_RECORD_PO_ITEM,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.removePoItem?.id) {
          message.success("Item removed");
          refetch({
            id: record?.id,
          });
        }
      },
    }
  );

  //================== functions ====================
  const onOrderItems = () => {
    const { getFieldValue } = form;
    const payloadItems = _.cloneDeep(items);
    let supplier = getFieldValue("supplier");
    let itemIds = _.map(payloadItems, "item.id");
    let propsObject = { itemIds, formModule: "PO" };
    if (supplier) {
      //show items with supplier
      let extendedProps = { ...propsObject, supplier: supplier?.value };
      supplierItems(extendedProps, (result: PurchaseOrderItemsExtended[]) => {
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
      message.warning("Please select supplier first");
    }
  };

  const _delete = (record: PurchaseOrderItemsExtended) => {
    let payload = _.clone(items);
    if (record.isNew) {
      //delete in array
      _.remove(payload, function (n) {
        return n.id === record.id;
      });
      setItems(payload);
      message.success("Item removed");
    } else {
      //delete in database
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

  const onSubmit = (data: IFormPurchaseOrder) => {
    let payload = {
      preparedDate: data?.preparedDate,
      category: data?.category,
      etaDate: data?.etaDate,
      remarks: data?.remarks,
    } as PurchaseOrder;
    payload.supplier = { id: data?.supplier?.value };
    payload.paymentTerms = { id: data?.paymentTerms };
    payload.prNos = _.toString(data?.prNos);
    payload.noPr = _.isEmpty(data?.prNos);
    payload.project = null;
    payload.assets = null;
    if (data?.category === "PROJECTS") {
      payload.project = { id: data?.project };
    } else if (data?.category === "SPARE_PARTS") {
      payload.assets = { id: data?.assets };
    }
    if (_.isEmpty(record?.id)) {
      payload.office = account?.office;
      payload.userId = account?.id;
      payload.preparedBy = account?.fullName;
    }

    upsertRecord({
      variables: {
        id: record?.id,
        fields: payload,
        items: items,
        forRemove: forRemove,
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

  const onChangeArrayNumber = (
    element: string,
    record: PurchaseOrderItemsExtended,
    newValue: number
  ) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    let data = update(payload, {
      [index]: {
        [element]: {
          $set: newValue || 0,
        },
      },
    });
    setItems(data);
  };

  const onChangeArrayString = (
    element: string,
    record: PurchaseOrderItemsExtended,
    newValue: string
  ) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    let data = update(payload, {
      [index]: {
        [element]: {
          $set: newValue || "none",
        },
      },
    });
    setItems(data);
  };
  const onChangeArrayTypeText = (
    record: PurchaseOrderItemsExtended,
    newValue: string
  ) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    let data = update(payload, {
      [index]: {
        type_text: {
          $set: newValue || null,
        },
      },
    });
    setItems(data);
  };

  // ====================== useMemo =======================
  const preparedBy = useMemo(() => {
    if (record?.id) {
      return record.preparedBy;
    } else {
      return account.fullName;
    }
  }, [record]);

  // =================== init ===============================

  const selectInValueInit = (id?: string, type?: string) => {
    if (_.isEmpty(id)) {
      return null;
    } else {
      if (type === "supplier") {
        return shapeOptionValue(
          record?.supplier?.supplierFullname,
          record?.supplier?.id
        );
      }
    }
  };
  // ==================== editable cols ======================
  const colInput = (record: PurchaseOrderItemsExtended, el: string) => {
    if (el === "type") {
      return (
        <FormSelect
          name={`name-${record?.id}`}
          propsselect={{
            defaultValue: record?.type ?? "none",
            options: poType,
            allowClear: true,
            placeholder: "Select type",
            autoFocus: true,
            onChange: (e) => {
              onChangeArrayString(el, record, e);
            },
            onBlur: () => {
              setEditable({ ...editable, [record.id + el]: false });
            },
          }}
        />
      );
    } else {
      let defaultValue = Number(record?.quantity);
      if (el === "unitCost") {
        defaultValue = Number(record?.unitCost);
      }

      return (
        <InputNumber
          defaultValue={defaultValue}
          autoFocus
          onBlur={(e) => {
            let newValue = Number(e.target.value);
            onChangeArrayNumber(el, record, newValue);
            setEditable({ ...editable, [record.id + el]: false });
          }}
          style={{ width: 150 }}
        />
      );
    }
  };

  const colInputDeals = (record: PurchaseOrderItemsExtended, el: string) => {
    if (record.type === "discountRate" || record.type === "discountAmount") {
      let defaultValue = Number(record?.type_text);
      let addtProps = {};
      if (record.type === "discountRate") {
        addtProps = { max: 100 };
      }
      return (
        <InputNumber
          defaultValue={defaultValue}
          autoFocus
          {...addtProps}
          onBlur={(e) => {
            let newValue = Number(e.target.value);
            onChangeArrayNumber(el, record, newValue);
            setEditable((prev: any) => ({ ...prev, [record.id + el]: false }));
          }}
          className="w-full"
        />
      );
    } else {
      return (
        <Input
          defaultValue={record?.type_text ?? ""}
          autoFocus
          onBlur={(e) => {
            let newValue = e?.target?.value;
            onChangeArrayTypeText(record, newValue);
            setEditable((prev: any) => ({ ...prev, [record.id + el]: false }));
          }}
          className="w-full"
        />
      );
    }
  };

  const getPrItems = (prNo: string[]) => {
    getPurchaseReqItems({
      variables: {
        prNos: prNo,
        status: record?.isApprove || false,
        id: record?.id,
      },
      onCompleted: (data) => {
        let list = (data?.getPrItemInPO ?? []) as PurchaseRequestItem[];
        let result = mapObject(list);
        setItems(result);
        setPrItems(list);
      },
    });
  };

  // ================== disabled columns and buttons =================
  const _delStatus = useMemo(() => {
    let status = false;
    if (!_.isEmpty(record?.id)) {
      if (record?.isApprove || record?.isVoided) {
        status = true;
      }
    }
    return status;
  }, [record]);

  // =================== columns =========================
  const columns: ColumnsType<PurchaseOrderItemsExtended> = [
    {
      title: "Item Description",
      dataIndex: "item.descLong",
      key: "item.descLong",
      render: (text, obj) => (
        <span key={text}>
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
        <ColumnTitle descripton="Type" editable={true} popupColor="#399b53" />
      ),
      dataIndex: "type",
      key: "type",
      width: 180,
      onCell: (e) => {
        return {
          onClick: () => {
            if (record?.isApprove || record?.isVoided) {
              message.error(
                "This Purchase Order is already approved/voided. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({ ...prev, [e.id + "type"]: true }));
            }
          }, // double click row
        };
      },
      render: (text, obj) => {
        return editable[obj.id + "type"] ? (
          colInput(obj, "type")
        ) : (
          <span key={text}>{typeLabel(obj?.type ?? "N/A")}</span>
        );
      },
    },
    {
      title: (
        <ColumnTitle
          descripton="Disc./Deals"
          editable={true}
          popupColor="#399b53"
        />
      ),
      dataIndex: "type_text",
      key: "type_text",
      width: 160,
      onCell: (e) => {
        return {
          onClick: () => {
            if (record?.isApprove || record?.isVoided) {
              message.error(
                "This Purchase Order is already approved/voided. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({
                ...prev,
                [e.id + "type_text"]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (text, obj) => {
        return editable[obj.id + "type_text"] ? (
          colInputDeals(obj, "type_text")
        ) : (
          <span key={text}>{obj.type_text ?? "--"}</span>
        );
      },
    },
    {
      title: (
        <ColumnTitle
          descripton="Qty (UoP)"
          popup="Unit of Purchase"
          editable={true}
          popupColor="#399b53"
        />
      ),
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
      width: 160,
      onCell: (e) => {
        return {
          onClick: () => {
            if (record?.isApprove || record?.isVoided) {
              message.error(
                "This Purchase Order is already approved/voided. Editing is disabled."
              );
            } else {
              console.log("double click");
              setEditable((prev: any) => ({
                ...prev,
                [e.id + "quantity"]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (text, obj) => {
        return editable[obj.id + "quantity"] ? (
          colInput(obj, "quantity")
        ) : (
          <span key={text}>{NumberFormaterDynamic(obj.quantity)}</span>
        );
      },
    },
    {
      title: (
        <ColumnTitle
          descripton="Unit Cost (UoP)"
          popup="Unit of Purchase"
          editable={true}
          popupColor="#399b53"
        />
      ),
      dataIndex: "unitCost",
      key: "unitCost",
      width: 160,
      align: "right",
      onCell: (e) => {
        return {
          onClick: () => {
            if (record?.isApprove || record?.isVoided) {
              message.error(
                "This Purchase Order is already approved/voided. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({
                ...prev,
                [e.id + "unitCost"]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (text, obj) => {
        return editable[obj.id + "unitCost"] ? (
          colInput(obj, "unitCost")
        ) : (
          <span key={text}>{NumberFormater(obj.unitCost)}</span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
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
          disabled={_delStatus}
          icon={<DeleteFilled />}
        />
      ),
    },
  ];

  const renderExpandableRow = (record: PurchaseOrderItemsExtended) => {
    let list = [] as PurchaseRequestItem[];
    if (prItems) {
      list = prItems.filter((itm) => record?.item?.id === itm?.item?.id);
    }
    return (
      <Table
        rowKey="id"
        locale={{
          emptyText: "No PR Selected on this item.",
        }}
        size="small"
        pagination={false}
        dataSource={list}
        columns={[
          {
            title: "PR Number",
            dataIndex: "purchaseRequest.prNo",
            width: 140,
            render: (text, record) => (
              <span key={text}>{record?.purchaseRequest?.prNo}</span>
            ),
          },
          {
            title: "Description",
            dataIndex: "item.descLong",
            render: (text, record) => (
              <span key={text}>{record?.item?.descLong}</span>
            ),
          },
          {
            title: "Unit of Measurement",
            key: "unitMeasurement",
            dataIndex: "unitMeasurement",
            width: 160,
          },
          {
            title: "Requested Quantity (UoP)",
            key: "requestedQty",
            dataIndex: "requestedQty",
            width: 190,
            render: (_, record) => {
              return NumberFormaterDynamic(record.requestedQty);
            },
          },
        ]}
      />
    );
  };

  // ========================== mappings =======================================
  //item manage
  const mapObject = (list: PurchaseRequestItem[]) => {
    let payload = record?.id ? _.clone(items) : [];
    if (!_.isEmpty(list)) {
      (list || []).map((value) => {
        let index = _.findIndex(
          payload,
          (x) => x?.item?.id === value?.item?.id
        );
        if (index < 0) {
          let obj = formatObjPrItemsToPoItems(value);
          obj.noPr = false;
          payload.push(obj);
        } else {
          payload[index]["quantity"] = _.sumBy(list, function (obj) {
            if (value?.item?.id === obj?.item?.id) {
              return obj.requestedQty;
            }
          });
          payload[index]["prNos"] = _.isEmpty(payload[index]["prNos"])
            ? value.purchaseRequest?.prNo
            : `${payload[index]["prNos"]},${value.purchaseRequest?.prNo}`;
        }
      });
      let itemIds = _.map(list, "item.id");
      if (record?.id) {
        //removes items to database
        let tobeRemove = _.filter(payload, function (o) {
          //remove item where not included in PR items
          return !_.includes(itemIds, o?.item?.id) && !_.isEmpty(o.prNos);
        });
        if (!_.isEmpty(tobeRemove)) {
          //remove query if naay sulod
          setForRemove([...forRemove, ...tobeRemove]);
        }
      }
      payload = _.filter(payload, function (o) {
        //remove item where not included in PR items
        return _.includes(itemIds, o?.item?.id);
      });
    } else {
      payload = [];
    }
    return payload;
  };

  // ================= useMemo / useEffects ========================

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

  // ================= UI ========================
  return (
    <FullScreenModal
      hide={() => hide(false)}
      allowFullScreen={true}
      icon={<ShoppingOutlined />}
      title="Purchase Order Details"
      extraTitle={record?.poNumber}
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
                <p>Prepared By: {preparedBy}</p>
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
            prNos: record?.prNos ? record.prNos.split(",") : [],
            preparedDate: dayjs(record?.preparedDate ?? new Date()),
            etaDate: dayjs(record?.etaDate ?? new Date()),
            supplier: selectInValueInit(record?.id, "supplier"),
            project: record?.project?.id ?? null,
            assets: record?.assets?.id ?? null,
            category: record?.category ?? poCategory,
          }}>
          <Row gutter={[16, 0]}>
            <Col {...responsiveColumn4}>
              <FormDatePicker
                label="Purchase Order Date"
                name="preparedDate"
                rules={requiredField}
                propsdatepicker={{
                  allowClear: false,
                }}
              />
              <FormDatePicker
                label="ETA Date"
                name="etaDate"
                rules={requiredField}
                propsdatepicker={{
                  allowClear: false,
                  placeholder: "ETA Date",
                }}
              />
              <FormSelect
                label="Terms of Payment"
                name="paymentTerms"
                rules={requiredField}
                propsselect={{
                  options: paymentTerms,
                  allowClear: true,
                  placeholder: "Terms of Payment",
                }}
              />
              <FormDebounceSelect
                name="supplier"
                label="Filter Supplier"
                defaultSearchLabel={record?.supplier?.supplierFullname ?? ""}
                rules={requiredField}
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
                label="Purchase Category"
                rules={requiredField}
                propsselect={{
                  options: PURCHASE_CATEGORY,
                  allowClear: true,
                  onChange: (e) => {
                    setCategory(e);
                  },
                  placeholder: "Purchase Category",
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
          <Divider plain>Purchase Order Items</Divider>
          <Card
            bordered={false}
            style={{ boxShadow: "none" }}
            styles={{
              header: { border: 0 },
              body: { padding: 0 },
            }}
            title={
              <div className="pr-selector">
                <FormSelect
                  label="Select Purchase Request(s)"
                  name="prNos"
                  propsselect={{
                    mode: "multiple",
                    options: prNumberList,
                    onChange: (e) => {
                      setPrNo(e);
                      getPrItems(e);
                    },
                    allowClear: true,
                    placeholder: "Select Purchase Request",
                  }}
                />
              </div>
            }
            extra={[
              <Button
                className="btn-order"
                type="primary"
                icon={<ShoppingCartOutlined />}
                disabled={
                  ((record?.isApprove || record?.isVoided) ?? false) ||
                  !_.isEmpty(prNo)
                }
                onClick={onOrderItems}>
                Order Item
              </Button>,
            ]}>
            <Table
              rowKey="id"
              expandable={{
                expandedRowRender: renderExpandableRow,
              }}
              columns={columns}
              dataSource={items}
              size="small"
              loading={loading || removeLoading || prItemsLoading}
              scroll={{ x: 1250 }}
              pagination={false}
            />
          </Card>
        </Form>
      </CustomCSS>
    </FullScreenModal>
  );
}

const CustomCSS = styled.div`
  thead > tr > td.ant-table-cell.ant-table-row-expand-icon-cell,
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

  .header-container {
    margin-bottom: 5px;
  }

  .pr-selector {
    width: 99% !important;
  }

  .btn-order {
    margin-top: 18px;
  }

  @media (max-width: 991px) {
    .ant-card-head-title {
      width: 100% !important;
    }

    .pr-selector {
      width: 100% !important;
    }

    .btn-order {
      margin-top: 0px;
      margin-bottom: 5px;
    }

    .ant-card .ant-card-head-wrapper {
      flex-direction: column !important;
    }
  }
`;
