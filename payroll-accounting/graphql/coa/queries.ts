import { gql } from "@apollo/client";

export const GET_COA_GEN_RECORDS = gql`
  query (
    $accountCategory: String
    $accountType: String
    $motherAccountCode: String
    $accountName: String
    $subaccountType: String
    $department: String
    $excludeMotherAccount: Boolean
  ) {
    coaList: getAllChartOfAccountGenerate(
      accountType: $accountType
      motherAccountCode: $motherAccountCode
      accountName: $accountName
      subaccountType: $subaccountType
      department: $department
      accountCategory: $accountCategory
      excludeMotherAccount: $excludeMotherAccount
    ) {
      code
      accountName
      accountType
      accountCategory
    }
  }
`;
