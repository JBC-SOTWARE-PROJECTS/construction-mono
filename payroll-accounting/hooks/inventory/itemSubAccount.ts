import { gql, useQuery } from "@apollo/client";
import { ItemSubAccount, Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

interface IProps {
  type: string[];
}

const GET_RECORDS = gql`
  query ($type: [String]) {
    itemSubAccountActive(type: $type) {
      value: id
      label: subAccountDescription
    }
  }
`;

export function UseItemSubAccount({ type }: IProps) {
  const { data } = useQuery<Query>(GET_RECORDS, {
    variables: {
      type: type,
    },
  });
  const options = data?.itemSubAccountActive as OptionsValue[];
  return options;
}
