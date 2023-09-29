import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_AP_TRANSACTION_TYPE = gql`
  query ($type: UUID, $cat: String) {
    apTransactionByType(type: $type, category: $cat) {
      value: id
      label: description
    }
  }
`;

interface Iprops {
  type: string;
  category: string;
}

export function UseAPTransactionType(props: Iprops) {
  const { type, category } = props;
  const { data } = useQuery<Query>(GET_AP_TRANSACTION_TYPE, {
    variables: {
      type: type,
      cat: category,
    },
  });
  const list = data?.apTransactionByType as OptionsValue[];
  return list;
}
