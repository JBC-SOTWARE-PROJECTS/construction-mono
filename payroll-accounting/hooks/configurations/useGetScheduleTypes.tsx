import { Schedule } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";
import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useModal } from "react-modal-hook";

const QUERY = gql`
  query {
    getScheduleTypes {
      id
      title
      label
      dateTimeStartRaw
      dateTimeEndRaw
      mealBreakStart
      mealBreakEnd
    }
  }
`;

const useGetScheduleTypes = () => {
  const { data, loading, refetch } = useQuery(QUERY);
  const returnValue: [Schedule[], boolean, () => {}] = [
    data?.getScheduleTypes,
    loading,
    refetch,
  ];
  return returnValue;
};

export default useGetScheduleTypes;
