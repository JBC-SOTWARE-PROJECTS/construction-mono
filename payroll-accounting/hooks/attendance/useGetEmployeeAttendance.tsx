import { gql, useLazyQuery, useQuery } from "@apollo/client";
import dayjs from "dayjs";

const GET_SAVED_EMPLOYEE_ATTENDANCE = gql`
  query (
    $size: Int
    $page: Int
    $id: UUID
    $startDate: Instant
    $endDate: Instant
  ) {
    logs: getSavedEmployeeAttendance(
      size: $size
      page: $page
      id: $id
      startDate: $startDate
      endDate: $endDate
    ) {
      content {
        additionalNote
        attendance_time
        createdBy
        createdDate
        id
        isIgnored
        isManual
        lastModifiedBy
        lastModifiedDate
        original_attendance_time
        type
        originalType
        cameraCapture
        employee {
          id
        }
        project {
          id
          description
        }
      }
      totalElements
    }
  }
`;
interface IVariables {
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  size: number;
  page: number;
  id?: string | string[];
}

const useGetEmployeeAttendance = () => {
  const [queryFn, { data, loading, refetch }] = useLazyQuery(
    GET_SAVED_EMPLOYEE_ATTENDANCE
  );

  const getEmployeeSchedule = (variables: IVariables) => {
    queryFn({
      variables: variables,
    });
  };

  const returnValue: [
    (variables: IVariables) => void,
    any,
    boolean,
    () => void
  ] = [getEmployeeSchedule, data?.logs, loading, refetch];

  return returnValue;
};

export default useGetEmployeeAttendance;
