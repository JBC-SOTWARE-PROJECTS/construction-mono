import { OptionsValue } from "@/utility/interfaces";
import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useModal } from "react-modal-hook";

const QUERY = gql`
  mutation($) {
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

  return [data?.getScheduleTypes, loading, refetch];
};

export default useGetScheduleTypes;
