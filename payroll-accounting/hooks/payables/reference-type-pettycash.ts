import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import _ from "lodash";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    pcReferenceType {
      value: referenceType
      label: referenceType
    }
  }
`;

export function UseReferencePettyCashType() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const mappedValues = data?.pcReferenceType as OptionsValue[];
  return mappedValues;
}
