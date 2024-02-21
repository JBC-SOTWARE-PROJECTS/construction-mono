import { Employee, Schedule } from "@/graphql/gql/graphql";
import { useGetEmployeesByFilter } from "@/hooks/employee";
import useUpsertEmployeeSchedule from "@/hooks/employee-schedule/useUpsertEmployeeSchedule";
import { IState } from "@/routes/payroll/employees";
import { transformDate } from "@/utility/helper";
import {
  ExclamationCircleOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Key } from "@ant-design/pro-components";
import { Button, Modal, Space, Steps, Tag, message } from "antd";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import { ColumnsType, TableRowSelection } from "antd/es/table/interface";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import AssignSchedStep1 from "./AssignSchedStep1";
import AssignSchedStep2 from "./AssignSchedStep2";
import AssignSchedStep3 from "./AssignSchedStep3";

interface IProps {
  hide: (hideProps: any) => void;
  refetchEmployes: () => void;
  record?: Schedule | null | undefined;
}

export interface OvertimeDetails {
  start: dayjs.Dayjs | null;
  end: dayjs.Dayjs | null;
  overtimeType: string;
  project: string | null;
  projectDescription: string | null;
}
interface ISelectedSchedule {
  year: number;
  month: string;
  dates: string[];
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
  const { hide, refetchEmployes } = props;
  const [current, setCurrent] = useState(0);
  const { upsertEmployeeSchedule, loadingUpsert } = useUpsertEmployeeSchedule(
    () => {
      refetchEmployes();
      hide(null);
    }
  );

  const onChangeStep = (value: number) => {
    if (!checkStep(value) && value !== 0 && value !== 2) {
      return;
    }
    setCurrent(value);
  };

  const checkStep = (step: number) => {
    if (step === 1) {
      if (
        current === 0 &&
        ((mode === "REGULAR" && !scheduleType) ||
          (mode === "REGULAR_WITH_OVERTIME" &&
            overtimeDetails.overtimeType === "FIXED" &&
            (!scheduleType ||
              !overtimeDetails.start ||
              !overtimeDetails.end)) ||
          (mode === "OVERTIME" &&
            overtimeDetails.overtimeType === "FIXED" &&
            (!overtimeDetails.start || !overtimeDetails.end)) ||
          selectedIds.length === 0)
      ) {
        debugger;
        message.warning(
          <>
            Please select <b>employees</b> and a <b>schedule type</b>
          </>
        );
        return false;
      } else {
        debugger;
        return true;
      }
    } else if (step === 2) {
      if (current === 1 && selectedDates.length === 0) {
        message.warning(
          <>
            Please select <b>dates</b>
          </>
        );
        return false;
      } else return true;
    }
  };

  const handleSubmit = () => {
    Modal.confirm({
      title: "Are you sure you want to create this all of this schedule?",
      content: "Please click OK to confirm",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        const date = dayjs(selectedDates[0]);
        const fields = {
          dateTimeStart: transformDate(date, scheduleType?.dateTimeStartRaw),
          dateTimeEnd: transformDate(date, scheduleType?.dateTimeEndRaw),
          mealBreakStart: transformDate(date, scheduleType?.mealBreakStart),
          mealBreakEnd: transformDate(date, scheduleType?.mealBreakEnd),
          overtimeType: overtimeDetails.overtimeType as any,
          label: scheduleType?.label,
          title: scheduleType?.title,
          project_id: scheduleType?.project?.id,
        };
        upsertEmployeeSchedule({
          variables: {
            employeeIdList: selectedIds,
            dates: selectedDates,
            fields: fields,
            overtimeDetails: overtimeDetails,
            mode,
          },
        });
      },
      onCancel() {},
    });
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
  const [mode, setMode] = useState<string>("REGULAR");
  const [overtimeDetails, setOvertimeDetails] = useState<OvertimeDetails>({
    start: null,
    end: null,
    overtimeType: "FIXED",
    project: null,
    projectDescription: null,
  });

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
      style={{ top: 30 }}
      onCancel={() => {
        hide(false);
      }}
      maskClosable={false}
      width={"90vw"}
      title={"Work Schedule"}
      footer={
        <Space>
          {current !== 0 && (
            <Button size="large" onClick={() => setCurrent(current - 1)}>
              <LeftCircleOutlined /> Prev
            </Button>
          )}
          {current !== 2 && (
            <Button
              size="large"
              onClick={() => {
                if (checkStep(current + 1)) setCurrent(current + 1);
              }}
            >
              Next <RightCircleOutlined />
            </Button>
          )}
          {current === 2 && (
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              form="upsertForm"
              icon={<SaveOutlined />}
              onClick={handleSubmit}
            >
              Save
            </Button>
          )}
        </Space>
      }
    >
      <Steps
        current={current}
        onChange={onChangeStep}
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
          mode={mode}
          setMode={setMode}
          overtimeDetails={overtimeDetails}
          setOvertimeDetails={setOvertimeDetails}
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
          overtimeDetails={overtimeDetails}
          mode={mode}
        />
      )}
    </Modal>
  );
}

export default AssignEmployeeScheduleModal;

function sortDayjsObjects(obj: any) {
  const keys = Object.keys(obj);

  keys.forEach((key) => {
    let arr: number[] = obj[key]?.dates?.sort((a: any, b: any) => {
      return a - b;
    });

    let magic: any[] = [];
    let a = arr[0];
    arr.forEach((item, index) => {
      if (item + 1 !== arr[index + 1]) {
        if (a === item) magic.push(`${a}`);
        else magic.push(`${a} - ${item}`);
        a = arr[index + 1];
      }
    });
    obj[key].dates = [...magic];
  });
  return obj;
}

function groupByMonths(dayjsArray: Dayjs[]) {
  let obj: any = {};
  dayjsArray.map((item) => {
    const monthNumber = item.get("month");

    if (obj[month[monthNumber]]?.dates?.length > 0) {
      obj[month[monthNumber]] = {
        year: item.get("year"),
        dates: [...obj[month[monthNumber]]?.dates, item.get("date")],
      };
    } else {
      obj[month[monthNumber]] = {
        year: item.get("year"),
        dates: [item.get("date")],
      };
    }
  });
  return sortDayjsObjects(obj);
}

export function transformDatesArray(datesArray: string[]): any {
  const sortedDates = groupByMonths(
    datesArray.map((item) => {
      return dayjs(item);
    })
  );

  return Object.keys(sortedDates).map((item) => {
    return {
      month: item,
      dates: sortedDates[item]?.dates,
      year: sortedDates[item].year,
    };
  });
}

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const columns: ColumnsType<ISelectedSchedule> = [
  {
    title: "Year",
    dataIndex: "year",
    key: "year",
    width: 100,
    sorter: (a: any, b: any) => a.year - b.year,
    sortOrder: "ascend",
  },
  {
    title: "Month",
    dataIndex: "month",
    key: "month",
    width: 130,
  },
  {
    title: "Dates",
    dataIndex: "dates",
    key: "dates",
    render: (value: string[]) => {
      return value.map((item: string) => {
        return (
          <Tag key={item} style={{ paddingRight: 10 }}>
            {item}
          </Tag>
        );
      });
    },
  },
];
