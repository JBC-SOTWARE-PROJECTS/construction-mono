import React from "react";
import CircularProgress from "@/components/circularProgress";
import dynamic from "next/dynamic";

const EventsHolidayConfiguration = dynamic(
  () => import("@/routes/payroll/configurations/events/events-holiday"),
  {
    loading: () => <CircularProgress />,
  }
);

const EventsHoliday = () => {
  return (
    <>
      <EventsHolidayConfiguration />
    </>
  );
};

export default EventsHoliday;
