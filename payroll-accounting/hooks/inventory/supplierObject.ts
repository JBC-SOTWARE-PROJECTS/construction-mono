import { gql, useQuery } from "@apollo/client";
import { Query, Supplier } from "@/graphql/gql/graphql";

const GET_RECORD = gql`
  query ($id: UUID) {
    supById(id: $id) {
      id
      supplierCode
      supplierFullname
    }
  }
`;

export function UseSupplierObject({ id }: { id: string }) {
  const { data } = useQuery<Query>(GET_RECORD, {
    variables: {
      id: id,
    },
  });
  const supplier = data?.supById as Supplier;
  return supplier;
}
