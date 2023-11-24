import { Assets, Query } from "@/graphql/gql/graphql";
import { IAssetMaintenanceTypeState } from "@/routes/inventory/assets/configuration/MaintenanceTypeConfig";
import { IAssetState } from "@/routes/inventory/assets/masterfile";
import { QueryHookOptions, gql, useQuery } from "@apollo/client";
import React, { useState } from "react";

const GET_RECORDS = gql`
  query ($filter: String, $page: Int, $size: Int) {
    list: assetMaintenanceTypeListPageable(filter: $filter, page: $page, size: $size) {
      content {
        id
        name
        description
      }
      size
      totalElements
      number
    }
  }
`;

const initialState: IAssetMaintenanceTypeState = {
  filter: "",
  page: 0,
  size: 10,
};

export default function useGetAssetMaintenanceType(props: QueryHookOptions) {
  const [filter, setFilters] = useState(initialState);
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: filter?.filter,
      page: filter?.page,
      size: filter?.size,
    },
    fetchPolicy: "network-only",
    ...props,
    onCompleted: (res) => {
      if (props.onCompleted) {
        return props.onCompleted(res.list);
      }
    },
  });

  const returnValue: [any, boolean, () => void] = [
    data?.list,
    loading,
    refetch,
  ];

  return returnValue;
}
