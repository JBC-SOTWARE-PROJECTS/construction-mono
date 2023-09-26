import React from "react";
import AccumulatedLogsTable from "../../AccumulatedLogsTable";
import useGetAccumulatedLogs from "@/hooks/attendance/useGetAccumulatedLogs";
import useDateRangeState from "@/hooks/useDateRangeState";
import { FormDateRange } from "@/components/common";
import { useRouter } from "next/router";
import { useGetEmployeeById } from "@/hooks/employee";
import { Divider } from "antd";

function AccumulatedLogs() {
  const router = useRouter();

  const [startDate, endDate, handleDateChange] = useDateRangeState();
  const [data, loading, refetch] = useGetAccumulatedLogs({
    startDate,
    endDate,
  });
  const [employee, loadingEmployee] = useGetEmployeeById(router?.query?.id);
  return (
    <>
      <table>
        <tr>
          <td>Name:</td>
          <td style={{ paddingLeft: 10, fontWeight: "bold" }}>
            {employee?.fullName}
          </td>
        </tr>
        <tr>
          <td>Position:</td>
          <td style={{ paddingLeft: 10, fontWeight: "bold" }}>
            {employee?.position?.description}
          </td>
        </tr>
      </table>
      <Divider />
      <FormDateRange
        name="dateRange"
        label="Date Range"
        propsrangepicker={{
          format: "MMMM D, YYYY",
          use12Hours: true,
          onChange: (dates: any) => {
            handleDateChange(dates);
          },
        }}
      />

      <AccumulatedLogsTable
        dataSource={data}
        loading={loading || loadingEmployee}
      />
    </>
  );
}

export default AccumulatedLogs;
