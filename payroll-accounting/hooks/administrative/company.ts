import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_COMPANY = gql`
  query {
    companyList(filter: "") {
      value: id
      label: companyName
    }
  }
`;

export function UseCompany() {
  const { data } = useQuery<Query>(GET_COMPANY);
  const companies = data?.companyList as OptionsValue[];
  return companies;
}
