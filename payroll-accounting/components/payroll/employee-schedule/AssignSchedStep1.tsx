import EmployeeTable from "@/components/administrative/employees/EmployeeTable";
import { Employee, Schedule } from "@/graphql/gql/graphql";
import useGetScheduleTypes from "@/hooks/configurations/useGetScheduleTypes";
import { useGetFilters } from "@/hooks/employee";
import { filterOptions } from "@/routes/administrative/Employees";
import { getTimeFromDate } from "@/utility/helper";
import { ProCard, ProFormGroup } from "@ant-design/pro-components";
import { Card, Col, Divider, Empty, Input, Row, Select } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import dayjs from "dayjs";

const { Search } = Input;

interface IProps {
  rowSelection?: TableRowSelection<Employee>;
  setScheduleType: any;
  scheduleType: Schedule | null;
  setState: any;
  state: any;
  employees: Employee[];
  loading: boolean;
}
function AssignSchedStep1({
  rowSelection,
  setScheduleType,
  scheduleType,
  setState,
  state,
  employees,
  loading,
}: IProps) {
  const [scheduleTypes, loadingSchedules] = useGetScheduleTypes();

  const [filterData] = useGetFilters();
  console.log(scheduleType);
  return (
    <div>
      <div style={{ marginTop: 20, marginLeft: 20 }}>
        <label style={{ marginRight: 10 }}>Select Schedule Type: </label>
        <Select
          style={{ width: 300, marginBottom: 20 }}
          options={scheduleTypes?.map((item: Schedule) => {
            return {
              value: item.id,
              label:
                item.label +
                " " +
                `(${getTimeFromDate(item.dateTimeEndRaw)} - ${getTimeFromDate(
                  item.dateTimeEndRaw
                )})`,
            };
          })}
          onChange={(e) => {
            setScheduleType(
              scheduleTypes?.filter((item) => {
                return item.id === e;
              })[0]
            );
          }}
          value={scheduleType?.id}
        />
      </div>

      <Divider />

      <ProCard
        title="Employee List"
        headStyle={{
          flexWrap: "wrap",
        }}
        // bordered
        headerBordered
        extra={
          <ProFormGroup>
            <Search
              size="middle"
              placeholder="Search here.."
              onSearch={(e) =>
                setState((prev: any) => ({ ...prev, filter: e }))
              }
              allowClear
              className="select-header"
            />
            <Select
              allowClear
              style={{ width: 170 }}
              placeholder="Office"
              defaultValue={null}
              onChange={(value) => {
                setState({ ...state, status: value });
              }}
              options={filterOptions}
            />
            <Select
              allowClear
              style={{ width: 170 }}
              placeholder="Office"
              defaultValue={null}
              onChange={(value) => {
                setState({ ...state, office: value });
              }}
              options={filterData?.office}
            />
            <Select
              allowClear
              style={{ width: 170 }}
              placeholder="Position"
              defaultValue={null}
              onChange={(value) => {
                setState({ ...state, position: value });
              }}
              options={filterData.position}
            />
          </ProFormGroup>
        }
      >
        <EmployeeTable
          dataSource={employees as Employee[]}
          loading={loading}
          totalElements={1 as number}
          handleOpen={(record) => console.log("record => ", record)}
          changePage={(page) =>
            setState((prev: any) => ({ ...prev, page: page }))
          }
          hideExtraColumns
          rowSelection={rowSelection}
        />
      </ProCard>
    </div>
  );
}

export default AssignSchedStep1;
