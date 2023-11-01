import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_PETTY_CASH_NAME = gql`
  {
    pettyCashName {
      value: name
      label: name
    }
  }
`;

export function UsePettyCashNames() {
  const { data } = useQuery<Query>(GET_PETTY_CASH_NAME);
  const list = data?.pettyCashName as OptionsValue[];
  return list;
}
