import { gql, useQuery } from "@apollo/client";
import dayjs from "dayjs";

const QUERY = gql`
  query ($startDate: Instant, $endDate: Instant, $employeeIds: [UUID]) {
    list: getEmployeeScheduleByFilter(
      employeeIds: $employeeIds
      startDate: $startDate
      endDate: $endDate
    ) {
      id
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
      employeeIds: [
        "4a37c743-6caf-424b-9545-1078f476a7f6",
        "f5b333f5-ba65-406b-972c-df08d7e9d1c5",
      ],
    },
  });

  return [data?.list, loading, refetch];
};

export default useGetEmployeeSchedule;
