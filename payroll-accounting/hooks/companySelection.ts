import { gql, useQuery } from "@apollo/client";
import { CompanySettings, Query } from "@/graphql/gql/graphql";

const GET_COMPANY = gql`
  query {
    companyListSelection {
      id
      companyCode
      companyName
    }
  }
`;

export function UseCompanySelection() {
  const { data } = useQuery<Query>(GET_COMPANY);
  const companies = data?.companyListSelection as CompanySettings[];
  return companies || [];
}
