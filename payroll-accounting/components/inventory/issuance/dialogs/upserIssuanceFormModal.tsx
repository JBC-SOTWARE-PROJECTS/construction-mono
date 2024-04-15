import React, { useContext, useMemo, useState } from "react";
import { StockIssue, Query } from "@/graphql/gql/graphql";
import {
  DeleteFilled,
  ExportOutlined,
  SaveOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
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
import { NumberFormaterDynamic, requiredField } from "@/utility/helper";
import {
  FormSelect,
  FullScreenModal,
  FormDatePicker,
  FormTextArea,
} from "@/components/common";
import {
  PURCHASE_CATEGORY,
  responsiveColumn4,
  responsiveColumn42,
} from "@/utility/constant";
import {
  useAssets,
  useEmployeeByLocation,
  useInventoryAttachments,
  useTransactionTypes,
} from "@/hooks/inventory";
import styled from "styled-components";
import { AccountContext } from "@/components/accessControl/AccountContext";
import { useOffices, useProjects } from "@/hooks/payables";
import type { UploadProps } from "antd";
import { ColumnsType } from "antd/lib/table";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";
import { IFormItemIssuance } from "@/interface/inventory/inventory-form";
import { useDialog } from "@/hooks";
import { StockIssueItemsExtended } from "@/utility/inventory-helper";
import update from "immutability-helper";
import InventoryItemSelector from "@/components/inventory/inventoryItemSelector";
import DocumentUpload from "@/components/common/document-upload";
import { apiUrlPrefix } from "@/shared/settings";
import {
  DELETE_RECORD_ISSUE_ITEM,
  GET_RECORDS_ISSUANCE_ITEMS,
  UPSERT_RECORD_ISSUANCE,
} from "@/graphql/inventory/issuance-queries";
import dayjs from "dayjs";

interface IProps {
  hide: (hideProps: any) => void;
  record?: StockIssue | null | undefined;
  issueCategory: string;
  issueType: string;
}

export default function UpsertIssuanceFormModal(props: IProps) {
  const { hide, record, issueCategory, issueType } = props;
  const [form] = Form.useForm();
  const account = useContext(AccountContext);
  const [category, setCategory] = useState(record?.category ?? issueCategory);
  const [editable, setEditable] = useState<any>({});
  const [items, setItems] = useState<StockIssueItemsExtended[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [officeId, setOfficeId] = useState<string | null>(
    record?.issueTo?.id ?? null
  );
  // ====================== modals =============================
  const inventoryItems = useDialog(InventoryItemSelector);
  // ===================== Queries ==============================
  const offices = useOffices();
  const projects = useProjects({ office: null });
  const assets = useAssets();
  const transactionList = useTransactionTypes("ISSUANCE");
  const empList = useEmployeeByLocation(officeId);
  const { attachments, loadingAttachments, fetchAttachments } =
    useInventoryAttachments(record?.id);

  const { loading, refetch } = useQuery<Query>(GET_RECORDS_ISSUANCE_ITEMS, {
    variables: {
      id: record?.id,
    },
    onCompleted: (data) => {
      let result = (data?.stiItemByParent ?? []) as StockIssueItemsExtended[];
      setItems(result);
    },
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_ISSUANCE,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsertSTI?.id)) {
          let message = "Item Issuance";
          if (issueType === "EXPENSE") {
            message = "Item Expense";
          }
          if (record?.id) {
            hide(`${message} Information Updated`);
          } else {
            hide(`${message} Information Added`);
          }
        }
      },
    }
  );

  const [removeRecord, { loading: removeLoading }] = useMutation(
    DELETE_RECORD_ISSUE_ITEM,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.removeStiItem?.id)) {
          message.success("Item removed");
          refetch({
            id: record?.id,
          });
        }
      },
    }
  );

  //================== functions ====================

  const onIssueExpenseItems = () => {
    const payloadItems = _.cloneDeep(items);
    let itemIds = _.map(payloadItems, "item.id");
    let propsObject = { itemIds, formModule: "STI" };
    //show all items that is belong to this office
    inventoryItems(propsObject, (result: StockIssueItemsExtended[]) => {
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
  };

  const _delete = (record: StockIssueItemsExtended) => {
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

  const onSubmit = (data: IFormItemIssuance) => {
    let payload = { ...data } as StockIssue;
    payload.issueTo = { id: data?.issueTo };
    payload.received_by = { id: data?.received_by };
    payload.issueType = issueType;
    payload.project = null;
    payload.assets = null;
    if (data?.category === "PROJECTS") {
      payload.project = { id: data?.project };
    } else if (data?.category === "SPARE_PARTS") {
      payload.assets = { id: data?.assets };
    }
    if (_.isEmpty(record?.id)) {
      payload.issueFrom = account?.office;
      payload.issued_by = account;
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
  const onChangeArray = (record: StockIssueItemsExtended, newValue: number) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    let data = update(payload, {
      [index]: {
        issueQty: {
          $set: newValue || 0,
        },
      },
    });
    setItems(data);
  };

  const onChangeRemarks = (
    record: StockIssueItemsExtended,
    newValue: string
  ) => {
    let payload = _.clone(items);
    let index = _.findIndex(payload, ["id", record?.id]);
    let data = update(payload, {
      [index]: {
        remarks: {
          $set: newValue || null,
        },
      },
    });
    setItems(data);
  };

  // =================== init ===============================
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

  const global = useMemo(() => {
    if (issueType === "EXPENSE") {
      return {
        titleIcon: <ExportOutlined />,
        title: "Item Expense Details",
        labelOffice: "Expense Location to",
        labelClaimed: "Expense By",
        labelCategory: "Expense Category",
      };
    } else {
      return {
        titleIcon: <SwapOutlined />,
        title: "Item Issuance Details",
        labelOffice: "Issue Location to",
        labelClaimed: "Issuance Claimed By",
        labelCategory: "Issuance Category",
      };
    }
  }, [issueType]);

  const disabledForm = useMemo(() => {
    if (record?.isPosted || record?.isCancel) {
      return true;
    } else {
      return false;
    }
  }, [record]);
  // =================== columns =========================
  const columns: ColumnsType<StockIssueItemsExtended> = [
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
      dataIndex: "issueQty",
      key: "issueQty",
      align: "right",
      width: 200,
      onCell: (e) => {
        return {
          onClick: () => {
            if (disabledForm) {
              message.error(
                `This ${global.title} is already approved. Editing is disabled.`
              );
            } else {
              setEditable((prev: any) => ({
                ...prev,
                [`${e.id}-issueQty`]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (text, obj) => {
        let defaultValue = Number(text);
        return editable[`${obj.id}-issueQty`] ? (
          <InputNumber
            className="w-full"
            autoFocus
            defaultValue={defaultValue}
            onBlur={(e) => {
              let newValue = Number(e?.target?.value);
              setEditable((prev: any) => ({
                ...prev,
                [`${obj.id}-issueQty`]: false,
              }));
              onChangeArray(obj, newValue);
            }}
          />
        ) : (
          <span>{NumberFormaterDynamic(obj.issueQty)}</span>
        );
      },
    },
    {
      title: (
        <ColumnTitle
          descripton="Remarks"
          popupColor="#399b53"
          editable={true}
        />
      ),
      dataIndex: "remarks",
      key: "remarks",
      align: "right",
      width: 300,
      onCell: (e) => {
        return {
          onClick: () => {
            if (disabledForm) {
              message.error(
                `This ${global.title} is already approved. Editing is disabled.`
              );
            } else {
              setEditable((prev: any) => ({
                ...prev,
                [`${e.id}-remarks`]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (remarks, obj) => {
        return editable[`${obj.id}-remarks`] ? (
          <Input
            className="w-full"
            autoFocus
            defaultValue={remarks}
            onBlur={(e) => {
              let newValue = e?.target?.value;
              setEditable((prev: any) => ({
                ...prev,
                [`${obj.id}-remarks`]: false,
              }));
              onChangeRemarks(obj, newValue);
            }}
          />
        ) : (
          <span>{remarks}</span>
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
          disabled={disabledForm}
          icon={<DeleteFilled />}
        />
      ),
    },
  ];

  return (
    <FullScreenModal
      hide={() => hide(false)}
      allowFullScreen={true}
      icon={global.titleIcon}
      title={global.title}
      extraTitle={record?.issueNo}
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
            disabled={disabledForm || _.isEmpty(items) || upsertLoading}>
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
          disabled={disabledForm}
          initialValues={{
            ...record,
            issueDate: dayjs(record?.issueDate ?? new Date()),
            issueTo: record?.issueTo?.id ?? null,
            project: record?.project?.id ?? null,
            assets: record?.assets?.id ?? null,
            category: record?.category ?? issueCategory,
            transType: record?.transType?.id ?? null,
            received_by: record?.received_by?.id ?? null,
          }}>
          <Row gutter={[16, 0]}>
            <Col {...responsiveColumn4}>
              <FormDatePicker
                label="Transaction Date"
                name="issueDate"
                rules={requiredField}
                propsdatepicker={{
                  allowClear: false,
                }}
              />
              <FormSelect
                name="issueTo"
                label={global.labelOffice}
                rules={requiredField}
                propsselect={{
                  options: offices,
                  allowClear: true,
                  placeholder: global.labelOffice,
                  onChange: (e) => {
                    setOfficeId(e);
                  },
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
              <FormSelect
                name="received_by"
                label={global.labelClaimed}
                rules={requiredField}
                propsselect={{
                  options: empList,
                  allowClear: true,
                  placeholder: global.labelClaimed,
                }}
              />
            </Col>
            <Col {...responsiveColumn4}>
              <FormSelect
                name="category"
                label={global.labelCategory}
                rules={requiredField}
                propsselect={{
                  options: PURCHASE_CATEGORY,
                  allowClear: true,
                  onChange: (e) => {
                    setCategory(e);
                  },
                  placeholder: global.labelCategory,
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
                allowUpload={!_.isEmpty(record?.id) && !disabledForm}
                uploadProps={uploadProps}
                loading={loadingAttachments}
                uploading={uploading}
                attachments={attachments}
                fetchAttachments={fetchAttachments}
              />
            </Col>
          </Row>
          <Divider plain>
            {issueType === "EXPENSE" ? "Expense" : "Issue"} Items
          </Divider>
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
                  onClick={onIssueExpenseItems}>
                  {issueType === "EXPENSE" ? "Expense Items" : "Issue Items"}
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
