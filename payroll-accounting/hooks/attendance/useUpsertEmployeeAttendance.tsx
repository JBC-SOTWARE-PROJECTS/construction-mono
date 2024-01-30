import { EmployeeSchedule } from "@/graphql/gql/graphql";
import { Key } from "@ant-design/pro-components";
import { gql, useMutation } from "@apollo/client";
import { message } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
const UPSERT_EMPLOYEE_ATTENDANCE = gql`
  mutation (
    $id: UUID
    $project_id: UUID
    $employee: UUID
    $fields: Map_String_ObjectScalar
  ) {
    data: upsertEmployeeAttendance(
      id: $id
      employee: $employee
      fields: $fields
      project_id: $project_id
      isManual: true
    ) {
      success
      message
    }
  }
`;
export interface IUpsertEmployeeAttendanceParams {
  attendance_time: dayjs.Dayjs;
  type: string;
  additionalNote: string;
  project_id: string;
}

const useUpsertEmployeeAttendance = (callBack: () => void) => {
  const router = useRouter();
  const [upsert, { loading }] = useMutation(UPSERT_EMPLOYEE_ATTENDANCE, {
    onCompleted: (value: any) => {
      const data = value?.data || {};
      if (data?.success) {
        message.success(
          data?.message || "Successfully added attendance raw log"
        );

        if (callBack) callBack();
      } else {
        message.error(data?.message || "Failed to add attendance raw log");
      }
    },
  });

  const upsertEmployeeSchedule = (
    variables: IUpsertEmployeeAttendanceParams,
    project_id: string,
    id?: string,
    employeeId?: string
  ) => {
    upsert({
      variables: {
        fields: variables,
        id: id,
        employee: employeeId || router?.query?.id,
        project_id: project_id,
      },
    });
  };
  const returnValue: [
    (
      variables: IUpsertEmployeeAttendanceParams,
      project_id: string,
      id?: string,
      employeeId?: string
    ) => void,
    boolean
  ] = [upsertEmployeeSchedule, loading];

  return returnValue;
};

export default useUpsertEmployeeAttendance;
