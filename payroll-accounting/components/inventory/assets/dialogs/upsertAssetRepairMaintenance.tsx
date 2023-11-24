import {
  AssetRepairMaintenance,
  AssetStatus,
  AssetType,
  Assets,
  Item,
  RepairMaintenanceStatus,
  RepairServiceClassification,
  RepairServiceType,
} from "@/graphql/gql/graphql";
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
import {
  UPSERT_ASSET_RECORD,
  UPSERT_MAINTENANCE_TYPE_RECORD,
  UPSERT_REPAIR_MAINTENANCE_RECORD,
} from "@/graphql/assets/queries";

import ItemSelector from "@/components/inventory/itemSelector";
import { useMutation, useQuery } from "@apollo/client";
import { useDialog } from "@/hooks";
import _ from "lodash";
import FormDatePicker from "@/components/common/formDatePicker/formDatePicker";
import dayjs from "dayjs";

interface IProps {
  hide: (hideProps: any) => void;
  record?: AssetRepairMaintenance | null | undefined;
}

const initialRecordData = {
  serviceType: null,
  serviceClassification: null,
  workDescription: null,
  serviceDatetimeStart: null,
  serviceDatetimeFinished: null,
  findings: null,
  status: null,
};

export default function UpsertRepairMaintenanceModal(props: IProps) {
  const { hide, record } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const [initialRecord, setInitialRecord] = useState<any | null>(null);

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_REPAIR_MAINTENANCE_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          hide(data);
        }
      },
    }
  );

  useEffect(() => {
    if (record) {
      setInitialRecord({
        ...record,
        serviceDatetimeStart: dayjs(record?.serviceDatetimeStart),
        serviceDatetimeFinished: dayjs(record?.serviceDatetimeFinished),
      });
    } else {
      setInitialRecord(initialRecordData);
    }
  }, [record]);

  const onSubmit = (values: any) => {
    let payload = {
      ...values,
    };

    payload.serviceType = values?.serviceType as RepairServiceType;
    payload.serviceClassification =
      values?.serviceClassification as RepairServiceClassification;
    payload.status = values?.status as RepairMaintenanceStatus;

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

  const serviceTypeOptions = Object.values(RepairServiceType).map((item) => ({
    value: item,
    label: item.replace(/_/g, " "),
  }));

  const statusOptions = Object.values(RepairMaintenanceStatus).map((item) => ({
    value: item,
    label: item.replace(/_/g, " "),
  }));

  const serviceClassificationOptions = Object.values(
    RepairServiceClassification
  ).map((item) => ({
    value: item,
    label: item.replace(/_/g, " "),
  }));
  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`${
            record?.id ? "Edit" : "Add"
          } Maintenance Type`}</Space>
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
            form="upsertMaintenanceType"
            loading={upsertLoading}
            icon={<SaveOutlined />}
          >
            {`${record?.id ? "Save Changes" : "Save"} & Close`}
          </Button>
        </Space>
      }
    >
      {initialRecord ? (
        <>
          <Form
            name="upsertMaintenanceType"
            layout="vertical"
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            initialValues={{
              ...initialRecord,
            }}
          >
            <Row gutter={[8, 0]}>
              <Col span={12}>
                <FormSelect
                  label="Service Type"
                  rules={requiredField}
                  name="serviceType"
                  propsselect={{
                    showSearch: true,
                    options: serviceTypeOptions,
                    placeholder: "Select type",
                    allowClear: true,
                    onChange: (newValue) => {
                      //setState((prev) => ({ ...prev, type: newValue }));
                    },
                  }}
                />
              </Col>
              <Col span={12}>
                <FormSelect
                  label="Classification"
                  name="serviceClassification"
                  rules={requiredField}
                  propsselect={{
                    showSearch: true,
                    options: serviceClassificationOptions,
                    allowClear: true,
                    placeholder: "Select classification",
                    onChange: (newValue) => {
                      //setState((prev) => ({ ...prev, type: newValue }));
                    },
                  }}
                />
              </Col>

              <Col span={24}>
                <FormInput
                  name="workDescription"
                  rules={requiredField}
                  label="Work Description"
                  propsinput={{
                    placeholder: "Work Description",
                  }}
                />
              </Col>
              <Col span={12}>
                <FormDatePicker
                  label="Service Start Date"
                  name="serviceDatetimeStart"
                  propsdatepicker={{
                    placeholder: "Select service start date",
                  }}
                />
              </Col>
              <Col span={12}>
                <FormDatePicker
                  label="Service Finish Date"
                  name="serviceDatetimeFinished"
                  propsdatepicker={{
                    placeholder: "Select service start date",
                  }}
                />
              </Col>
              <Col span={24}>
                <FormInput
                  name="findings"
                  label="Findings"
                  propsinput={{
                    placeholder: "Findings",
                  }}
                />
              </Col>
              <Col span={12}>
                <FormSelect
                  label="Status"
                  name="status"
                  propsselect={{
                    showSearch: true,
                    options: statusOptions,
                    allowClear: true,
                    placeholder: "Select status",
                    onChange: (newValue) => {
                      //setState((prev) => ({ ...prev, type: newValue }));
                    },
                  }}
                />
              </Col>
            </Row>
          </Form>
        </>
      ) : (
        <></>
      )}
    </Modal>
  );
}
