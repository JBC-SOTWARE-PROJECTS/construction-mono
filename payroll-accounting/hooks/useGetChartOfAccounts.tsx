import { GET_COA_GEN_RECORDS } from "@/graphql/coa/queries";
import { useQuery } from "@apollo/client";
import { message } from "antd";

const useGetChartOfAccounts = (category?: string) => {
  const { loading, data } = useQuery(GET_COA_GEN_RECORDS, {
    fetchPolicy: "cache-and-network",
    variables: {
      accountType: null,
      motherAccountCode: null,
      accountName: "",
      subaccountType: null,
      department: null,
      accountCategory: category,
      excludeMotherAccount: true,
    },
    onError: (error) => {
      if (error) {
        message.error(
          "Something went wrong. Cannot generate Chart of Accounts"
        );
      }
    },
  });

  return [data?.coaList, loading];
};

export default useGetChartOfAccounts;
