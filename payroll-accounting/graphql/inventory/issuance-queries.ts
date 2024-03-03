import { gql } from "@apollo/client";

export const GET_ISSUANCE_RECORDS = gql`
  query (
    $filter: String
    $office: UUID
    $category: String
    $issueType: String
    $project: UUID
    $asset: UUID
    $page: Int
    $size: Int
  ) {
    stiByFiltersNewPage(
      filter: $filter
      office: $office
      category: $category
      issueType: $issueType
      project: $project
      asset: $asset
      page: $page
      size: $size
    ) {
      content {
        id
        issueNo
        issueDate
        category
        issueFrom {
          id
          officeDescription
        }
        issueTo {
          id
          officeDescription
        }
        issueType
        issued_by {
          id
          fullName
        }
        received_by {
          id
          fullName
        }
        project {
          id
          description
        }
        assets {
          id
          description
        }
        isCancel
        isPosted
      }
      totalElements
      totalPages
      size
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
