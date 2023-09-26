import FormDateTimePicker from "@/components/common/formDateTimePicker/formDateTimePicker";
import FormInput from "@/components/common/formInput/formInput";
import FormSelect from "@/components/common/formSelect/formSelect";
import { EmployeeAttendance } from "@/graphql/gql/graphql";
import useUpsertEmployeeAttendance, {
  IUpsertEmployeeAttendanceParams,
} from "@/hooks/attendance/useUpsertEmployeeAttendance";
import { useQuery } from "@apollo/client";
import { Button, Divider, Form, Modal, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import dayjs from "dayjs";
import { GET_ACTIVE_PROJECTS } from "../../configurations/UpsertScheduleType";
const types = [
  {
    value: "IN",
    label: "IN",
  },
  {
    value: "OUT",
    label: "OUT",
  },
];

interface IProps {
  open: boolean;
  toggleModal: () => void;
  record?: EmployeeAttendance | undefined;
}
function UpsertAttendanceModal({ open, toggleModal, record }: IProps) {
  const { error, data: projects } = useQuery(GET_ACTIVE_PROJECTS);

  const [form] = useForm();
  const handleCancel = () => {
    toggleModal();
    form.resetFields();
  };

  const [upsertEmployeeSchedule, loading] = useUpsertEmployeeAttendance(() => {
    toggleModal();
    form.setFieldsValue({
      attendance_time: null,
      type: null,
      additionalNote: null,
    });
  });

  const onSubmit = (values: IUpsertEmployeeAttendanceParams) => {
    upsertEmployeeSchedule(
      {
        ...values,
        attendance_time: dayjs(values.attendance_time).millisecond(0),
      },
      values?.project_id,
      record?.id
    );
  };
  return (
    <Modal
      maskClosable={false}
      open={open}
      title="Create Raw Logs"
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        layout="vertical"
        name="upsertForm"
        onFinish={onSubmit}
        form={form}
        initialValues={{
          ...record,
          attendance_time:
            record?.attendance_time && dayjs(record?.attendance_time),
          project_id: record?.project?.id,
        }}
      >
        <Spin spinning={loading}>
          <FormDateTimePicker
            name="attendance_time"
            label="Date/Time"
            required
            propstimepicker={{
              placeholder: "Date/Time",
              showTime: { format: "h:mm:ss A" },
              format: "MMMM D, YYYY, h:mm:ss A",
            }}
          />
          <FormSelect
            name="type"
            label="Type"
            required
            propsselect={{
              placeholder: "Type",
              options: types,
            }}
          />
          <FormSelect
            name="project_id"
            label="Project"
            required
            propsselect={{
              options: projects?.list?.map((item: any) => ({
                value: item.id,
                label: item.description,
              })),
              allowClear: true,
              placeholder: "Select Project",
            }}
          />
          <FormInput
            name="additionalNote"
            label="Notes"
            propsinput={{ placeholder: "Notes" }}
          />
        </Spin>
        <Divider style={{ marginBottom: 10 }} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button style={{ marginRight: 10 }} onClick={handleCancel}>
            Cancel
          </Button>
          {/* {!data?.log?.isManual && (
            <HRButton
              style={{ marginRight: 10 }}
              onClick={handleRevert}
              type="primary"
              ghost
              disabled={!isEdited}
              loading={loadingRevertEmployeeAttendance}
            >
              Revert
            </HRButton>
          )} */}
          <Button type="primary" htmlType="submit" loading={false}>
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default UpsertAttendanceModal;
