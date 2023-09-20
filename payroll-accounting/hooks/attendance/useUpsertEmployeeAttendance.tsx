import { EmployeeSchedule } from "@/graphql/gql/graphql";
import { Key } from "@ant-design/pro-components";
import { gql, useMutation } from "@apollo/client";
import { message } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
const UPSERT_EMPLOYEE_ATTENDANCE = gql`
  mutation ($id: UUID, $employee: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertEmployeeAttendance(
      id: $id
      employee: $employee
      fields: $fields
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
}

const useUpsertEmployeeAttendance = (callBack: () => void) => {
  const router = useRouter();
  const [upsert, { loading }] = useMutation(UPSERT_EMPLOYEE_ATTENDANCE, {
    onCompleted: (value: any) => {
      const data = value?.data || {};
      if (data?.success) {
        message.success(
          data?.message || "Successfully created department schedule"
        );

        if (callBack) callBack();
      } else {
        message.error(data?.message || "Failed to create department schedule");
      }
    },
  });

  const upsertEmployeeSchedule = (
    variables: IUpsertEmployeeAttendanceParams,
    id?: string
  ) => {
    upsert({
      variables: {
        fields: variables,
        id: id,
        employee: router?.query?.id,
      },
    });
  };
  const returnValue: [
    (variables: IUpsertEmployeeAttendanceParams, id?: string) => void,
    boolean
  ] = [upsertEmployeeSchedule, loading];

  return returnValue;
};

export default useUpsertEmployeeAttendance;
