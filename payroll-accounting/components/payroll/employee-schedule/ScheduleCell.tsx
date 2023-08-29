import { Schedule } from "@/graphql/gql/graphql";
import { IUpsertEmployeeScheduleParams } from "@/hooks/employee-schedule/useUpsertEmployeeSchedule";
import { transformDate } from "@/utility/helper";
import { Dropdown } from "antd";
import dayjs from "dayjs";

interface Iprops {
  schedules: Schedule[];
  employeeId: string;
  currentDate: dayjs.Dayjs;
  employeeSchedule: any;
  upsertEmpSchedule: ({ variables }: IUpsertEmployeeScheduleParams) => void;
}

function ScheduleCell({
  schedules,
  employeeId,
  employeeSchedule,
  upsertEmpSchedule,
  currentDate,
}: Iprops) {
  const handleClick = ({ key }: any) => {
    const schedule = schedules.find((item) => item.id === key);
    const fields = {
      dateTimeStart: transformDate(currentDate, schedule?.dateTimeStartRaw),
      dateTimeEnd: transformDate(currentDate, schedule?.dateTimeEndRaw),
      mealBreakStart: transformDate(currentDate, schedule?.mealBreakStart),
      mealBreakEnd: transformDate(currentDate, schedule?.mealBreakEnd),
      label: schedule?.label,
      title: schedule?.title,
    };
    upsertEmpSchedule({
      variables: {
        employeeId: "4a37c743-6caf-424b-9545-1078f476a7f6",
        id: null,
        fields: fields,
      },
    });
  };

  return (
    <Dropdown
      trigger={["contextMenu"]}
      menu={{
        items: schedules?.map((item) => {
          return {
            label:
              item.label +
              " " +
              `(${dayjs(item.dateTimeStartRaw).format("h:mm a")} - ${dayjs(
                item.dateTimeEndRaw
              ).format("h:mm a")})`,
            key: item.id,
            onClick: handleClick,
          };
        }),
      }}
    >
      <div style={{ textAlign: "center" }}>
        {(employeeSchedule ?? []).length !== 0
          ? employeeSchedule?.map((item: any) => {
              return (
                <>
                  <b>{item.label}</b>
                  <br />
                  {`${dayjs(item.date_time_start)
                    .add(8, "hour")
                    .format("h:mm a")} - ${dayjs(item.date_time_end)
                    .add(8, "hour")
                    .format("h:mm a")}`}{" "}
                  <br />
                </>
              );
            })
          : "No Schedule"}
      </div>
    </Dropdown>
  );
}

export default ScheduleCell;
