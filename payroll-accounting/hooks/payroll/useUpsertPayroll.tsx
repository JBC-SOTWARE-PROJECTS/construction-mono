import { PayrollFormUsage } from "@/components/payroll/PayrollForm";
import { gql, useMutation } from "@apollo/client";
import { message } from "antd";
import { useRouter } from "next/router";
import { Key } from "react";

const UPSERT_PAYROLL = gql`
  mutation (
    $id: UUID
    $fields: Map_String_ObjectScalar
    $employeeList: [UUID]
  ) {
    upsertPayroll(id: $id, fields: $fields, employeeList: $employeeList) {
      message
      response {
        id
      }
      returnId
    }
  }
`;

interface IParams {
  id: string | string[] | undefined;
  fields: object;
  employeeList: Key[];
}

function useUpsertPayroll(usage: string) {
  const router = useRouter();
  const [upsert, { loading }] = useMutation(UPSERT_PAYROLL, {
    onCompleted: (data) => {
      message.success(data.upsertPayroll.message);
      if (usage === PayrollFormUsage.CREATE) {
        router.push(
          `/payroll/payroll-management/${data?.upsertPayroll?.response?.id}/edit`
        );
      } else if (usage === PayrollFormUsage.EDIT_EMPOYEES) {
        router.back();
      }
    },
    onError: () => {
      message.error("Something went wrong, Please try again later.");
    },
  });

  const upsertPayroll = ({ id, fields, employeeList }: IParams) => {
    upsert({ variables: { id, fields, employeeList } });
  };

  const returnValue: [(params: IParams) => void, boolean] = [
    upsertPayroll,
    loading,
  ];
  return returnValue;
}

export default useUpsertPayroll;
