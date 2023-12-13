import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_RECORDS = gql`
  query($search: String) {
    findAllCustomerList(search: $search) {
      value: id
      label: customerName
    }
  }
`;

export function UseClients() {
  const { data } = useQuery<Query>(GET_RECORDS, {
    variables: {
      search: "",
    }
  });
  const options = data?.findAllCustomerList as OptionsValue[];
  return options;
}
