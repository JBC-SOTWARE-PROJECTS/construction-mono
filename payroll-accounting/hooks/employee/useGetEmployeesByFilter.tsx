import { OptionsValue } from "@/utility/interfaces";
import { QueryHookOptions, gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useModal } from "react-modal-hook";

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

interface FiltersData {
  office: OptionsValue[];
  position: OptionsValue[];
}

const useGetEmployeesByFilter = (props: QueryHookOptions) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: props.variables,
    fetchPolicy: "network-only",
    ...props,
    onCompleted: (res) => {
      if (props.onCompleted) {
        return props.onCompleted(res.list);
      }
    },
  });
  return [data?.list, loading, refetch];
};

export default useGetEmployeesByFilter;
