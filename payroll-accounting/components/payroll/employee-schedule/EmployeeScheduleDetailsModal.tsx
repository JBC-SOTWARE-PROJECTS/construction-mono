import { EmployeeSchedule, Schedule } from "@/graphql/gql/graphql";
import useGetEmployeeScheduleDetails from "@/hooks/employee-schedule/useGetEmployeeScheduleDetails";
import { IState } from "@/routes/administrative/Employees";
import {
  Card,
  Divider,
  Empty,
  List,
  Modal,
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

function EmployeeScheduleDetailsModal({
  hide,
  refetchEmployes,
  employee,
  currentDate,
}: IProps) {
  const [data, loading, refetch] = useGetEmployeeScheduleDetails({
    employeeId: employee.id,
    date: currentDate,
  });

  const { upsertEmployeeSchedule, loadingUpsert } = useUpsertEmployeeSchedule(
    () => {
      refetchEmployes();
    }
  );

  return (
    <Modal
      open
      onCancel={() => {
        hide(false);
      }}
      maskClosable={false}
      width={"40vw"}
      title={"Employee Schedule Details"}
      footer={null}
    >
      <Spin spinning={loading}>
        <Typography.Title level={5}>
          <table>
            <tr>
              <td>Date:</td>
              <td style={{ paddingLeft: 10 }}>
                {dayjs(currentDate).format("MMM DD, YYYY (dddd)")}
              </td>
            </tr>
            <tr>
              <td>Name:</td>
              <td style={{ paddingLeft: 10 }}>{employee?.fullName}</td>
            </tr>
            <tr>
              <td>Position:</td>
              <td style={{ paddingLeft: 10 }}>{employee?.position}</td>
            </tr>
          </table>
        </Typography.Title>
        <Divider />

        {data?.regularSchedule ? (
          <ScheduleCard
            employeeSchedule={data?.regularSchedule}
            title="Regular Schedule"
            extra={
              <CustomButton icon={<EditOutlined />} type="default">
                Edit
              </CustomButton>
            }
          />
        ) : (
          <Card title="Regular Schedule">
            <Empty description="No Regular Schedule Assigned" />
          </Card>
        )}
        <br />
        {data?.overtimeSchedule ? (
          <ScheduleCard
            employeeSchedule={data?.overtimeSchedule}
            title="Overtime Schedule"
            extra={
              <CustomButton icon={<EditOutlined />} type="default">
                Edit
              </CustomButton>
            }
          />
        ) : (
          <Card
            title="Overtime Schedule"
            extra={
              <CustomButton icon={<PlusOutlined />} type="default">
                Add
              </CustomButton>
            }
          >
            <Empty description="No Overtime Schedule Assigned" />
          </Card>
        )}
      </Spin>
    </Modal>
  );
}

export default EmployeeScheduleDetailsModal;
