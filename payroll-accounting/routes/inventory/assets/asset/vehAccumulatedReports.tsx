import { IPMState } from "@/components/inventory/assets/dialogs/vehicleUsageAttachment";
import AssetVehAccumulatedTable from "@/components/inventory/assets/masterfile/assetVehAccumulatedTable";
import useGetVehicleUsageAccumulatedReport from "@/hooks/asset/useGetVehicleUsageAccumulatedReport";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DatePicker, Input, Select, Table } from "antd";
import dayjs from "dayjs";
import { start } from "repl";

type Props = {};

const initialState: IPMState = {
  filter: "",
  page: 0,
  size: 10,
};

function VehAccumulatedReports({}: Props) {
  const [state, setState] = useState(initialState);
  const [dates, setDates] = useState([dayjs().startOf("month"), dayjs().endOf("month")]);
  const router = useRouter();

  const currentDate = dayjs();

// Get the first day of the current month
const firstDayOfMonth = dayjs().startOf('month');

// Calculate the difference in days
const differenceInDays = currentDate.diff(firstDayOfMonth, 'days');

  const [data, loading, refetch] = useGetVehicleUsageAccumulatedReport({
    variables: {
      ...state,
      startDate: dates[0] ,
      endDate: dates[1] ,
      asset: router?.query?.id,
    },
    fetchPolicy: "network-only",
  });

  const handleDateChange = (dates: any) => {
    try {
      setDates([dayjs(dates[0]).startOf("day"), dayjs(dates[1]).endOf("day")]);
    } catch {
      setDates([dayjs().startOf("month"), dayjs().endOf("month")]);
    }
  };

  return (
    <>
      <DatePicker.RangePicker
        defaultPickerValue={[dayjs().startOf("month"), dayjs().endOf("month")]}
        onChange={(dates: any) => {
           handleDateChange(dates);
        }}
      />
      <div style={{paddingTop: "10px"}}>
        <AssetVehAccumulatedTable
          dataSource={data?.content}
          loading={false}
          totalElements={0}
          handleOpen={() => {}}
          changePage={() => {}}
        />
      </div>
    </>
  );
}

export default VehAccumulatedReports;
