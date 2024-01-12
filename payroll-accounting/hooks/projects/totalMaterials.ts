import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";

const GET_RECORDS = gql`
  query ($id: UUID) {
    getTotalMaterials(id: $id)
  }
`;

export function GetTotalMaterials(id?: string | null) {
  const { data } = useQuery<Query>(GET_RECORDS, {
    variables: {
      id: id,
    },
  });
  const result = data?.getTotalMaterials as number;
  return result;
}
