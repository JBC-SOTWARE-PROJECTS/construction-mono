import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_AP_TRANSACTION_TYPE = gql`
  query ($cat: String) {
    apTransactionOthers(category: $cat) {
      value: id
      label: description
    }
  }
`;

interface Iprops {
  category: string;
}

export function UseAPTransactionTypeOthers(props: Iprops) {
  const { category } = props;
  const { data } = useQuery<Query>(GET_AP_TRANSACTION_TYPE, {
    variables: {
      cat: category,
    },
  });
  const list = data?.apTransactionOthers as OptionsValue[];
  return list;
}
