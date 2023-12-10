import { gql } from "@apollo/client";

export const GET_PROJECTS_RECORDS = gql`
  query (
    $filter: String
    $customer: UUID
    $location: UUID
    $status: String
    $page: Int
    $size: Int
  ) {
    projectListPageable(
      filter: $filter
      customer: $customer
      location: $location
      status: $status
      page: $page
      size: $size
    ) {
      content {
        id
        projectCode
        description
        projectStarted
        projectEnded
        customer {
          id
          accountName
        }
        location {
          id
          officeDescription
          fullAddress
        }
        image
        remarks
        totals
        disabledEditing
        prefixShortName
        projectColor
        projectStatusColor
        status
      }
      size
      totalElements
      number
    }
  }
`;

export const UPSERT_RECORD_ITEM = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertItem(id: $id, fields: $fields) {
      payload
      success
      message
    }
  }
`;
