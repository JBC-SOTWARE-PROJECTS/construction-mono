import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import _ from "lodash";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query {
    dmReferenceType {
      value: referenceType
      label: referenceType
    }
  }
`;

export function UseReferenceDebitMemoType() {
  const { data } = useQuery<Query>(GET_RECORDS);
  const mappedValues = data?.dmReferenceType as OptionsValue[];
  return mappedValues;
}
