import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    genericActive {
      value: id
      label: genericDescription
    }
  }
`;

export function UseItemGenerics() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.genericActive as OptionsValue[];
  return options;
}
