import React, { useState } from "react";
import {
  BeginningBalance,
  Query,
  BeginningBalanceDto,
} from "@/graphql/gql/graphql";
import {
  BackwardOutlined,
  FileProtectOutlined,
  PlusSquareOutlined,
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
import { responsiveColumn3 } from "@/utility/constant";
import { FormDatePicker, FormInputNumber } from "@/components/common";
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
  GET_RECORDS_BALANCE,
  UPSERT_QTY_BEG_BALANCE,
  UPSERT_RECORD_BEG_BALANCE,
} from "@/graphql/inventory/beginning-queries";
import ButtonPosted from "../commons/buttonPosted";
import PostBeginningBalanceModal from "../post-dialogs/postBeginningBalance";


interface IProps {
  hide: (hideProps: any) => void;
  record: BeginningBalanceDto;
  office: string;
}

export default function BeginningBalanceModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, record, office } = props;
  const [parentForm] = Form.useForm();
  const [editable, setEditable] = useState<any>({});
  const postInventory = useDialog(PostBeginningBalanceModal);
  //================== queries ===================================
  const { data, loading, refetch } = useQuery<Query>(GET_RECORDS_BALANCE, {
    variables: {
      item: record?.item?.id,
      office: office,
    },
    fetchPolicy: "cache-and-network",
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_BEG_BALANCE,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.beginningBalanceInsert?.id)) {
          message.success("Beginning Balance Added");
          refetch();
          parentForm.resetFields();
        } else {
          message.error(
            "Beginning balance for the item has already been set up."
          );
          parentForm.resetFields();
        }
      },
    }
  );

  const [upsertQty, { loading: upsertQtyLoading }] = useMutation(
    UPSERT_QTY_BEG_BALANCE,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsertBegQty?.id)) {
          message.success("Beginning Balance Updated");
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
  const onSubmit = (data: BeginningBalance) => {
    let payload = _.clone(data);
    if (office) {
      payload.office = { id: office };
    }
    payload.item = { id: record?.item?.id };
    //check location
    if (!office) {
      return message.error(
        "Inventory Location Unidentified. Please contact the administrator for assistance."
      );
    }
    //check unit cost
    if (data?.unitCost <= 0) {
      return message.error("Unit cost must not be less than or equal to zero");
    }
    if (data?.quantity <= 0) {
      return message.error("Quantity must not be less than or equal to zero");
    }

    upsertRecord({
      variables: {
        fields: payload,
      },
    });
  };
  // ====================== save quantity change ========================
  const onChangeQuantity = (record: BeginningBalance, newValue: number) => {
    if (record.quantity !== newValue) {
      upsertQty({
        variables: {
          qty: newValue,
          id: record?.id,
        },
      });
    }
  };
  // ====================== post or void ===================
  const onPostOrVoidView = (
    record: BeginningBalance,
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
  const columns: ColumnsType<BeginningBalance> = [
    {
      title: "Transaction Date",
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
          <InputNumber
            autoFocus
            defaultValue={defaultValue}
            onBlur={(e) => {
              let newValue = Number(e?.target?.value);
              setEditable({ ...editable, [record.id + "quantity"]: false });
              onChangeQuantity(record, newValue);
            }}
          />
        ) : (
          <span key={text}>{NumberFormaterNoDecimal(record.quantity)}</span>
        );
      },
    },
    {
      title: (
        <ColumnTitle descripton="Unit Cost (UoU)" popup="Unit of Usage" />
      ),
      dataIndex: "unitCost",
      key: "unitCost",
      width: 150,
      align: "right",
      render: (unitCost) => <span>{NumberFormater(unitCost)}</span>,
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
        );
      },
    },
  ];

  // ============================= UI =======================================
  return (
    <FullScreenModal
      hide={hide}
      allowFullScreen={true}
      icon={<PlusSquareOutlined />}
      title="Setup Beginning Balance"
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
          unit_cost: 0,
        }}>
        <Row gutter={[8, 0]}>
          <Col {...responsiveColumn3}>
            <FormDatePicker
              label="Transaction Date"
              name="dateTrans"
              rules={requiredField}
              propsdatepicker={{
                allowClear: false,
              }}
            />
          </Col>
          <Col {...responsiveColumn3}>
            <FormInputNumber
              label="Quantity (UoU)"
              name="quantity"
              rules={requiredField}
              propsinputnumber={{
                placeholder: "Quantity (+ -)",
              }}
            />
          </Col>
          <Col {...responsiveColumn3}>
            <FormInputNumber
              label="Unit Cost (UoU)"
              name="unitCost"
              rules={requiredField}
              propsinputnumber={{
                placeholder: "Unit Cost (UoU)",
              }}
            />
          </Col>
          <Col span={24}>
            <Button
              type="primary"
              htmlType="submit"
              form="upsertForm"
              loading={upsertLoading}
              disabled={upsertLoading}
              icon={<SaveOutlined />}
              block>
              Save Beginning Balance
            </Button>
          </Col>
        </Row>
      </Form>
      {/*  */}
      <Divider plain>Transaction Details</Divider>
      <Row>
        <Col span={24}>
          <Table
            rowKey="id"
            size="small"
            dataSource={data?.beginningListByItem as BeginningBalance[]}
            loading={loading || upsertQtyLoading}
            columns={columns}
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
