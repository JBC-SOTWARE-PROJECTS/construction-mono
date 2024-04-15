import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    prItemNoPo {
      value: prNo
      label: prNo
    }
  }
`;

export function UsePrNumbersNoPo() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.prItemNoPo as OptionsValue[];
  return options;
}
