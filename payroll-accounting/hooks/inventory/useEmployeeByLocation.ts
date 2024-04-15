import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query ($filter: String, $position: UUID, $office: UUID) {
    getAllEmployeesBasic(
      filter: $filter
      position: $position
      office: $office
    ) {
      value: id
      label: fullName
    }
  }
`;
export function UseEmployeeByLocation(office: string | null) {
  const { data } = useQuery<Query>(GET_RECORDS, {
    variables: {
      filter: "",
      position: null,
      office: office,
    },
  });
  const options = data?.getAllEmployeesBasic as OptionsValue[];
  return options;
}
