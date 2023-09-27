import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_OFFICES = gql`
  query {
    activeOffices {
      value: id
      label: officeDescription
    }
  }
`;

export function UseOffices() {
  const { data } = useQuery<Query>(GET_OFFICES);
  const list = data?.activeOffices as OptionsValue[];
  return list;
}
