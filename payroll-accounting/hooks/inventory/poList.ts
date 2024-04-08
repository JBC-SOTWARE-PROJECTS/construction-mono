import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    poList {
      value: id
      label: poNumber
    }
  }
`;

export function UsePurcaseOrderList() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.poList as OptionsValue[];
  return options;
}
