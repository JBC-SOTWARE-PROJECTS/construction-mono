import React from "react";
import { Modal, Button, Form, Row, Col, Space, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { FormInput, FormSelect } from "@/components/common";
import { requiredField } from "@/utility/helper";
import { HolidayTransferability, HolidayType } from "@/utility/constant";
import { useMutation } from "@apollo/client";
import { CREATE_EVENT, DELETE_EVENT } from "@/graphql/company/queries";
import FormDatePicker from "@/components/common/formDatePicker/formDatePicker";
import dayjs from "dayjs";
import _ from "lodash";

interface IProps {
  hide: any;
  visible: boolean;
  selectedEvent: any;
}

interface DatePickerProps {
  startDate: dayjs.ConfigType;
  endDate: dayjs.ConfigType;
}

export default function EventModal(props: IProps) {
  const { hide, visible, selectedEvent } = props;
  const [form] = Form.useForm();

  const [upsertEvent, { loading }] = useMutation(CREATE_EVENT, {
    onCompleted: ({ data }) => {
      if (data?.success) {
        const successMessage =
          data?.message || "Successfully created event calendar.";
        message.success(successMessage);

        hide(
          null,
          true,
          {
            clearPendingEvents: true,
            isEdit: selectedEvent?.id ? true : false,
          },
          data?.payload
        );
      } else {
        const errorMessage =
          data?.message || "Failed to create event calendar.";
        message.error(errorMessage);
      }
    },
  });

  const [deleteEvent, { loading: loadingDeleteEvent }] = useMutation(
    DELETE_EVENT,
    {
      onCompleted: ({ data }) => {
        if (data?.success) {
          message.success(
            data?.message ?? "Successfully created event calendar."
          );
          hide(
            null,
            true,
            { clearPendingEvents: true, removeOneEvent: true },
            selectedEvent
          );
        } else {
          message.error(data?.message ?? "Failed created event calendar.");
        }
      },
    }
  );

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: DatePickerProps) => {
    let startDate = values?.startDate;
    let endDate = values?.endDate;
    upsertEvent({
      variables: {
        id: selectedEvent?.id ?? null,
        fields: { ...values, startDate, endDate },
      },
    });
  };

  const onDeleteEvent = () => {
    deleteEvent({
      variables: { id: selectedEvent?.id },
    });
  };

  return (
    <Modal
      title={`${selectedEvent?.id ? "Edit" : "New"} Event`}
      destroyOnClose={true}
      maskClosable={false}
      open={visible}
      width={"100%"}
      style={{ maxWidth: "600px" }}
      onCancel={() => hide(null)}
      footer={
        <Space>
          {!_.isEmpty(selectedEvent?.id) && (
            <Button
              danger
              size="large"
              style={{ marginRight: 10 }}
              onClick={onDeleteEvent}
              loading={loadingDeleteEvent}
            >
              Delete
            </Button>
          )}
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="upsertForm"
            loading={loading}
            icon={<SaveOutlined />}
          >
            Save
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          id: selectedEvent.id,
          name: selectedEvent.name,
          startDate: selectedEvent.startDate,
          endDate: selectedEvent.endDate,
          fixed: selectedEvent.fixed,
          holidayType: selectedEvent.holidayType,
        }}
      >
        <Row>
          <Col span={24}>
            <FormInput
              name="name"
              rules={requiredField}
              label="Event Title"
              propsinput={{
                placeholder: "event title",
              }}
            />
            <FormDatePicker
              name="startDate"
              label="Start Date"
              // propsDatepicker={{ format: "DD-MM-YYYY" }}
            />
            <FormDatePicker
              name="endDate"
              label="End Date"
              // propsDatepicker={{ format: "DD-MM-YYYY" }}
            />
            <FormSelect
              name="fixed"
              label="Transferability"
              rules={requiredField}
              propsselect={{
                options: HolidayTransferability,
                allowClear: true,
                placeholder: "transferability",
              }}
            />
            <FormSelect
              name="holidayType"
              label="Holiday Type"
              rules={requiredField}
              propsselect={{
                options: HolidayType,
                allowClear: true,
                placeholder: "transferability",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
