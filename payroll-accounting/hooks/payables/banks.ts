import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_BANKS = gql`
  query {
    bankList {
      value: id
      label: bankname
    }
  }
`;

export function UseBanks() {
  const { data } = useQuery<Query>(GET_BANKS);
  const banks = data?.bankList as OptionsValue[];
  return banks;
}
