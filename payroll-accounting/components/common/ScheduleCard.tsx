import { EmployeeSchedule, Maybe, Schedule } from "@/graphql/gql/graphql";
import { getTimeFromDate } from "@/utility/helper";
import { Card, Empty, Tag } from "antd";
import React from "react";

interface IProps {
  scheduleType?: Schedule | null;
  employeeSchedule?: Maybe<EmployeeSchedule>;
  title?: string | React.ReactNode;
  extra?: React.ReactNode;
  isCustom?: Maybe<boolean>;
}
function ScheduleCard({
  scheduleType,
  employeeSchedule,
  title,
  extra,
  isCustom,
}: IProps) {
  return (
    <Card title={title || "Schedule Details"} bordered={false} extra={extra}>
      {scheduleType || employeeSchedule ? (
        <>
          <table>
            <tr>
              <td style={{ paddingRight: 30, fontWeight: "bold" }}>Label</td>
              <td style={{ paddingRight: 20 }}>:</td>
              <td colSpan={10}>
                {scheduleType?.label || employeeSchedule?.label}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  paddingRight: 30,
                  fontWeight: "bold",
                }}
              >
                Title
              </td>
              <td>:</td>
              <td colSpan={3}>
                {scheduleType?.title || employeeSchedule?.title}
              </td>
            </tr>

            <tr>
              <td style={{ paddingRight: 30, fontWeight: "bold" }}>
                Schedule Duration
              </td>
              <td>:</td>
              <td width={60}>
                {getTimeFromDate(
                  scheduleType?.dateTimeStartRaw ||
                    employeeSchedule?.dateTimeStart
                )}
              </td>
              <td width={20} style={{ textAlign: "center" }}>
                -
              </td>
              <td width={60}>
                {getTimeFromDate(
                  scheduleType?.dateTimeEndRaw || employeeSchedule?.dateTimeEnd
                )}
              </td>
            </tr>
            <tr>
              <td style={{ paddingRight: 30, fontWeight: "bold" }}>
                Meal break Duration
              </td>
              <td>:</td>
              <td>
                {getTimeFromDate(
                  scheduleType?.mealBreakStart ||
                    employeeSchedule?.mealBreakStart
                )}
              </td>
              <td style={{ textAlign: "center" }}>-</td>
              <td>
                {getTimeFromDate(
                  scheduleType?.mealBreakEnd || employeeSchedule?.mealBreakEnd
                )}
              </td>
            </tr>
            {isCustom && (
              <tr>
                <td>
                  <b> is Custom:</b>
                </td>
                <td>
                  <Tag color="blue">Yes</Tag>
                </td>
              </tr>
            )}
          </table>{" "}
        </>
      ) : (
        <Empty description="No Schedule Assigned" />
      )}
    </Card>
  );
}

export default ScheduleCard;
