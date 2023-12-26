import { gql, useLazyQuery, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { useRouter } from "next/router";

const QUERY = gql`
  query (
    $id: UUID
    $startDate: Instant
    $endDate: Instant
    $generateBreakdown: Boolean
  ) {
    list: getAccumulatedLogs(
      id: $id
      startDate: $startDate
      endDate: $endDate
      generateBreakdown: $generateBreakdown
    ) {
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
    }
  }
`;
interface IVariables {
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  generateBreakdown?: boolean;
}

const useGetAccumulatedLogs = (variables: IVariables) => {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(QUERY, {
    variables: { ...variables, id: router?.query?.id },
  });

  const returnValue: [any, boolean, () => void] = [
    data?.list,
    loading,
    refetch,
  ];

  return returnValue;
};

export default useGetAccumulatedLogs;
