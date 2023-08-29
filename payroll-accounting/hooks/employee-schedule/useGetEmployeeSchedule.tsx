import { gql, useQuery } from "@apollo/client";
import dayjs from "dayjs";

const QUERY = gql`
  query ($startDate: Instant, $endDate: Instant) {
    list: getEmployeeScheduleByFilter(
      employeeIds: ["4a37c743-6caf-424b-9545-1078f476a7f6"]
      startDate: $startDate
      endDate: $endDate
    ) {
      fullName
      position
      schedule
    }
  }
`;

interface IParams {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}

const useGetEmployeeSchedule = ({ startDate, endDate }: IParams) => {
  const { data, loading, refetch } = useQuery(QUERY, {
    variables: {
      startDate: startDate,
      endDate: endDate,
    },
  });

  return [data?.list, loading, refetch];
};

export default useGetEmployeeSchedule;
