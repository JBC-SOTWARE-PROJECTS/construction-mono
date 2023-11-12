import { Assets, Query } from "@/graphql/gql/graphql";
import { IState } from "@/routes/administrative/Employees";
import { IAssetState } from "@/routes/inventory/assets/masterfile";
import { QueryHookOptions, gql, useQuery } from "@apollo/client";
import React, { useState } from 'react';


const GET_RECORDS = gql`
query ($filter: String, $status: String, $page: Int, $size: Int) {
    list: assetListPageable(
      filter: $filter
      status: $status
      page: $page
      size: $size
    ) {
      content {
        id
        assetCode
        description
        brand
        model
        plateNo
        image
        status
        type
        item{
          id
          descLong
        }
      }
      size
      totalElements
      number
    }
  }
`;

const initialState: IAssetState = {
    filter: "",
    status: null,
    page: 0,
    size: 10
  };

export default function useGetAssets(props: QueryHookOptions) {
  
    const [filter, setFilters] = useState(initialState);
    const { loading, data, refetch } = useQuery(GET_RECORDS, {
      variables: {
        filter: filter?.filter,
        status: filter?.status,
        page: filter?.page,
        size: filter?.size
      },
      fetchPolicy: "network-only",
      ...props,
      onCompleted: (res) => {
        if (props.onCompleted) {
          return props.onCompleted(res.list);
        }
      },
    });


    //return [data?.list, loading, setFilters, refetch];
    const returnValue: [any, boolean, () => void] = [
        data?.list,
        loading,
        refetch,
      ];
    
      return returnValue;
}