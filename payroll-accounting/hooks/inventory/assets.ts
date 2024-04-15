import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    findAllAssets {
      value: id
      label: description
    }
  }
`;

export function UseAssets() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.findAllAssets as OptionsValue[];
  return options;
}
