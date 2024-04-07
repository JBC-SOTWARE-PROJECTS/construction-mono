import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    poNotYetCompleted {
      value: id
      label: poNumber
    }
  }
`;

export function UsePONotYetCompleted() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.poNotYetCompleted as OptionsValue[];
  return options;
}
