import { PayrollFormUsage } from "@/components/payroll/PayrollForm";
import { Payroll, Projects } from "@/graphql/gql/graphql";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

function useGetActiveProjects() {
  const router = useRouter();
  const { loading, data } = useQuery(gql`
    query {
      list: getActiveProjects {
        id
        description
      }
    }
  `);

  const returnValue: [[Projects], boolean] = [data?.list, loading];
  return returnValue;
}

export default useGetActiveProjects;
