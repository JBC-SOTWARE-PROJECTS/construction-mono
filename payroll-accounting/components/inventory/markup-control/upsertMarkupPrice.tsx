import React, { useState } from "react";
import { MarkupItemDto } from "@/graphql/gql/graphql";
import { DownOutlined, SaveOutlined, SyncOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  App,
  Tag,
  Dropdown,
  Alert,
} from "antd";
import _ from "lodash";
import { decimalRound2, requiredField } from "@/utility/helper";
import { FormInputNumber } from "@/components/common";
import { UPSERT_REMARKS_ADJUSTMENT } from "@/graphql/inventory/adjustments-queries";
import type { MenuProps } from "antd";
import { useConfirmationPasswordHook } from "@/hooks";
import {
  UPSERT_RECORD_MARKUP_PRICE,
  UPSERT_RECORD_MARKUP_PRICE_SYNC,
} from "@/graphql/inventory/markup-queries";

interface IProps {
  hide: (hideProps: any) => void;
  record: MarkupItemDto;
  office: string;
}

const items: MenuProps["items"] = [
  {
    label: "Save and Sync on all Location",
    key: "sync",
  },
];

export default function UpsertMarkupPrice(props: IProps) {
  const { message } = App.useApp();
  const { hide, record } = props;
  const [form] = Form.useForm();
  const [action, setAction] = useState<string | null>(null);
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  // ===================== Queries ==============================

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD_MARKUP_PRICE,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.updateMarkupPrice?.id) {
          hide("Selling Price updated");
        } else {
          message.error("Something went wrong. Please contact administrator.");
        }
      },
    }
  );

  const [upsertRecordSync, { loading: upsertLoadingSync }] = useMutation(
    UPSERT_RECORD_MARKUP_PRICE_SYNC,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.updateMarkupPriceSync?.id) {
          hide("Selling Price updated and Sync on all Locations");
        } else {
          message.error("Something went wrong. Please contact administrator.");
        }
      },
    }
  );

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onChangeActualPrice = (actualCost: number) => {
    const { setFieldValue, getFieldValue } = form;
    const sellingPrice = getFieldValue("sellingPrice") as number;
    let rate = 0.0;
    if (actualCost && sellingPrice) {
      let lprice = actualCost;
      let sprice = sellingPrice - actualCost;
      rate = (sprice / lprice) * 100;
    }
    // ================ save ======================
    setFieldValue("markup", decimalRound2(rate));
  };

  const onChangeSellingPrice = (sellingPrice: number) => {
    const { setFieldValue, getFieldValue } = form;
    const actualCost = getFieldValue("actualCost") as number;
    let rate = 0.0;
    if (actualCost && sellingPrice) {
      let lprice = actualCost;
      let sprice = sellingPrice - actualCost;
      rate = (sprice / lprice) * 100;
    }
    // ================ save ======================
    setFieldValue("markup", decimalRound2(rate));
  };

  const onSubmit = (data: MarkupItemDto) => {
    showPasswordConfirmation(() => {
      if (action === "sync") {
        upsertRecordSync({
          variables: {
            item: record?.item,
            actualCost: data?.actualCost ?? 0,
            sellingPrice: data?.sellingPrice ?? 0,
          },
        });
      } else if (action === "save") {
        upsertRecord({
          variables: {
            id: record?.id,
            actualCost: data?.actualCost ?? 0,
            sellingPrice: data?.sellingPrice ?? 0,
          },
        });
      }
    });
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            Markup Control <Tag color="magenta">{record?.descLong}</Tag>
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "700px" }}
      onCancel={() => hide(false)}
      footer={
        <Space style={{ width: "100%" }} direction="vertical">
          <Button
            block
            size="large"
            htmlType="submit"
            form="markupControlForm"
            loading={upsertLoading}
            disabled={upsertLoading || upsertLoadingSync}
            onClick={() => setAction("save")}
            icon={<SaveOutlined />}>
            Save Price Only on this Location
          </Button>
          <Button
            block
            type="primary"
            size="large"
            htmlType="submit"
            form="markupControlForm"
            loading={upsertLoadingSync}
            disabled={upsertLoadingSync || upsertLoading}
            onClick={() => setAction("sync")}
            icon={<SyncOutlined />}>
            Save Price and Sync on all Location
          </Button>
        </Space>
      }>
      <Form
        form={form}
        name="markupControlForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...record,
          actualCost: !record?.actualCost
            ? record?.lastUnitCost
            : record?.actualCost,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Alert type="info" message={`Current Location: `} />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Last Purchase Cost (UoU)"
              name="lastUnitCost"
              propsinputnumber={{
                placeholder: "Last Purchase Cost (UoU)",
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                readOnly: true,
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Acutal Unit Cost"
              name="actualCost"
              rules={requiredField}
              propsinputnumber={{
                placeholder: "Acutal Unit Cost",
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                onChange: (e) => {
                  let value = Number(e);
                  onChangeActualPrice(value);
                },
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Markup (%)"
              name="markup"
              rules={requiredField}
              propsinputnumber={{
                placeholder: "Markup (%)",
                readOnly: true,
              }}
            />
          </Col>
          <Col span={24}>
            <FormInputNumber
              label="Selling Price (w/ VAT)"
              name="sellingPrice"
              rules={requiredField}
              propsinputnumber={{
                placeholder: "Selling Price (w/ VAT)",
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                onChange: (e) => {
                  let value = Number(e);
                  onChangeSellingPrice(value);
                },
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
