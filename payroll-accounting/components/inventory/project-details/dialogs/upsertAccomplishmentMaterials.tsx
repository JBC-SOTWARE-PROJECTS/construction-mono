import React, { useContext, useEffect, useState } from "react";
import {
  InventoryInfoDto,
  Item,
  ProjectUpdatesMaterials,
  Query,
} from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  App,
  Spin,
  Alert,
} from "antd";
import _ from "lodash";
import { requiredField } from "@/utility/helper";
import { FormTextArea } from "@/components/common";
import dayjs from "dayjs";
import {
  GET_INVENTORY_INFO,
  UPSERT_RECORD_PROJECT_ACCOMPLISHMENT_MATERIALS,
} from "@/graphql/inventory/project-queries";
import FormDebounceSelect from "@/components/common/formDebounceSelect/formDebounceSelect";
import { GET_ACTIVE_ITEM } from "@/graphql/inventory/masterfile-queries";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";

interface InfoInterface {
  type?: "success" | "info" | "warning" | "error";
  message?: string | null;
  submitDisabled?: boolean;
}

interface IProps {
  hide: (hideProps: any) => void;
  record?: ProjectUpdatesMaterials | null | undefined;
  projectId?: string;
  projectUpdateId?: string;
  officeId?: string;
}

export default function UpsertAccomplishmentMaterials(props: IProps) {
  const { message } = App.useApp();
  const { hide, record, projectId, officeId, projectUpdateId } = props;
  const [item, setItem] = useState<Item>({} as Item);
  const [info, setInfo] = useState<InfoInterface>({
    type: "error",
    message: "",
    submitDisabled: true,
  });
  const [form] = Form.useForm();

  // ===================== Queries ==============================
  const [getInventoryInfo, { loading: inventoryLoading }] = useLazyQuery<Query>(
    GET_INVENTORY_INFO,
    {
      onCompleted: (data) => {
        let info = data?.getInventoryInfo as InventoryInfoDto;

        if (info?.id) {
          setItem(info.item as Item);
          if (info.onHand && info.cost) {
            setInfo({
              type: "info",
              message: "",
              submitDisabled: false,
            });
          } else {
            setInfo({
              type: "error",
              message:
                "Ensure that both the on-hand quantity and unit cost are not zero for the respective item.",
              submitDisabled: true,
            });
          }

          if (!record?.id) {
            let balance = info.onHand ? info.onHand - 1 : 0;
            form.setFieldValue("onHand", info.onHand);
            form.setFieldValue("cost", info.cost);
            form.setFieldValue("qty", balance ? 1 : 0);
            form.setFieldValue("balance", balance);
          }
        }
      },
    }
  );

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_PROJECT_ACCOMPLISHMENT_MATERIALS,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.upsertProjectMaterials?.success) {
          hide(data?.upsertProjectMaterials?.message);
        } else {
          message.error(data?.upsertProjectMaterials?.message);
        }
      },
    }
  );

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (data: any) => {
    let payload = _.clone(data);
    payload.project = projectId;
    payload.projectUpdates = projectUpdateId;
    if (record?.id) {
      payload.item = record?.item?.id;
    }
    upsertRecord({
      variables: {
        id: record?.id,
        fields: payload,
      },
    });
  };

  const onChangeQty = (qty: number) => {
    const { setFieldValue, getFieldValue } = form;
    if (qty) {
      let onHand = Number(getFieldValue("onHand"));
      if (qty <= onHand) {
        setFieldValue("balance", onHand - qty);
      } else {
        setFieldValue("qty", onHand);
      }
    } else {
      setFieldValue("qty", 1);
    }
  };

  useEffect(() => {
    if (record?.id) {
      getInventoryInfo({
        variables: {
          office: officeId,
          itemId: record?.item?.id,
        },
      });
    }
  }, []);

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`${
            record?.id ? "Edit" : "Add"
          } Material`}</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "500px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="upsertForm"
            loading={upsertLoading}
            disabled={info.submitDisabled}
            icon={<SaveOutlined />}>
            {`${record?.id ? "Save Changes" : "Save"} & Close`}
          </Button>
        </Space>
      }>
      <Form
        form={form}
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...record,
          item: record?.item,
        }}>
        <Spin spinning={inventoryLoading}>
          <Row gutter={[8, 0]}>
            {!record?.id && (
              <Col span={24}>
                <FormDebounceSelect
                  label="Select Item"
                  name="item"
                  rules={requiredField}
                  propsselect={{
                    allowClear: true,
                    placeholder: "Select Item",
                    fetchOptions: GET_ACTIVE_ITEM,
                    disabled: !_.isEmpty(record?.id),
                    onChange: (newValue) => {
                      form.setFieldValue("item", newValue?.value);
                      getInventoryInfo({
                        variables: {
                          office: officeId,
                          itemId: newValue?.value,
                        },
                      });
                    },
                  }}
                />
              </Col>
            )}
            {item?.id && (
              <Col span={24}>
                <Alert
                  type={info.type ?? "info"}
                  message={
                    <div className="w-full">
                      <p>
                        <span className="font-bold">
                          Item Description:&nbsp;
                        </span>
                        <span>{item?.descLong ?? "--"}</span>
                      </p>
                      <p>
                        <span className="font-bold">Unit of Usage:&nbsp;</span>
                        <span>{item?.unitOfUsage ?? "--"}</span>
                      </p>
                      <p>
                        <span className="font-bold">Brand:&nbsp;</span>
                        <span>{item?.brand ?? "--"}</span>
                      </p>
                      {info.message && (
                        <p>
                          <span className="font-bold">Note:&nbsp;</span>
                          <span>{info.message}</span>
                        </p>
                      )}
                    </div>
                  }
                />
              </Col>
            )}
            <Col span={24}>
              <FormInputNumber
                name="onHand"
                rules={requiredField}
                label="On Hand Qty (UoU)"
                propsinputnumber={{
                  placeholder: "Stocks (UoU)",
                  disabled: true,
                }}
              />
            </Col>
            <Col span={24}>
              <FormInputNumber
                name="cost"
                rules={requiredField}
                label="Unit Cost (UoU)"
                propsinputnumber={{
                  placeholder: "Unit Cost (UoU)",
                  disabled: true,
                }}
              />
            </Col>
            <Col span={24}>
              <FormInputNumber
                name="qty"
                rules={requiredField}
                label="Qty Used (UoU)"
                propsinputnumber={{
                  placeholder: "Unit Cost (UoU)",
                  onChange: (e) => {
                    let qty = Number(e);
                    onChangeQty(qty);
                  },
                  disabled: info.type === "error" ? true : false,
                }}
              />
            </Col>
            <Col span={24}>
              <FormInputNumber
                name="balance"
                rules={requiredField}
                label="Remaining Balance Qty (UoU)"
                propsinputnumber={{
                  placeholder: "Remaining Balance Qty (UoU)",
                  disabled: true,
                }}
              />
            </Col>
            <Col span={24}>
              <FormTextArea
                label="Remarks"
                name="remarks"
                propstextarea={{
                  rows: 4,
                  placeholder: "Remarks",
                  disabled: info.type === "error" ? true : false,
                }}
              />
            </Col>
          </Row>
        </Spin>
      </Form>
    </Modal>
  );
}
