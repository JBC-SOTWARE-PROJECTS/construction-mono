import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_EXPENSE_TRANSACTION_TYPE = gql`
  query ($type: String) {
    transTypeByType(type: $type, filter: "") {
      value: id
      label: description
    }
  }
`;

interface Iprops {
  type: string;
}

export function UseExpenseTransaction(props: Iprops) {
  const { type } = props;
  const { data } = useQuery<Query>(GET_EXPENSE_TRANSACTION_TYPE, {
    variables: {
      type: type,
    },
  });
  const list = data?.transTypeByType as OptionsValue[];
  return list;
}
