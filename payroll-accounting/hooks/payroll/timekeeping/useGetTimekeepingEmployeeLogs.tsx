import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const QUERY = gql`
  query ($id: UUID) {
    list: getTimekeepingEmployeeLogs(id: $id) {
      id
      employeeId
      date
      scheduleStart
      scheduleEnd
      scheduleTitle
      inTime
      outTime
      message
      isError
      isRestDay
      hours {
        regular
        overtime
        regularHoliday
        overtimeHoliday
        regularDoubleHoliday
        overtimeDoubleHoliday
        regularSpecialHoliday
        overtimeSpecialHoliday
        late
        absent
        underTime
      }

      projectBreakdown {
        project
        projectName
        company
        companyName
        regular
        overtime
        regularHoliday
        overtimeHoliday
        regularDoubleHoliday
        overtimeDoubleHoliday
        regularSpecialHoliday
        overtimeSpecialHoliday
      }
    }
  }
`;

function useGetTimekeepingEmployeeLogs(
  id: string,
  callBack?: (result: any) => void
) {
  const { data, loading, refetch } = useQuery(QUERY, {
    variables: {
      id: id,
    },
    onCompleted: (result) => {
      if (callBack) callBack(result?.employees);
    },
  });
  return [data?.list, loading, refetch];
}

export default useGetTimekeepingEmployeeLogs;
