import { IPaginationFilters } from "@/utility/interfaces";
import { gql, useQuery } from "@apollo/client";
import React from "react";

const PAYROLL_PAGABLE_QUERY = gql`
  query ($size: Int, $page: Int, $filter: String) {
    payrolls: getPayrollByPagination(
      size: $size
      page: $page
      filter: $filter
    ) {
      content {
        id
        title
        dateStart
        dateEnd
        status
        createdBy
        createdDate
      }
      totalElements
    }
  }
`;

function useGetPayrollPagable(filterState: IPaginationFilters) {
  const { data, loading, refetch } = useQuery(PAYROLL_PAGABLE_QUERY, {
    fetchPolicy: "network-only",
    variables: filterState,
  });

  return [
    data?.payrolls?.content,
    loading,
    refetch,
    data?.payrolls?.totalElements,
  ];
}

export default useGetPayrollPagable;
