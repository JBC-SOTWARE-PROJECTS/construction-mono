import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    supplierActive {
      value: id
      label: supplierFullname
    }
  }
`;

export function UseSupplier() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.supplierActive as OptionsValue[];
  return options;
}
