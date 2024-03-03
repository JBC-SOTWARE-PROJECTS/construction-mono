import FormInput from "@/components/common/formInput/formInput";
import FormSelect from "@/components/common/formSelect/formSelect";
import FormTimePicker from "@/components/common/formTimePicker/formTimePicker";
import { EmployeeSchedule } from "@/graphql/gql/graphql";
import { IUpsertEmployeeScheduleParams } from "@/hooks/employee-schedule/useUpsertEmployeeSchedule";
import { requiredField, transformDate } from "@/utility/helper";
import { EditOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Button, Col, Form, Modal, Row, Space } from "antd";
import dayjs from "dayjs";
import { Maybe } from "graphql/jsutils/Maybe";
import { useState } from "react";
import { GET_ACTIVE_PROJECTS } from "../../configurations/UpsertScheduleType";
const colSpan2 = {
  xs: 24,
  md: 12,
};

interface IProps {
  refetchEmployes: () => void;
  employeeSchedule?: Maybe<EmployeeSchedule>;
  currentDate: dayjs.Dayjs;
  employeeId: string;
  loading: boolean;
  isOvertime?: boolean;
  upsertEmployeeSchedule: ({
    variables,
  }: IUpsertEmployeeScheduleParams) => void;
}

function UpsertEmployeeScheduleModal({
  upsertEmployeeSchedule,
  employeeSchedule,
  currentDate,
  employeeId,
  loading,
  isOvertime = false,
}: IProps) {
  const [visible, setVisible] = useState(false);
  const {
    loading: loadingProjects,
    error,
    data: projects,
  } = useQuery(GET_ACTIVE_PROJECTS);
  const onSubmit = (values: any) => {
    const fields = {
      dateTimeStart: transformDate(currentDate, values?.dateTimeStart),
      dateTimeEnd: transformDate(currentDate, values?.dateTimeEnd),
      mealBreakStart: values?.mealBreakStart
        ? transformDate(currentDate, values?.mealBreakStart)
        : null,
      mealBreakEnd: values?.mealBreakEnd
        ? transformDate(currentDate, values?.mealBreakEnd)
        : null,
      label: values?.label,
      title: values?.title,
      isCustom: true,
      isOvertime,
      overtimeType: values?.overtimeType,
      project_id: values.project_id,
    };

    upsertEmployeeSchedule({
      variables: {
        employeeId: employeeId,
        id: employeeSchedule?.id,
        fields: fields,
      },
    });
    setVisible(false);
  };
  const [form] = Form.useForm();
  const overtimeType = Form.useWatch("overtimeType", form);
  return (
    <>
      <Button
        icon={employeeSchedule ? <EditOutlined /> : <PlusOutlined />}
        type="default"
        onClick={() => {
          setVisible(true);
        }}
      >
        {employeeSchedule ? "Edit" : "Add"}
      </Button>
      <Modal
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        maskClosable={false}
        width={"40vw"}
        title={`${employeeSchedule ? "Edit" : "Add"} Employee Schedule`}
        footer={
          <Space>
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
          name="upsertForm"
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          initialValues={{
            ...employeeSchedule,
            project_id: employeeSchedule?.project?.id,
            dateTimeStart:
              employeeSchedule?.dateTimeStart &&
              dayjs(employeeSchedule?.dateTimeStart),
            dateTimeEnd:
              employeeSchedule?.dateTimeEnd &&
              dayjs(employeeSchedule?.dateTimeEnd),
            mealBreakStart:
              employeeSchedule?.mealBreakStart &&
              dayjs(employeeSchedule?.mealBreakStart),
            mealBreakEnd:
              employeeSchedule?.mealBreakEnd &&
              dayjs(employeeSchedule?.mealBreakEnd),
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
            <Col span={24}>
              <FormSelect
                name="project_id"
                label="Project"
                initialValue={null}
                propsselect={{
                  options: [
                    { value: null, label: "Office Based" },
                    ...(projects
                      ? projects?.list?.map((item: any) => ({
                          value: item.id,
                          label: item.description,
                        }))
                      : []),
                  ],
                  allowClear: true,
                  placeholder: "Select Project",
                }}
              />
            </Col>
            {isOvertime && (
              <Col span={24}>
                <FormSelect
                  label="Overtime Type"
                  name="overtimeType"
                  rules={requiredField}
                  propsselect={{
                    showSearch: true,
                    options: [
                      {
                        label: "Fixed",
                        value: "FIXED",
                      },
                      {
                        label: "Flexible",
                        value: "FLEXIBLE",
                      },
                    ],
                    placeholder: "Overtime Type",
                  }}
                />
              </Col>
            )}
            {(!isOvertime || overtimeType === "FIXED") && (
              <>
                <Col {...colSpan2}>
                  <FormTimePicker
                    name="dateTimeStart"
                    label="Start Time"
                    propstimepicker={{ format: "hh:mm a", use12Hours: true }}
                  />
                </Col>{" "}
                <Col {...colSpan2}>
                  <FormTimePicker
                    name="dateTimeEnd"
                    label="End Time"
                    propstimepicker={{ format: "hh:mm a", use12Hours: true }}
                  />
                </Col>
              </>
            )}

            {!isOvertime && (
              <>
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
              </>
            )}
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default UpsertEmployeeScheduleModal;
