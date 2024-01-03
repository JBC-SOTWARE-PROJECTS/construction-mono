import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    getCategoryProjects {
      value: category
      label: category
    }
  }
`;

export function UseProjectCostCategory() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.getCategoryProjects as OptionsValue[];
  return options;
}
