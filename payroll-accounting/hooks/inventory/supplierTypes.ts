import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    supplierTypeActive {
      value: id
      label: supplierTypeDesc
    }
  }
`;

export function UseSupplierTypes() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.supplierTypeActive as OptionsValue[];
  return options;
}
