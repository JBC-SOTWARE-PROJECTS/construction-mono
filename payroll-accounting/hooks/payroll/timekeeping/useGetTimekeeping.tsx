import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const QUERY = gql`
  query ($id: UUID) {
    data: getTimekeepingByPayrollId(id: $id) {
      id
      projectBreakdown {
        project
        projectName
        company
        companyName
        late
        regular
        overtime
        regularHoliday
        overtimeHoliday
        regularDoubleHoliday
        overtimeDoubleHoliday
        regularSpecialHoliday
        overtimeSpecialHoliday
      }

      salaryBreakdown {
        project
        projectName
        company
        companyName
        late
        regular
        overtime
        regularHoliday
        overtimeHoliday
        regularDoubleHoliday
        overtimeDoubleHoliday
        regularSpecialHoliday
        overtimeSpecialHoliday
      }
      status
    }
  }
`;

function useGetTimekeeping(callBack?: (result: any) => void) {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(QUERY, {
    variables: {
      id: router?.query.id,
    },
    onCompleted: (result) => {
      if (callBack) callBack(result?.employees);
    },
  });
  return [data?.data, loading, refetch];
}

export default useGetTimekeeping;
