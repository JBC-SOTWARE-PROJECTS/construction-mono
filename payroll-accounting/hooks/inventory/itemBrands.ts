import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    getBrands {
      value: brand
      label: brand
    }
  }
`;

export function UseItemBrands() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.getBrands as OptionsValue[];
  return options;
}
