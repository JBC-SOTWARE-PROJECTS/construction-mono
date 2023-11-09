import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import _ from "lodash";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    disReferenceType {
      value: referenceType
      label: referenceType
    }
  }
`;

export function UseReferenceDisbursementType() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const mappedValues = data?.disReferenceType as OptionsValue[];
  return mappedValues;
}
