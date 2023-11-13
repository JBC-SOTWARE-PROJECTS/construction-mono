import { gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($id: UUID) {
    data: assetById(id: $id) {
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
  }
`;

const useGetAssetById = (id: any) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: id,
    },
    fetchPolicy: "network-only",
  });
  return [data?.data , loading, , refetch];
};

export default useGetAssetById;
