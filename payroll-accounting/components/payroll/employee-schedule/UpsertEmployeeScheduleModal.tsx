import { EmployeeSchedule, Schedule } from "@/graphql/gql/graphql";
import useGetEmployeeScheduleDetails from "@/hooks/employee-schedule/useGetEmployeeScheduleDetails";
import { IState } from "@/routes/administrative/Employees";
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  List,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { IEmployee } from "./ScheduleCell";
import { PageHeader } from "@ant-design/pro-components";
import ScheduleCard from "@/components/common/ScheduleCard";
import CustomButton from "@/components/common/CustomButton";
import { EditOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import useUpsertEmployeeSchedule, {
  IUpsertEmployeeScheduleParams,
} from "@/hooks/employee-schedule/useUpsertEmployeeSchedule";
import FormInput from "@/components/common/formInput/formInput";
import { requiredField, transformDate } from "@/utility/helper";
import FormTimePicker from "@/components/common/formTimePicker/formTimePicker";
import { Maybe } from "graphql/jsutils/Maybe";
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

  const onSubmit = (values: EmployeeSchedule) => {
    const fields = {
      dateTimeStart: transformDate(currentDate, values?.dateTimeStart),
      dateTimeEnd: transformDate(currentDate, values?.dateTimeEnd),
      mealBreakStart: transformDate(currentDate, values?.mealBreakStart),
      mealBreakEnd: transformDate(currentDate, values?.mealBreakEnd),
      label: values?.label,
      title: values?.title,
      isCustom: true,
      isOvertime,
    };

    upsertEmployeeSchedule({
      variables: {
        employeeId: employeeId,
        id: employeeSchedule?.id,
        fields: fields,
      },
    });
    debugger;

    setVisible(false);
  };
  console.log(employeeSchedule);
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
          layout="vertical"
          onFinish={onSubmit}
          initialValues={{
            ...employeeSchedule,
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