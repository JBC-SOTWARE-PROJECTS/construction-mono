import { Schedule } from "@/graphql/gql/graphql";
import { Dropdown } from "antd";
import dayjs from "dayjs";
import React from "react";

interface Iprops {
  schedules: Schedule[];
  employeeId: string;
}
function ScheduleCell({ schedules, employeeId }: Iprops) {
  return (
    <Dropdown
      trigger={["contextMenu"]}
      menu={{
        items: schedules?.map((item) => {
          return {
            label:
              item.label +
              " " +
              `(${dayjs(item.dateTimeStartRaw).format("hh:mm a")} - ${dayjs(
                item.dateTimeEndRaw
              ).format("hh:mm a")})`,
            key: item.id,
            onClick: (e) => {
              console.log(e);
            },
          };
        }),
      }}
    >
      <div>Click Here</div>
    </Dropdown>
  );
}

export default ScheduleCell;
