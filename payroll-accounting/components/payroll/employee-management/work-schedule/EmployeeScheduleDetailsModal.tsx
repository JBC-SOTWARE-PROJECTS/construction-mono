import { EmployeeSchedule, Schedule } from "@/graphql/gql/graphql";
import useGetEmployeeScheduleDetails from "@/hooks/employee-schedule/useGetEmployeeScheduleDetails";
import { IState } from "@/routes/payroll/employees";
import {
  Card,
  Divider,
  Empty,
  List,
  Modal,
  Space,
  Spin,
  Tag,
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
import UpsertEmployeeScheduleModal from "./UpsertEmployeeScheduleModal";

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
      refetch();
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
      width={"60vw"}
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

        <ScheduleCard
          employeeSchedule={data?.regularSchedule}
          title="Regular Schedule"
          isCustom={data?.regularSchedule?.isCustom && true}
          extra={
            <UpsertEmployeeScheduleModal
              employeeSchedule={data?.regularSchedule}
              refetchEmployes={refetchEmployes}
              currentDate={currentDate}
              employeeId={employee.id}
              upsertEmployeeSchedule={upsertEmployeeSchedule}
              loading={loadingUpsert}
            />
          }
        />

        <br />
        <ScheduleCard
          employeeSchedule={data?.overtimeSchedule}
          title={
            <>
              Overtime Schedule{" "}
              <Tag color="geekblue">{data?.overtimeSchedule?.overtimeType}</Tag>
            </>
          }
          extra={
            <UpsertEmployeeScheduleModal
              employeeSchedule={data?.overtimeSchedule}
              refetchEmployes={refetchEmployes}
              currentDate={currentDate}
              employeeId={employee.id}
              upsertEmployeeSchedule={upsertEmployeeSchedule}
              loading={loadingUpsert}
              isOvertime={true}
            />
          }
        />
      </Spin>
    </Modal>
  );
}

export default EmployeeScheduleDetailsModal;
