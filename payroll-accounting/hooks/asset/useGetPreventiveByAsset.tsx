import { gql, useQuery } from "@apollo/client";

const GET_RECORDS = gql`
  query ($id: UUID) {
    data: preventiveByAsset(id: $id) {
      id
      scheduleType
      occurrence
      reminderSchedule
      assetMaintenanceType{
        id
        description
      }
    }
  }
`;

const useGetPreventiveByAsset = (id: any) => {
  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: id,
    },
    fetchPolicy: "network-only",
  });
  return [data?.data , loading, refetch];
};

export default useGetPreventiveByAsset;
