import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    getUnitProjects {
      value: unit
      label: unit
    }
  }
`;

export function UseProjectCostUnits() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.getUnitProjects as OptionsValue[];
  return options;
}
