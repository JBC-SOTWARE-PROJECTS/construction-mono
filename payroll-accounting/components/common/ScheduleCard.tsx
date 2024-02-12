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
          <table style={{ width: "100%" }}>
            <tr>
              <td style={{ fontWeight: "bold", width: "15%" }}>Label</td>
              <td style={{ width: "2%" }}>:</td>
              <td>{scheduleType?.label || employeeSchedule?.label}</td>
            </tr>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                }}
              >
                Title
              </td>
              <td>:</td>
              <td>{scheduleType?.title || employeeSchedule?.title}</td>
            </tr>

            <tr>
              <td style={{ fontWeight: "bold" }}>Schedule Duration</td>
              <td>:</td>
              <td width={60}>
                {employeeSchedule?.isOvertime &&
                employeeSchedule.overtimeType === "FLEXIBLE" ? (
                  "N/A"
                ) : (
                  <>
                    {" "}
                    {getTimeFromDate(
                      scheduleType?.dateTimeStartRaw ||
                        employeeSchedule?.dateTimeStart
                    )}
                    {"  "}-{"  "}
                    {getTimeFromDate(
                      scheduleType?.dateTimeEndRaw ||
                        employeeSchedule?.dateTimeEnd
                    )}
                  </>
                )}
              </td>
            </tr>
            {(scheduleType?.mealBreakStart ||
              employeeSchedule?.mealBreakStart ||
              scheduleType?.mealBreakEnd ||
              employeeSchedule?.mealBreakEnd) && (
              <tr>
                <td style={{ fontWeight: "bold" }}>Meal break Duration</td>
                <td>:</td>
                <td>
                  {getTimeFromDate(
                    scheduleType?.mealBreakStart ||
                      employeeSchedule?.mealBreakStart
                  )}{" "}
                  -{" "}
                  {getTimeFromDate(
                    scheduleType?.mealBreakEnd || employeeSchedule?.mealBreakEnd
                  )}
                </td>
              </tr>
            )}
            <tr>
              <td>
                <b> Project:</b>
              </td>
              <td>:</td>
              <td>
                {employeeSchedule?.project?.description ||
                  scheduleType?.project?.description ||
                  "Office Based"}
              </td>
            </tr>
            {isCustom && (
              <tr>
                <td>
                  <b> is Custom</b>
                </td>
                <td>:</td>
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
