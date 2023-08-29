import { EmployeeSchedule } from "@/graphql/gql/graphql";
import { gql, useMutation } from "@apollo/client";
import { message } from "antd";

const QUERY = gql`
  mutation ($id: UUID, $employeeId: UUID, $fields: Map_String_ObjectScalar) {
    upsertEmployeeSchedule(id: $id, employeeId: $employeeId, fields: $fields) {
      response {
        id
      }
      success
      message
    }
  }
`;

export interface IUpsertEmployeeScheduleParams {
  variables: {
    id?: string | null;
    employeeId: string;
    fields?: EmployeeSchedule;
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
    upsert({ variables: variables });
  };

  return { upsertEmployeeSchedule, loadingUpsert: loading };
};

export default useUpsertEmployeeSchedule;
