import {
  AssetMaintenanceTypes,
  AssetPreventiveMaintenance,
  AssetStatus,
  AssetType,
  Assets,
  Item,
  PreventiveScheduleType,
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
  TimePicker,
  Typography,
  message,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput, FormSelect } from "@/components/common";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import { UPSERT_PREVENTIVE_MAINTENANCE_RECORD } from "@/graphql/assets/queries";
import useGetAssetMaintenanceType from "@/hooks/asset/useGetAssetMaintenanceType";
import ItemSelector from "@/components/inventory/itemSelector";
import { useMutation, useQuery } from "@apollo/client";
import { useDialog } from "@/hooks";
import _ from "lodash";
import { useRouter } from "next/router";
import FormTimePicker from "@/components/common/formTimePicker/formTimePicker";
import { FormDatePicker } from "@/components/common";
import moment from "moment";
import dayjs from "dayjs";
interface IProps {
  hide: (hideProps: any) => void;
  record?: AssetPreventiveMaintenance | null | undefined;
}

const dayList = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const OccurrenceComponent = ({ schedType }: { schedType: String }) => {
  var dayListOpts = dayList.map((item: string) => {
    return {
      value: item,
      label: item,
    };
  });

  switch (schedType) {
    case "DAILY":
      return (
        <Col span={12}>
          <FormTimePicker
            rules={requiredField}
            name="occurrence"
            label="Occurrence (Daily)"
            propstimepicker={{ format: "hh:mm a", use12Hours: true }}
          />
        </Col>
      );
      break;
    case "WEEKLY":
      return (
        <Col span={12}>
          <FormSelect
            name="occurrence"
            label="Occurrence (Weekly)"
            rules={requiredField}
            propsselect={{
              options: dayListOpts,
              allowClear: true,
              placeholder: "Select day",
            }}
          />
        </Col>
      );
      break;
    case "MONTHLY":
      return (
        <Col span={12}>
          <FormInput
            name="occurrence"
            rules={requiredField}
            label="Occurrence (Monthly)"
            propsinput={{
              placeholder: "Occurrence",
              type: "number",
              max: 31,
              min: 1,
            }}
          />
        </Col>
      );
      break;
    case "YEARLY":
      return (
        <Col span={12}>
          <FormDatePicker
            label="Occurrence (Yearly)"
            name="occurrence"
            rules={requiredField}
            propsdatepicker={{
              placeholder: "Select date",
            }}
          />
        </Col>
      );
      break;

    default:
      break;
  }
};

const preventiveSchedOptions = Object.values(PreventiveScheduleType).map(
  (item) => ({
    value: item,
    label: item.replace(/_/g, " "),
  })
);

const preventiveSchedArray = Object.values(PreventiveScheduleType).map(
  (item) => item
);

const initialRecordData: any = {
  occurrence: null,
  scheduleType: null,
  reminderSchedule: null,
  assetMaintenanceType: null,
};

export default function UpsertPreventiveMaintenanceModal(props: IProps) {
  const { hide, record } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const [selectedScheduleType, setSelectedScheduleType] =
    useState<String | null>(null);
  const [initialRecord, setInitialRecord] = useState<any | null>(null);
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    setSelectedScheduleType(
      record?.scheduleType ?? PreventiveScheduleType.Yearly
    );

    if (record) {
      var formatDate: any = record?.occurrence;

      var allExistSchdType = [
        PreventiveScheduleType.Daily,
        PreventiveScheduleType.Yearly,
      ].every((item) =>
        preventiveSchedArray.includes(item as PreventiveScheduleType)
      );

      var recSchdType = record?.scheduleType as PreventiveScheduleType;

      if (allExistSchdType) {
        //let dateRaw = moment(record?.occurrence);

        if (recSchdType == PreventiveScheduleType.Daily) {
          formatDate = moment(record?.occurrence, 'hh:mm:ss a');
        } else if (recSchdType == PreventiveScheduleType.Yearly) {
          formatDate = dayjs(record?.occurrence ?? new Date());
        }
      }

      if (recSchdType == "MONTHLY") {
        formatDate = parseInt(record?.occurrence ?? "0");
      }


      setInitialRecord({
        ...record,
        occurrence:formatDate ,
        assetMaintenanceType: record?.assetMaintenanceType?.id,
      });
    } else {
      setInitialRecord(initialRecordData);
    }
  }, [record]);

  const [maintenanceTypeData, loading, refetch] = useGetAssetMaintenanceType({
    variables: {
      filter: "",
      page: 0,
      size: 100,
    },
    fetchPolicy: "network-only",
  });

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_PREVENTIVE_MAINTENANCE_RECORD,
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
    };

    var formattedOccurrence = values?.occurrence;

    if (values?.scheduleType == "DAILY") {
      formattedOccurrence = values?.occurrence?.format("hh:mm:ss a");
    }

    if (values?.scheduleType == "YEARLY") {
      formattedOccurrence = values?.occurrence?.format("YYYY-MM-DD");
    }
    
    
    payload.occurrence = formattedOccurrence;
    payload.scheduleType = values?.scheduleType as AssetMaintenanceTypes;
    payload.asset = router?.query?.id;

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

  var maintenanceTypeOpts = maintenanceTypeData?.content?.map(
    (item: AssetMaintenanceTypes) => {
      return {
        value: item.id,
        label: item.description?.toLocaleUpperCase(),
      };
    }
  );

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`${
            record?.id ? "Edit" : "Add"
          } Preventive Maintenance`}</Space>
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
            form="upsertAsset"
            // loading={upsertLoading}
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
            form={form}
            name="upsertAsset"
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
                  name="scheduleType"
                  label="Schedule Type"
                  rules={requiredField}
                  propsselect={{
                    options: preventiveSchedOptions,
                    allowClear: true,
                    placeholder: "Select schedule type",
                    onChange: (item) => {
                      setSelectedScheduleType(item);
                    },
                  }}
                />
              </Col>

              {selectedScheduleType ? (
                <OccurrenceComponent schedType={selectedScheduleType} />
              ) : (
                <></>
              )}

              <Col span={12}>
                <FormInput
                  name="reminderSchedule"
                  rules={requiredField}
                  label="Reminder Schedule (Hrs/Days before the occurence)"
                  propsinput={{
                    placeholder: "Set reminder schedule",
                  }}
                />
              </Col>

              <Col span={12}>
                <FormSelect
                  name="assetMaintenanceType"
                  label="Maintenance Type"
                  rules={requiredField}
                  propsselect={{
                    showSearch: true,
                    options: maintenanceTypeOpts,
                    allowClear: true,
                    placeholder: "Set maintenance type",
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
