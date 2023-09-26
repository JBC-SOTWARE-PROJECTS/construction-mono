import dayjs from "dayjs";
import React, { useState } from "react";

function useDateRangeState() {
  const [dates, setDates] = useState<dayjs.Dayjs[] | null[]>([null, null]);

  const handleDateChange = (dates: any) => {
    try {
      setDates([dayjs(dates[0]).startOf("day"), dayjs(dates[1]).endOf("day")]);
    } catch {
      setDates([null, null]);
    }
  };
  const returnValue: [
    dayjs.Dayjs | null,
    dayjs.Dayjs | null,
    (dates: any) => void
  ] = [dates[0], dates[1], handleDateChange];
  return returnValue;
}

export default useDateRangeState;
