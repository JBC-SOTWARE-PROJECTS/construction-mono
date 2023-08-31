import EmployeeTable from "@/components/administrative/employees/EmployeeTable";
import { Employee, Schedule } from "@/graphql/gql/graphql";
import { getTimeFromDate } from "@/utility/helper";
import { ProCard, ProFormGroup } from "@ant-design/pro-components";
import { Card, Col, Empty, Row, Table, Tag } from "antd";
import { SelectInfo } from "antd/es/calendar/generateCalendar";
import dayjs, { Dayjs } from "dayjs";
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
interface IProps {
  selectedDates: string[];
  handleSelectDate: (e: dayjs.Dayjs, selectedInfo: SelectInfo) => void;
  scheduleType: Schedule | null;
  selectedEmployees: Employee[];
}

function sortDayjsObjects(obj: any) {
  const keys = Object.keys(obj);

  keys.forEach((key) => {
    let arr: number[] = obj[key]?.sort((a: any, b: any) => {
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
    obj[key] = [...magic];
  });
  return obj;
}
function groupByMonths(dayjsArray: Dayjs[]) {
  let obj: any = {};

  dayjsArray.map((item) => {
    const monthNumber = item.get("month");
    obj[month[monthNumber]] =
      obj[month[monthNumber]]?.length > 0
        ? [...obj[month[monthNumber]], item.get("date")]
        : [item.get("date")];
  });

  return sortDayjsObjects(obj);
}

function transformDatesArray(datesArray: string[]): any {
  const sortedDates = groupByMonths(
    datesArray.map((item) => {
      return dayjs(item);
    })
  );

  return Object.keys(sortedDates).map((item) => {
    return { month: item, dates: sortedDates[item] };
  });
}
function AssignSchedStep3({
  selectedDates,
  handleSelectDate,
  scheduleType,
  selectedEmployees,
}: IProps) {
  const formattedDates = transformDatesArray(selectedDates);

  const columns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 150,
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
  return (
    <div>
      <ProCard
        headStyle={{
          flexWrap: "wrap",
        }}
        headerBordered
        extra={<ProFormGroup></ProFormGroup>}
      >
        <Row gutter={16}>
          <Col span={10}>
            <Card title="Schedule Details" bordered={false}>
              <table>
                <tr>
                  <td style={{ paddingRight: 30, fontWeight: "bold" }}>
                    Label:
                  </td>
                  <td width={60}>{scheduleType?.label}</td>
                </tr>
                <tr>
                  <td style={{ paddingRight: 30, fontWeight: "bold" }}>
                    Title:
                  </td>
                  <td width={60}>{scheduleType?.title}</td>
                </tr>
                <tr>
                  <td style={{ paddingRight: 30, fontWeight: "bold" }}>
                    Schedule Duration:
                  </td>
                  <td width={60}>
                    {getTimeFromDate(scheduleType?.dateTimeStartRaw)}
                  </td>
                  <td width={20} style={{ textAlign: "center" }}>
                    -
                  </td>
                  <td width={60}>
                    {getTimeFromDate(scheduleType?.dateTimeEndRaw)}
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: 30, fontWeight: "bold" }}>
                    Meal break Duration:{" "}
                  </td>
                  <td>{getTimeFromDate(scheduleType?.mealBreakStart)}</td>
                  <td style={{ textAlign: "center" }}>-</td>
                  <td>{getTimeFromDate(scheduleType?.mealBreakEnd)}</td>
                </tr>
              </table>
            </Card>
          </Col>
          <Col span={14}>
            <Card
              title="Selected Dates"
              bodyStyle={{ padding: 5 }}
              bordered={false}
            >
              <Table
                // showHeader={false}
                size="small"
                // bordered={false}
                columns={columns}
                dataSource={formattedDates}
              />
            </Card>
          </Col>

          <Col span={24} style={{ marginTop: 30 }}>
            <Card
              title="Selected Employees"
              bodyStyle={{ padding: 5 }}
              bordered={false}
            >
              <EmployeeTable
                dataSource={selectedEmployees as Employee[]}
                totalElements={1 as number}
                handleOpen={(record) => console.log("record => ", record)}
                hideExtraColumns
              />
            </Card>
          </Col>
        </Row>
      </ProCard>
    </div>
  );
}

export default AssignSchedStep3;
