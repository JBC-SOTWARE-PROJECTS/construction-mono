import { EmployeeSchedule, Maybe, Schedule } from "@/graphql/gql/graphql";
import { getTimeFromDate } from "@/utility/helper";
import { Card } from "antd";
import React from "react";

interface IProps {
  scheduleType?: Schedule | null;
  employeeSchedule?: Maybe<EmployeeSchedule>;
  title?: string;
  extra?: React.ReactNode;
}
function ScheduleCard({
  scheduleType,
  employeeSchedule,
  title,
  extra,
}: IProps) {
  return (
    <Card title={title || "Schedule Details"} bordered={false} extra={extra}>
      <table>
        <tr>
          <td style={{ paddingRight: 30, fontWeight: "bold" }}>Label:</td>
          <td colSpan={3}>{scheduleType?.label || employeeSchedule?.label}</td>
        </tr>
        <tr>
          <td
            style={{
              paddingRight: 30,
              fontWeight: "bold",
            }}
          >
            Title:
          </td>
          <td colSpan={3}>{scheduleType?.title || employeeSchedule?.title}</td>
        </tr>

        <tr>
          <td style={{ paddingRight: 30, fontWeight: "bold" }}>
            Schedule Duration:
          </td>
          <td width={60}>
            {getTimeFromDate(
              scheduleType?.dateTimeStartRaw || employeeSchedule?.dateTimeStart
            )}
          </td>
          <td width={20} style={{ textAlign: "center" }}>
            -
          </td>
          <td width={60}>
            {getTimeFromDate(
              scheduleType?.dateTimeEndRaw || employeeSchedule?.dateTimeStart
            )}
          </td>
        </tr>
        <tr>
          <td style={{ paddingRight: 30, fontWeight: "bold" }}>
            Meal break Duration:{" "}
          </td>
          <td>
            {getTimeFromDate(
              scheduleType?.mealBreakStart || employeeSchedule?.mealBreakStart
            )}
          </td>
          <td style={{ textAlign: "center" }}>-</td>
          <td>
            {getTimeFromDate(
              scheduleType?.mealBreakEnd || employeeSchedule?.mealBreakEnd
            )}
          </td>
        </tr>
      </table>
    </Card>
  );
}

export default ScheduleCard;
