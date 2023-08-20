import { OptionsValue } from "@/utility/interfaces";
import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useModal } from "react-modal-hook";

const FILTERS = gql`
  query {
    office: activeOffices {
      id
      name: officeDescription
    }
    pos: activePositions {
      id
      name: description
    }
  }
`;
interface FiltersData {
  office: OptionsValue[];
  position: OptionsValue[];
}

const useGetFilters = () => {
  const { data, loading } = useQuery(FILTERS);

  const office = data?.office?.map((item: any) => {
    return { label: item.name, value: item.id };
  });

  const position = data?.pos?.map((item: any) => {
    return { label: item.name, value: item.id };
  });

  const filters: any = {
    office: office || [],
    position: position || [],
  };

  return [filters, loading];
};

export default useGetFilters;
