import { EmployeeSchedule, Schedule } from "@/graphql/gql/graphql";
import useGetEmployeeScheduleDetails from "@/hooks/employee-schedule/useGetEmployeeScheduleDetails";
import { IState } from "@/routes/administrative/Employees";
import {
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
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import useUpsertEmployeeSchedule from "@/hooks/employee-schedule/useUpsertEmployeeSchedule";
import FormInput from "@/components/common/formInput/formInput";
import { requiredField } from "@/utility/helper";
import FormTimePicker from "@/components/common/formTimePicker/formTimePicker";
const colSpan2 = {
  xs: 24,
  md: 12,
};

interface IProps {
  hide: (hideProps: any) => void;
  refetchEmployes: () => void;
  employee: IEmployee;
  currentDate: dayjs.Dayjs;
}

const initialState: IState = {
  filter: "",
  status: true,
  page: 0,
  size: 10,
  office: null,
  position: null,
};

function EditEmployeeScheduleModal({
  hide,
  refetchEmployes,
  employee,
  currentDate,
}: IProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <CustomButton
        icon={<EditOutlined />}
        onClick={() => {
          setVisible(true);
        }}
        type="default"
      >
        Edit
      </CustomButton>
      <Modal
        open={visible}
        onCancel={() => {
          hide(false);
        }}
        maskClosable={false}
        width={"40vw"}
        title={"Employee Schedule Details"}
        footer={null}
      >
        <Form
          name="upsertForm"
          layout="vertical"
          // onFinish={onSubmit}
          // initialValues={{
          //   ...record,
          //   dateTimeStartRaw:
          //     record?.dateTimeStartRaw && dayjs(record?.dateTimeStartRaw),
          //   dateTimeEndRaw:
          //     record?.dateTimeStartRaw && dayjs(record?.dateTimeEndRaw),
          //   mealBreakStart:
          //     record?.mealBreakStart && dayjs(record?.mealBreakStart),
          //   mealBreakEnd: record?.mealBreakEnd && dayjs(record?.mealBreakEnd),
          // }}
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
    </>
  );
}

export default EditEmployeeScheduleModal;
