import { AssetStatus, AssetType, Assets, Item, RentalRates } from "@/graphql/gql/graphql";
import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput, FormSelect } from "@/components/common";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import { UPSERT_ASSET_RECORD, UPSERT_MAINTENANCE_TYPE_RECORD, UPSERT_RENTAL_RATES_RECORD } from "@/graphql/assets/queries";


import { useMutation, useQuery } from "@apollo/client";
import { useDialog } from "@/hooks";
import _ from "lodash";

interface IProps {
  hide: (hideProps: any) => void;
  record?: RentalRates | null | undefined;
  assetId?: string
}

const rentTypeList = ["KILOMETER", "HOUR", "BATCH"]

export default function UpsertRentalRatesModal(props: IProps) {
  const { hide, record, assetId} = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_RENTAL_RATES_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          hide(data);
        }
      },
    }
  );

  const onSubmit = (values: any) => {
    let payload = {
      ...values,
      asset: assetId
    };

    
      showPasswordConfirmation(() => {
        upsert({
          variables: {
            fields: payload,
            id: record?.id,
          },
        });
      });
    
  };

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  var rentTypeOpts = rentTypeList.map((item: string) => {
    return {
      value: item,
      label: item,
    };
  });
  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`${
            record?.id ? "Edit" : "Add"
          } Rental Rate`}</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "800px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="upsertRentalRate"
            loading={upsertLoading}
            icon={<SaveOutlined />}
          >
            {`${record?.id ? "Save Changes" : "Save"} & Close`}
          </Button>
        </Space>
      }
    >
      <Form
        name="upsertRentalRate"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...record,
        }}
      >
        <Row gutter={[8, 0]}>
          <Col span={12}>
          <FormSelect
                  name="rentType"
                  label="Rent Type"
                  rules={requiredField}
                  propsselect={{
                    options: rentTypeOpts,
                    allowClear: true,
                    placeholder: "Select rent type",
                    
                  }}
                />
          </Col>

          <Col span={12}>
            <FormInput
              name="description"
              rules={requiredField}
              label="Description"
              propsinput={{
                placeholder: "Description",
              }}
            />
          </Col>
          <Col span={12}>
            <FormInput
              name="measurement"
              rules={requiredField}
              label="Measurement"
              propsinput={{
                placeholder: "Measurement",
              }}
            />
          </Col>
          <Col span={12}>
            <FormInput
              name="unit"
              rules={requiredField}
              label="Unit"
              propsinput={{
                placeholder: "Unit",
              }}
            />
          </Col>
          <Col span={12}>
            <FormInput
              name="amount"
              rules={requiredField}
              label="Amount"
              propsinput={{
                type: "number",
                placeholder: "Amount",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
