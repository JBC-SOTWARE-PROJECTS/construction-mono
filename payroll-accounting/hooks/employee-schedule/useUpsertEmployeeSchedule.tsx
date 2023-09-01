import { EmployeeSchedule } from "@/graphql/gql/graphql";
import { Key } from "@ant-design/pro-components";
import { gql, useMutation } from "@apollo/client";
import { message } from "antd";
import dayjs from "dayjs";

const QUERY = gql`
  mutation (
    $id: UUID
    $employeeId: UUID
    $fields: Map_String_ObjectScalar
    $employeeIdList: [UUID]
    $dates: [String]
  ) {
    upsertEmployeeSchedule(
      id: $id
      employeeId: $employeeId
      fields: $fields
      employeeIdList: $employeeIdList
      dates: $dates
    ) {
      response
      success
      message
    }
  }
`;

export interface IUpsertEmployeeScheduleParams {
  variables: {
    id?: string | null;
    employeeId?: string;
    fields?: EmployeeSchedule;
    dates?: string[];
    employeeIdList?: Key[];
  };
}

const useUpsertEmployeeSchedule = (callBack: () => void) => {
  const [upsert, { loading }] = useMutation(QUERY, {
    onCompleted: (value: any) => {
      const data = value?.upsertEmployeeSchedule || {};
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

  const upsertEmployeeSchedule = ({
    variables,
  }: IUpsertEmployeeScheduleParams) => {
    if (
      variables.dates?.length !== 0 &&
      variables.employeeIdList?.length !== 0
    ) {
      variables.dates?.map((item) => {
        return dayjs(item).format("DD/MM/YYYY");
      });
    }
    upsert({ variables: variables });
  };

  return { upsertEmployeeSchedule, loadingUpsert: loading };
};

export default useUpsertEmployeeSchedule;
