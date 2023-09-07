import { EmployeeScheduleDetailsDto } from "@/graphql/gql/graphql";
import { gql, useQuery } from "@apollo/client";
import dayjs from "dayjs";

const QUERY = gql`
  query ($employeeId: UUID, $date: String) {
    data: getEmployeeScheduleDetails(employeeId: $employeeId, date: $date) {
      id
      fullName
      position
      employeeId
      dateString
      regularSchedule {
        id
        dateTimeStart
        dateTimeEnd
        isRestDay
        isOvertime
        deleted
        mealBreakStart
        mealBreakEnd
        label
        title
        isCustom
        dateString
      }
      overtimeSchedule {
        id
        dateTimeStart
        dateTimeEnd
        isRestDay
        isOvertime
        deleted
        mealBreakStart
        mealBreakEnd
        label
        title
        isCustom
        dateString
      }
    }
  }
`;

interface IParams {
  employeeId: String;
  date: dayjs.Dayjs;
}

const useGetEmployeeScheduleDetails = ({ employeeId, date }: IParams) => {
  const { data, loading, refetch } = useQuery(QUERY, {
    variables: {
      employeeId,
      date: date.add(8, "hours").format("YYYY-MM-DD"), //get date, add 8hrs and convert to YYYY-MM-DD format
    },
  });

  const returnValue: [EmployeeScheduleDetailsDto, boolean, () => void] = [
    data?.data,
    loading,
    refetch,
  ];
  return returnValue;
};

export default useGetEmployeeScheduleDetails;
