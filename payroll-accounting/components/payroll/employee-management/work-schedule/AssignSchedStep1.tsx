import EmployeeTable from "@/components/administrative/employees/EmployeeTable";
import FormSelect from "@/components/common/formSelect/formSelect";
import { Employee, Projects, Schedule } from "@/graphql/gql/graphql";
import useGetScheduleTypes from "@/hooks/configurations/useGetScheduleTypes";
import { useGetFilters } from "@/hooks/employee";
import useGetActiveProjects from "@/hooks/payroll/useGetActiveProjects";
import { filterOptions } from "@/routes/payroll/employees";
import { getTimeFromDate } from "@/utility/helper";
import { Col, Divider, Input, Radio, Row, Select, TimePicker } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useState } from "react";

const { Search } = Input;

interface IProps {
  rowSelection?: TableRowSelection<Employee>;
  setScheduleType: any;
  scheduleType: Schedule | null;
  setState: any;
  state: any;
  employees: Employee[];
  loading: boolean;
  mode: any;
  setMode: any;
  overtimeDetails: any;
  setOvertimeDetails: any;
}

type onChange =
  | ((value: dayjs.Dayjs | null, dateString: string) => void)
  | undefined;

function AssignSchedStep1({
  rowSelection,
  setScheduleType,
  scheduleType,
  setState,
  state,
  employees,
  loading,
  mode,
  setMode,
  overtimeDetails,
  setOvertimeDetails,
}: IProps) {
  const [scheduleTypes, loadingSchedules] = useGetScheduleTypes();
  const [regularEnd, setRegularEnd] = useState();
  const [projects, loadingProjects] = useGetActiveProjects();
  const [filterData] = useGetFilters();

  const disabledHours = () => {
    if (regularEnd) {
      return Array.from(
        { length: dayjs(regularEnd).hour() },
        (_, index) => index
      );
    } else {
      return [];
    }
  };

  const disabledMinutes = (selectedHour: number) => {
    if (selectedHour === dayjs(regularEnd).hour()) {
      return Array.from(
        { length: dayjs(regularEnd).minute() },
        (_, index) => index
      );
    } else {
      return [];
    }
  };

  const onChangeOvertimeStart: onChange = (e) => {
    const end = dayjs(regularEnd);
    if (end.hour() === e?.hour() && end.minute() > e.minute())
      setOvertimeDetails({
        ...overtimeDetails,
        start: e?.set("minute", end.minute()),
      });
    else setOvertimeDetails({ ...overtimeDetails, start: e });
  };

  return (
    <div>
      <div style={{ marginTop: 10, marginLeft: 20 }}>
        <Radio.Group
          buttonStyle="solid"
          onChange={(e) => {
            if (e.target.value === "OVERTIME") setScheduleType(null);
            setMode(e.target.value);
          }}
          defaultValue="REGULAR"
          value={mode}
        >
          <Radio.Button value="REGULAR">Regular Only</Radio.Button>
          <Radio.Button value="REGULAR_WITH_OVERTIME">
            Regular With Overtime
          </Radio.Button>
          <Radio.Button value="OVERTIME">Overtime Only</Radio.Button>
        </Radio.Group>
        <br />
        <Divider style={{ margin: 10 }} />

        {["REGULAR", "REGULAR_WITH_OVERTIME"].includes(mode) && (
          <div
            style={{
              width: 400,
              display: "inline-block",
              borderRight:
                mode == "REGULAR_WITH_OVERTIME"
                  ? "1px solid #d1d0d0"
                  : undefined,
              paddingRight: "30px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontWeight: "bold" }}>Regular Schedule</div>
            <Select
              loading={loadingSchedules}
              style={{ width: "100%" }}
              options={scheduleTypes?.map((item: Schedule) => {
                return {
                  value: item.id,
                  label:
                    item.label +
                    " " +
                    `(${getTimeFromDate(
                      item.dateTimeStartRaw
                    )} - ${getTimeFromDate(item.dateTimeEndRaw)})`,
                };
              })}
              onChange={(e) => {
                setScheduleType(
                  scheduleTypes?.filter((item) => {
                    if (item.id === e) {
                      console.log(item);
                      setOvertimeDetails({
                        ...overtimeDetails,
                        start: item.dateTimeEndRaw,
                      });
                      setRegularEnd(item.dateTimeEndRaw);
                    }
                    return item.id === e;
                  })[0]
                );
              }}
              value={scheduleType?.id}
            />
          </div>
        )}
        {["OVERTIME", "REGULAR_WITH_OVERTIME"].includes(mode) && (
          <div
            style={{
              display: "inline-block",
              marginLeft: mode == "REGULAR_WITH_OVERTIME" ? 30 : 0,
            }}
          >
            <div style={{ fontWeight: "bold" }}>Overtime Schedule</div>
            <Radio.Group
              onChange={(e) => {
                setOvertimeDetails({
                  ...overtimeDetails,
                  overtimeType: e.target.value,
                });
              }}
              value={overtimeDetails?.overtimeType}
            >
              <Radio value="FIXED">
                <div>
                  Fixed Overtime:{" "}
                  <TimePicker
                    name="dateTimeStartRaw"
                    style={{ display: "inline-block" }}
                    format="hh:mm a"
                    use12Hours={true}
                    value={
                      overtimeDetails?.start && dayjs(overtimeDetails?.start)
                    }
                    disabledTime={() => {
                      return {
                        disabledHours: disabledHours,
                        disabledMinutes: disabledMinutes,
                      };
                    }}
                    onChange={onChangeOvertimeStart}
                    disabled={overtimeDetails?.overtimeType === "FLEXIBLE"}
                  />{" "}
                  -{" "}
                  <TimePicker
                    name="dateTimeStartRaw"
                    style={{ display: "inline-block" }}
                    format="hh:mm a"
                    use12Hours={true}
                    value={overtimeDetails?.end && dayjs(overtimeDetails?.end)}
                    onChange={(e) => {
                      setOvertimeDetails({ ...overtimeDetails, end: e });
                    }}
                    disabled={overtimeDetails?.overtimeType === "FLEXIBLE"}
                  />
                </div>
              </Radio>
              <Radio value="FLEXIBLE">Flexible Overtime</Radio>
            </Radio.Group>
            <div
              style={{
                borderLeft: "1px solid #d1d0d0",
                display: "inline-block",
                height: "100%",
                paddingLeft: 15,
                marginRight: 10,
              }}
            >
              Project:
            </div>
            <Select
              style={{ minWidth: 400 }}
              loading={loadingProjects}
              options={[
                { value: null, label: "Office Based" },
                ...(projects
                  ? projects?.map((item: Projects) => ({
                      value: item.id,
                      label: item.description,
                    }))
                  : []),
              ]}
              onChange={(value, option: any) =>
                setOvertimeDetails({
                  ...overtimeDetails,
                  project: value,
                  projectDescription: option.label,
                })
              }
              defaultValue={overtimeDetails?.project}
              allowClear={true}
              placeholder="Select Project"
            />
          </div>
        )}
      </div>

      <Divider style={{ margin: 10 }} />

      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            width: "10%",
            display: "inline-block",
            verticalAlign: "baseline",
            fontWeight: "bold",
          }}
        >
          Employee List
        </div>
        <div style={{ width: "90%", display: "inline-block" }}>
          <Row gutter={15}>
            <Col span={5}>
              <Search
                style={{ width: "100%" }}
                size="middle"
                placeholder="Search here.."
                onSearch={(e) =>
                  setState((prev: any) => ({ ...prev, filter: e }))
                }
                allowClear
                className="select-header"
              />
            </Col>
            <Col span={3}>
              <Select
                style={{ width: "100%" }}
                allowClear
                placeholder="Status"
                onChange={(value) => {
                  setState({ ...state, status: value });
                }}
                options={filterOptions}
              />
            </Col>
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                allowClear
                placeholder="Office"
                defaultValue={null}
                onChange={(value) => {
                  setState({ ...state, office: value });
                }}
                options={filterData?.office}
              />
            </Col>
            <Col span={8}>
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Position"
                defaultValue={null}
                onChange={(value) => {
                  setState({ ...state, position: value });
                }}
                options={filterData.position}
              />
            </Col>
          </Row>
        </div>
      </div>
      <EmployeeTable
        dataSource={employees as Employee[]}
        loading={loading}
        changePage={(page: any) =>
          setState((prev: any) => ({ ...prev, page: page }))
        }
        hideExtraColumns
        rowSelection={rowSelection}
      />
    </div>
  );
}

export default AssignSchedStep1;
