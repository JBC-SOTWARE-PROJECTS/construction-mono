import { IState } from "@/routes/payroll/employees";
import { QueryHookOptions, gql, useQuery } from "@apollo/client";
import { useState } from "react";

const GET_RECORDS = gql`
  query ($filter: String, $status: Boolean, $office: UUID, $position: UUID) {
    list: employeeByFilter(
      filter: $filter
      status: $status
      office: $office
      position: $position
    ) {
      id
      employeeNo
      fullName
      position {
        id
        description
      }
      office {
        id
        officeDescription
      }
      emailAddress
      employeeCelNo
      gender
      isActive
    }
  }
`;

const initialState: IState = {
  filter: "",
  status: true,
  page: 0,
  size: 10,
  office: null,
  position: null,
};
const useGetEmployeesByFilter = (props: QueryHookOptions) => {
  const [filter, setFilters] = useState(initialState);
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: filter.filter,
      status: filter.status,
      office: filter.office,
      position: filter.position,
    },
    fetchPolicy: "network-only",
    ...props,
    onCompleted: (res) => {
      if (props.onCompleted) {
        return props.onCompleted(res.list);
      }
      console.log(filter);
    },
  });
  return [data?.list, loading, setFilters, refetch];
};

export default useGetEmployeesByFilter;
