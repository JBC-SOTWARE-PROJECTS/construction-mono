import { gql } from "@apollo/client";

export const GET_COMPANY_RECORDS = gql`
  query ($filter: String!, $size: Int, $page: Int) {
    companyPage(filter: $filter, size: $size, page: $page) {
      content {
        id
        companyCode
        companyName
        vatRate
        markup
        govMarkup
        isActive
        hideInSelection
      }
      totalElements
      number
      size
    }
  }
`;

export const UPSER_COMPANY_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertCompany(id: $id, fields: $fields) {
      id
    }
  }
`;

export const CHANGE_COMPANY = gql`
  mutation ($id: UUID, $company: UUID) {
    changeCompany(id: $id, company: $company) {
      id
    }
  }
`;
