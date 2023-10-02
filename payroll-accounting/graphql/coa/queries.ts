import { gql } from "@apollo/client";

export const GET_COA_GEN_RECORDS = gql`
  query (
    $accountType: String
    $motherAccountCode: String
    $subaccountType: String
    $description: String
    $department: String
    $excludeMotherAccount: Boolean
  ) {
    subaccountTypeAll
    motherAccounts: coaList {
      id
      accountCode
      description
    }
    subAccountsSetup: getSetupBySubAccountTypeAll {
      id
      subaccountCode
      description
      subaccountType
      subaccountTypeDesc
    }
    coaList: getAllChartOfAccountGenerate(
      accountType: $accountType
      motherAccountCode: $motherAccountCode
      subaccountType: $subaccountType
      description: $description
      department: $department
      excludeMotherAccount: $excludeMotherAccount
    ) {
      code
      description
      accountType
    }
    flattedDept: getFlattenDepartment {
      id
      code
      description
    }
  }
`;
