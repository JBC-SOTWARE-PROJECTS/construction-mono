import { IAssetState } from "@/routes/inventory/assets/masterfile";
import { QueryHookOptions, gql, useQuery } from "@apollo/client";
import { useState } from "react";

const GET_RECORDS = gql`
  query (
    $filter: String
    $status: AssetStatus
    $page: Int
    $size: Int
    $type: AssetType
  ) {
    list: assetListPageable(
      filter: $filter
      status: $status
      page: $page
      size: $size
      type: $type
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
        prefix
        item{
          id
          descLong
        }
        fixedAssetItem{
          id
          serialNo
          assetNo
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
  size: 10,
  type: null,
};

export default function useGetAssets(props: QueryHookOptions) {
  const [filter, setFilters] = useState(initialState);
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      filter: filter?.filter,
      status: filter?.status,
      page: filter?.page,
      size: filter?.size,
      type: filter?.type,
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
