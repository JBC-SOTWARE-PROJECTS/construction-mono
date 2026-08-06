import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($projectId: String, $filter: String, $page: Int, $size: Int) {
    list: projectExpenseView(
      projectId: $projectId
      filter: $filter
      page: $page
      size: $size
    ) {
      content {
        id {
          transTypeId
          sourceCategory
        }
        project {
          id
        }
        projectDescription
        transactionType {  # if you exposed this as an object
          id
          description
        }
        transTypeDescription
        totalNetAmount
        lineCount
        payableCount
        pettyCashCount
        sourceType
      }
      size
      totalElements
      number
    }
  }
`;

const useGetProjectExpense = (props: QueryHookOptions) => {
  const { loading, data, refetch, error } = useQuery(GET_RECORDS, {
    ...props,
  });

  // console.log("projectExpense", data, error);
  return [data?.list?.content, loading, refetch];
};

export default useGetProjectExpense;
