import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import _ from "lodash";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    apReferenceType {
      value: referenceType
      label: referenceType
    }
  }
`;

export function UseReferenceType() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const mappedValues = data?.apReferenceType as OptionsValue[];
  return mappedValues;
}
