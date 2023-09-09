import FormCheckBox from "@/components/common/formCheckBox/formCheckBox";
import FormInput from "@/components/common/formInput/formInput";
import FormSelect from "@/components/common/formSelect/formSelect";
import FormTimePicker from "@/components/common/formTimePicker/formTimePicker";
import { Schedule } from "@/graphql/gql/graphql";
import { requiredField } from "@/utility/helper";
import { SaveOutlined } from "@ant-design/icons";
import { gql, useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Space,
  TimePicker,
  message,
} from "antd";
import dayjs from "dayjs";
import React from "react";
const colSpan2 = {
  xs: 24,
  md: 12,
};

const ADD_DEPARTMENT_SCHEDULE = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertScheduleType(id: $id, fields: $fields) {
      payload {
        id
      }
      success
      message
    }
  }
`;

interface IProps {
  hide: (hideProps: any) => void;
  record?: Schedule | null | undefined;
}
function UpsertScheduleType(props: IProps) {
  const { hide, record } = props;

  const [upsertSchedule, { loading: loadingUpsertSchedule }] = useMutation(
    ADD_DEPARTMENT_SCHEDULE,
    {
      onCompleted: (value: any) => {
        const data = value?.data || {};
        if (data?.success) {
          message.success(
            data?.message ?? "Successfully created department schedule"
          );
          hide(false);
          // props?.handleModal({}, true);
        } else {
          message.error(
            data?.message ?? "Failed to create department schedule"
          );
          hide(false);
        }
      },
    }
  );

  const onSubmit = (values: any) => {
    let payload = { ...values };
    payload.dateTimeStart = dayjs(values.dateTimeStart);
    payload.dateTimeEnd = dayjs(values.dateTimeEnd);
    payload.mealBreakStart = dayjs(values.mealBreakStart);
    payload.mealBreakEnd = dayjs(values.dateStart);
    console.log(payload);
    upsertSchedule({ variables: { fields: values, id: record?.id } });
  };
  return (
    <Modal
      open
      onCancel={() => {
        hide(false);
      }}
      title={"Work Schedule"}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="upsertForm"
            loading={loadingUpsertSchedule}
            icon={<SaveOutlined />}
          >
            Save
          </Button>
        </Space>
      }
    >
      <Form
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          ...record,
          dateTimeStartRaw: dayjs(record?.dateTimeStartRaw),
          dateTimeEndRaw: dayjs(record?.dateTimeEndRaw),
          mealBreakStart: dayjs(record?.mealBreakStart),
          mealBreakEnd: dayjs(record?.mealBreakEnd),
        }}
      >
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormInput
              name="title"
              rules={requiredField}
              label="Title"
              propsinput={{
                placeholder: "Title",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="label"
              rules={requiredField}
              label="Label"
              propsinput={{
                placeholder: "Label",
              }}
            />
          </Col>
          <Col {...colSpan2}>
            <FormTimePicker
              name="dateTimeStartRaw"
              label="Start Time"
              propstimepicker={{ format: "hh:mm a", use12Hours: true }}
            />
          </Col>{" "}
          <Col {...colSpan2}>
            <FormTimePicker
              name="dateTimeEndRaw"
              label="End Time"
              propstimepicker={{ format: "hh:mm a", use12Hours: true }}
            />
          </Col>
          <Col {...colSpan2}>
            <FormTimePicker
              name="mealBreakStart"
              label="Meal Break Start"
              propstimepicker={{ format: "hh:mm a", use12Hours: true }}
            />
          </Col>
          <Col {...colSpan2}>
            <FormTimePicker
              name="mealBreakEnd"
              label="Meal Break End"
              propstimepicker={{ format: "hh:mm a", use12Hours: true }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default UpsertScheduleType;
