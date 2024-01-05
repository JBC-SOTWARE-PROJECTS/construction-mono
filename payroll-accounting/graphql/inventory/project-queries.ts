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
          customerName
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

export const UPSERT_RECORD_PROJECT = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertProject(id: $id, fields: $fields) {
      id
    }
  }
`;

export const GET_PROJECT_BY_ID = gql`
  query ($id: UUID) {
    projectById(id: $id) {
      id
      projectCode
      description
      projectStarted
      projectEnded
      customer {
        id
        customerName
        customerType
        address
        contactNo
        contactEmail
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
  }
`;

export const GET_PROJECT_COST = gql`
  query ($filter: String, $id: UUID) {
    pCostByList(filter: $filter, id: $id) {
      id
      dateTransact
      description
      refNo
      unit
      totalCost
      category
      cost
      qty
      status
      tagNo
      lastModifiedBy
    }
  }
`;

export const GET_PROJECT_COST_REV = gql`
  query ($id: UUID) {
    pCostRevByList(id: $id) {
      id
      prevDate
      qty
      unit
      cost
      totalCost
      tagNo
      createdBy
    }
  }
`;

export const UPSERT_RECORD_PROJECT_COST = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertProjectCost(id: $id, fields: $fields) {
      payload
      success
      message
    }
  }
`;

export const DELETE_PROJECT_COST_ITEM = gql`
  mutation ($id: UUID) {
    updateStatusCost(id: $id) {
      id
    }
  }
`;

export const REVISE_RECORD_PROJECT_COST = gql`
  mutation ($fields: Map_String_ObjectScalar, $id: UUID, $tag: String) {
    reviseProjectCost(fields: $fields, id: $id, tag: $tag) {
      id
    }
  }
`;

export const GET_RECORDS_PROJECT_ACCOMPLISHMENTS = gql`
  query ($filter: String, $id: UUID) {
    pUpdatesByList(filter: $filter, id: $id) {
      id
      transNo
      dateTransact
      description
      accomplishment
      weather
      status
      createdBy
    }
  }
`;

export const UPSERT_RECORD_PROJECT_ACCOMPLISHMENT = gql`
  mutation ($fields: Map_String_ObjectScalar, $date: String, $id: UUID) {
    upsertProjectUpdates(fields: $fields, date: $date, id: $id) {
      payload
      success
      message
    }
  }
`;
