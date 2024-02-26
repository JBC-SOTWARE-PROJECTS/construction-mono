import { QueryHookOptions, gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($id: UUID, $filter: String,  $page: Int, $size: Int) {
    list: rentalRateListByAssetPageable(
        id: $id
        filter: $filter
        page: $page
        size: $size
      ) {
        content {
          id
          rentType
          description
          measurement
          amount
          unit
          asset{
            id
          }
        }
        size
        totalElements
        number
    }
  }
`;

const useGetRentalRateByAsset = (props: QueryHookOptions ) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    ...props
  });
  return [data?.list , loading, refetch];
};

export default useGetRentalRateByAsset;
