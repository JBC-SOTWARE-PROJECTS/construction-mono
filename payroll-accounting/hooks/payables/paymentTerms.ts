import { gql, useQuery } from "@apollo/client";
import { Query } from "@/graphql/gql/graphql";
import { OptionsValue } from "@/utility/interfaces";

const GET_PAYMENT_TERMS = gql`
  query {
    paymentTermActive {
      value: id
      label: paymentDesc
    }
  }
`;

export function UsePaymentTerms() {
  const { data } = useQuery<Query>(GET_PAYMENT_TERMS);
  const banks = data?.paymentTermActive as OptionsValue[];
  return banks;
}
