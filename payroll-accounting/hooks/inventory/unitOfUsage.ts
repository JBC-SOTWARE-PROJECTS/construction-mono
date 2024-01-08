import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    uouList {
      value: id
      label: unitDescription
    }
  }
`;

export function UseUnitOfUsage() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.uouList as OptionsValue[];
  return options;
}
