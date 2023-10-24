import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_ACCOUNT_TEMPLATE = gql`
  query ($type: UUID, $cat: String) {
    apAccountsTemplateByType(type: $type, category: $cat) {
      value: id
      label: description
    }
  }
`;

interface Iprops {
  type: string;
  category: string;
}

export function UseAccountsTemplate(props: Iprops) {
  const { type, category } = props;
  const { data } = useQuery<Query>(GET_ACCOUNT_TEMPLATE, {
    variables: {
      type: type,
      cat: category,
    },
  });
  const list = data?.apAccountsTemplateByType as OptionsValue[];
  return list;
}
