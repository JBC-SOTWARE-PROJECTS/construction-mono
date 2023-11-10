import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    itemGroupActive {
      value: id
      label: itemDescription
    }
  }
`;

export function UseItemGroups() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.itemGroupActive as OptionsValue[];
  return options;
}
