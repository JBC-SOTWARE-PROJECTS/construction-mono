import { gql, useQuery } from "@apollo/client";
import { JobStatus, Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    jobStatusActive {
      id
      description
      disabledEditing
      statusColor
    }
  }
`;

export function UseProjectStatusList() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const list = data?.jobStatusActive as JobStatus[];
  return list;
}
