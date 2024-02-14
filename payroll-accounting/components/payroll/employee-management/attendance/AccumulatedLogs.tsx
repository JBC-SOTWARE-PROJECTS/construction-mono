import useGetAccumulatedLogs from "@/hooks/attendance/useGetAccumulatedLogs";
import useDateRangeState from "@/hooks/useDateRangeState";
import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker } from "antd";
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
      <DatePicker.RangePicker
        format="MMMM D, YYYY"
        use12Hours
        onChange={(dates: any) => {
          handleDateChange(dates);
        }}
        style={{ width: "60%", marginRight: 15, marginBottom: 15 }}
      />
      <Button
        type="primary"
        onClick={() => refetch()}
        icon={<SearchOutlined />}
      >
        Search
      </Button>

      <AccumulatedLogsTable dataSource={data} loading={loading} />
    </>
  );
}

export default AccumulatedLogs;
