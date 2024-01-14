import { gql, useQuery } from "@apollo/client";
import { useState } from "react";

const GET_RECORDS = gql`
  query ($filter: String, $position: UUID, $office: UUID) {
    list: getAllEmployeesBasic(
      filter: $filter
      position: $position
      office: $office
    ) {
      id
      fullName
    }
  }
`;
const initialState = {
  filter: "",
  position: null,
  office: null,
};
const useGetEmployeesBasic = () => {
  const [filter, setFilters] = useState(initialState);
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      ...filter,
    },
    fetchPolicy: "network-only",
  });
  return [data?.list || [], loading, setFilters];
};

export default useGetEmployeesBasic;
