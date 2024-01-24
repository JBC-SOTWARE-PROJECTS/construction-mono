import { EmployeeSchedule } from "@/graphql/gql/graphql";
import { transformDate } from "@/utility/helper";
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
    $dates: [DateWithScheduleInput]
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
    dates?: any[];
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
      variables.dates = variables.dates?.map((item) => {
        var dateString = item.substring(0, 10);
        return {
          dateString: dateString,
          dateTimeStart: transformDate(
            dayjs(item),
            variables?.fields?.dateTimeStart
          ),
          dateTimeEnd: transformDate(
            dayjs(item),
            variables?.fields?.dateTimeEnd
          ),
          mealBreakStart: transformDate(
            dayjs(item),
            variables?.fields?.mealBreakStart
          ),
          mealBreakEnd: transformDate(
            dayjs(item),
            variables?.fields?.mealBreakEnd
          ),
        };
      });
    }
    upsert({ variables: variables });
  };

  return { upsertEmployeeSchedule, loadingUpsert: loading };
};

export default useUpsertEmployeeSchedule;
