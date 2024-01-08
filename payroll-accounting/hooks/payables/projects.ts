import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import _ from "lodash";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query ($id: UUID) {
    projectByOffice(id: $id) {
      value: id
      label: description
    }
  }
`;

interface IProps {
  office: string;
}

export function UseProjects({ office }: IProps) {
  const { data } = useQuery<Query>(GET_RECORDS, {
    variables: {
      id: _.isEmpty(office) ? null : office,
    },
  });
  const mappedValues = data?.projectByOffice as OptionsValue[];
  return mappedValues;
}
