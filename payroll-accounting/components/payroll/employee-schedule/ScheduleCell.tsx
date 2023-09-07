import { Schedule } from "@/graphql/gql/graphql";
import { IUpsertEmployeeScheduleParams } from "@/hooks/employee-schedule/useUpsertEmployeeSchedule";
import { transformDate } from "@/utility/helper";
import { Divider, Dropdown, Menu } from "antd";
import dayjs from "dayjs";

export interface IEmployee {
  id: string;
  fullName: string;
  position: string;
}
interface Iprops {
  schedules: Schedule[];
  currentDate: dayjs.Dayjs;
  employeeSchedule: any;
  upsertEmpSchedule: ({ variables }: IUpsertEmployeeScheduleParams) => void;
  showScheduleDetailsModal: (pros: any, callback: () => void) => void;
  employee: IEmployee;
}

function ScheduleCell({
  schedules,
  employee,
  employeeSchedule,
  upsertEmpSchedule,
  currentDate,
  showScheduleDetailsModal,
}: Iprops) {
  const handleRightClick = ({ key }: any) => {
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
        employeeId: employee.id,
        id: employeeSchedule && employeeSchedule[0].schedule_id,
        fields: fields,
      },
    });
  };

  const handleClickSchedule = () => {
    showScheduleDetailsModal(
      {
        employee,
        currentDate,
      },
      () => {}
    );
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
            onClick: handleRightClick,
          };
        }),
      }}
    >
      <div
        style={{
          textAlign: "center",
          margin: 0,
          lineHeight: 1.2,
          padding: 10,
          position: "relative",
          top: 0,
          bottom: 0,
          height: "auto",
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
        onClick={handleClickSchedule}
      >
        {(employeeSchedule ?? []).length !== 0
          ? employeeSchedule?.map((item: any) => {
              return (
                <>
                  <b>{item.label}</b>
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
