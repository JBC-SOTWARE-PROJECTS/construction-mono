import { OvertimeDetails } from "@/components/payroll/employee-management/work-schedule/AssignEmployeeScheduleModal";
import { EmployeeSchedule } from "@/graphql/gql/graphql";
import { transformDate, transformDateRange } from "@/utility/helper";
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
    $datesWithSchedule: [DateWithScheduleInput]
    $overtimeProject: String
    $mode: String
  ) {
    upsertEmployeeSchedule(
      id: $id
      employeeId: $employeeId
      fields: $fields
      employeeIdList: $employeeIdList
      datesWithSchedule: $datesWithSchedule
      overtimeProject: $overtimeProject
      mode: $mode
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
    overtimeDetails?: OvertimeDetails;
    mode?: string;
    datesWithSchedule?: any[];
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
      variables.datesWithSchedule = variables.dates?.map((item) => {
        var dateString = item.substring(0, 10);
        var overtimeMap;
        if (variables.overtimeDetails?.overtimeType === "FIXED") {
          overtimeMap = transformDateRange(
            dayjs(item),
            variables.overtimeDetails?.start?.toString(),
            variables.overtimeDetails?.end?.toString()
          );
        }

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
          overtimeStart:
            overtimeMap?.start ||
            transformDate(dayjs(item), variables?.fields?.dateTimeStart),
          overtimeEnd: overtimeMap?.end,
          overtimeType: variables.overtimeDetails?.overtimeType,
        };
      });
    }
    var schedMap;
    var obj;
    schedMap = transformDateRange(
      dayjs(variables.fields?.dateTimeStart),
      variables.fields?.dateTimeStart?.toString(),
      variables.fields?.dateTimeEnd?.toString()
    );
    obj = {
      dateTimeStart: schedMap.start,
      dateTimeEnd: schedMap.end,
    };

    upsert({
      variables: {
        ...variables,
        fields: { ...variables?.fields, ...obj },
        overtimeProject: variables.overtimeDetails?.project,
      },
    });
  };

  return { upsertEmployeeSchedule, loadingUpsert: loading };
};

export default useUpsertEmployeeSchedule;
