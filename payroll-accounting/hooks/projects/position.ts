import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  {
    activePositions {
      value: description
      label: description
    }
  }
`;

export function UseEmployeePositions() {
  const { data } = useQuery<Query>(GET_RECORDS, {
    variables: {
      search: "",
    },
  });
  const options = data?.activePositions as OptionsValue[];
  return options;
}
