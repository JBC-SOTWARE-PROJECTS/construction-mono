import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    uopList {
      value: id
      label: unitDescription
    }
  }
`;

export function UseUnitOfPurchase() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.uopList as OptionsValue[];
  return options;
}
