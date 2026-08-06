import { gql } from "@apollo/client";

export const GET_ACCOUNTS_FOLIO_RECORD = gql`
  query ($filter: String, $status: Boolean, $page: Int, $size: Int) {
    billingAllByFiltersPage(
      filter: $filter
      status: $status
      page: $page
      size: $size
    ) {
      content {
        id
        dateTrans
        billNo
        customer {
          id
          customerName
        }
        project {
          id
          projectCode
          description
        }
        otcName
        locked
        lockedBy
        balance
        status
      }
      size
      totalElements
      number
    }
    totalBalances
  }
`;

export const GET_SHIFTING_RECORDS = gql`
  query ($filter: String, $status: Boolean) {
    activeShiftList(filter: $filter, status: $status) {
      id
      terminal {
        id
        terminal_no
      }
      employee {
        id
        fullName
      }
      shiftNo
      active
      startShift
      endShift
      remarks
    }
  }
`;

export const GET_RECORD_TERMINAL_LIST = gql`
  query ($filter: String) {
    terminalFilter(filter: $filter) {
      id
      terminal_no
      employee {
        id
        fullName
      }
      description
      mac_address
    }
  }
`;

export const UPSERT_RECORD_TERMINAL = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    addTerminal(id: $id, fields: $fields) {
      id
    }
  }
`;

export const GET_FOLIO_BY_PROJECTS = gql`
  query ($filter: String, $status: Boolean, $page: Int, $size: Int) {
    payer: billingByFiltersPageProjects(
      filter: $filter
      status: $status
      page: $page
      size: $size
    ) {
      content {
        id
        billNo
        project {
          id
          description
        }
        customer {
          id
          customerName
        }
      }
    }
  }
`;

export const GET_CASHIER_EMPLOYEE = gql`
  query ($role: String, $filter: String) {
    searchEmployeesByRole(role: $role, filter: $filter) {
      value: id
      label: fullName
    }
  }
`;

export const OPEN_SHIFT = gql`
  mutation {
    addShift {
      id
    }
  }
`;

export const CLOSE_SHIFT = gql`
  mutation {
    closeShift {
      id
    }
  }
`;

export const UPSERT_RECORD_REMARKS = gql`
  mutation ($id: UUID, $remarks: String) {
    addRemarks(id: $id, remarks: $remarks) {
      id
    }
  }
`;

export const GET_BATCH_RECEIPTS = gql`
  query ($filter: String, $page: Int, $size: Int) {
    getBatchReceipts(filter: $filter, page: $page, size: $size) {
      content {
        id
        batchCode
        receiptType
        receiptCurrentNo
        rangeStart
        rangeEnd
        terminal {
          id
          terminal_no
          description
        }
        active
      }
      totalPages
      size
      number
      totalElements
    }
  }
`;

export const GET_RECEIPT_TYPES = gql`
  query {
    receiptTypeOptions {
      value
      label
    }
  }
`;

export const CREATE_BATCH_RECEIPTS = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertBatchReceipt(id: $id, fields: $fields) {
      id
    }
  }
`;
