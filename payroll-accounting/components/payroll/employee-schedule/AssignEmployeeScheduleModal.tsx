import { Employee, Schedule } from "@/graphql/gql/graphql";
import { SaveOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Steps } from "antd";
import AssignSchedStep1 from "./AssignSchedStep1";
import { useState } from "react";
import { TableRowSelection } from "antd/es/table/interface";
import { Key } from "@ant-design/pro-components";
import { IState } from "@/routes/administrative/Employees";
import { useGetEmployeesByFilter } from "@/hooks/employee";
import AssignSchedStep2 from "./AssignSchedStep2";
import dayjs from "dayjs";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import AssignSchedStep3 from "./AssignSchedStep3";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Schedule | null | undefined;
}
const initialState: IState = {
  filter: "",
  status: true,
  page: 0,
  size: 10,
  office: null,
  position: null,
};
function AssignEmployeeScheduleModal(props: IProps) {
  const { hide } = props;
  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    setCurrent(value);
  };

  //==== Step 1 =====
  const [state, setState] = useState(initialState);
  const [employees, loading, refetch] = useGetEmployeesByFilter({
    variables: {
      filter: state.filter,
      status: state.status,
      office: state.office,
      position: state.position,
    },
    fetchPolicy: "network-only",
  });

  const [scheduleType, setScheduleType] = useState<Schedule | null>(null);
  const [selectedIds, setSelectedIds] = useState<Key[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

  const rowSelection: TableRowSelection<Employee> = {
    type: "checkbox",
    onChange: (selectedRowKeys, selectedRows, info) => {
      setSelectedIds(selectedRowKeys);
      setSelectedEmployees(selectedRows);
    },
    preserveSelectedRowKeys: true,
    selectedRowKeys: selectedIds,
  };

  //==== Step 2 =====

  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handleSelectDate = (e: dayjs.Dayjs, selectInfo: SelectInfo) => {
    if (selectInfo.source === "date") {
      const date = dayjs(e).startOf("day").format();
      if (!selectedDates.includes(date)) {
        setSelectedDates([...selectedDates, date]);
      } else {
        setSelectedDates(selectedDates.filter((item) => item !== date));
      }
    }
  };

  return (
    <Modal
      open
      onCancel={() => {
        hide(false);
      }}
      width={"90vw"}
      title={"Work Schedule"}
      footer={
        <Space>
          <Button
            size="large"
            htmlType="submit"
            form="upsertForm"
            // icon={<SaveOutlined />}
            onClick={() => setCurrent(current + 1)}
          >
            Next
          </Button>
        </Space>
      }
    >
      <Steps
        current={current}
        onChange={onChange}
        items={[
          {
            title: "Schedule Type and Employees",
          },
          {
            title: "Date Selection",
          },
          {
            title: "Review and Save",
          },
        ]}
      />
      {current === 0 && (
        <AssignSchedStep1
          rowSelection={rowSelection}
          setScheduleType={setScheduleType}
          scheduleType={scheduleType}
          setState={setState}
          state={state}
          employees={employees}
          loading={loading}
        />
      )}

      {current === 1 && (
        <AssignSchedStep2
          handleSelectDate={handleSelectDate}
          selectedDates={selectedDates}
        />
      )}

      {current === 2 && (
        <AssignSchedStep3
          handleSelectDate={handleSelectDate}
          selectedDates={selectedDates}
          scheduleType={scheduleType}
          selectedEmployees={selectedEmployees}
        />
      )}
    </Modal>
  );
}

export default AssignEmployeeScheduleModal;
