import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_TERMINALS = gql`
  query {
    terminals {
      value: id
      label: terminalName
    }
  }
`;

export function UseTerminals() {
  const { data } = useQuery<Query>(GET_TERMINALS);
  const terminals = data?.terminals as OptionsValue[];
  return terminals;
}
