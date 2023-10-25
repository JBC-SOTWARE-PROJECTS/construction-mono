import { FormDateRange } from "@/components/common";
import useGetAccumulatedLogs from "@/hooks/attendance/useGetAccumulatedLogs";
import useDateRangeState from "@/hooks/useDateRangeState";
import { useRouter } from "next/router";
import AccumulatedLogsTable from "../../AccumulatedLogsTable";

function AccumulatedLogs() {
  const router = useRouter();

  const [startDate, endDate, handleDateChange] = useDateRangeState();
  const [data, loading, refetch] = useGetAccumulatedLogs({
    startDate,
    endDate,
  });
  return (
    <>
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

      <AccumulatedLogsTable dataSource={data} loading={loading} />
    </>
  );
}

export default AccumulatedLogs;
