import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    jobStatusActive {
      value: description
      label: description
    }
  }
`;

export function UseProjectStatus() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.jobStatusActive as OptionsValue[];
  return options;
}
