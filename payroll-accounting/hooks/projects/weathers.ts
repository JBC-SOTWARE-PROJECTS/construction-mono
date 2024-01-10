import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  {
    weatherList {
      value: weather
      label: weather
    }
  }
`;

export function UseWeathers() {
  const { data } = useQuery<Query>(GET_RECORDS, {
    variables: {
      search: "",
    },
  });
  const options = data?.weatherList as OptionsValue[];
  return options;
}
