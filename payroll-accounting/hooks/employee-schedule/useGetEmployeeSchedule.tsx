import { gql, useQuery } from "@apollo/client";
import dayjs from "dayjs";

const QUERY = gql`
  query (
    $startDate: Instant
    $endDate: Instant
    $filter: String
    $position: UUID
    $office: UUID
  ) {
    list: getEmployeeScheduleByFilter(
      startDate: $startDate
      endDate: $endDate
      filter: $filter
      position: $position
      office: $office
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
  position: string | null;
  office: string | null;
  filter: string | null;
}

const useGetEmployeeSchedule = ({
  startDate,
  endDate,
  office,
  filter,
  position,
}: IParams) => {
  const { data, loading, refetch } = useQuery(QUERY, {
    skip: !startDate && !endDate ? true : false,
    variables: {
      startDate,
      endDate,
      office,
      filter,
      position,
    },
  });

  return [data?.list, loading, refetch];
};

export default useGetEmployeeSchedule;
