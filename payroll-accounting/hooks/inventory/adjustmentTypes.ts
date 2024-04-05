import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    filterAdjustmentType(is_active: true, filter: "") {
      value: id
      label: description
    }
  }
`;

export function UseAdjustmentTypes() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const options = data?.filterAdjustmentType as OptionsValue[];
  return options;
}
