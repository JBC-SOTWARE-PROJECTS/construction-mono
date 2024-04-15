import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query ($tag: String) {
    transTypeByTag(tag: $tag) {
      value: id
      label: description
    }
  }
`;

export function UseTransactionTypes(type: string) {
  const { data } = useQuery<Query>(GET_RECORDS, {
    variables: {
      tag: type,
    },
  });
  const options = data?.transTypeByTag as OptionsValue[];
  return options;
}
