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
        transType {
          id
          description
        }
        remarks
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

export const GET_RECORDS_ISSUANCE_ITEMS = gql`
  query ($id: UUID) {
    stiItemByParent(id: $id) {
      id
      item {
        id
        descLong
        item_conversion
        vatable
        unit_of_usage {
          id
          unitDescription
        }
      }
      uou
      issueQty
      unitCost
      isPosted
      remarks
    }
  }
`;

export const UPSERT_RECORD_ISSUANCE = gql`
  mutation (
    $fields: Map_String_ObjectScalar
    $items: [Map_String_ObjectScalar]
    $id: UUID
  ) {
    upsertSTI(fields: $fields, items: $items, id: $id) {
      id
    }
  }
`;

export const DELETE_RECORD_ISSUE_ITEM = gql`
  mutation ($id: UUID) {
    removeStiItem(id: $id) {
      id
    }
  }
`;

export const GET_JOURNAL_ITEM_ISSUANCE = gql`
  query ($id: UUID, $status: Boolean) {
    issuanceExpenseAccountView(id: $id, status: $status) {
      code
      desc
      debit
      credit
    }
  }
`;

export const POST_VOID_ITEM_ISSUANCE = gql`
  mutation ($id: UUID, $items: [Map_String_ObjectScalar], $status: Boolean) {
    postInventoryIssuanceExpense(id: $id, items: $items, status: $status) {
      id
    }
  }
`;
