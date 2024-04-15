import { gql } from "@apollo/client";

export const GET_RECORDS_BALANCE = gql`
  query ($item: UUID, $office: UUID) {
    beginningListByItem(item: $item, office: $office) {
      id
      refNum
      dateTrans
      item {
        id
        descLong
        unit_of_usage {
          id
          unitDescription
        }
      }
      office {
        id
        officeDescription
      }
      quantity
      unitCost
      isPosted
      isCancel
      unitMeasurement
      uou
    }
  }
`;

export const UPSERT_RECORD_BEG_BALANCE = gql`
  mutation ($fields: Map_String_ObjectScalar) {
    beginningBalanceInsert(fields: $fields) {
      id
    }
  }
`;

export const UPSERT_QTY_BEG_BALANCE = gql`
  mutation ($qty: BigDecimal, $id: UUID) {
    upsertBegQty(qty: $qty, id: $id) {
      id
    }
  }
`;

export const UPSERT_STATUS_BEGINNING = gql`
  mutation ($status: Boolean, $id: UUID) {
    updateBegBalStatus(status: $status, id: $id) {
      id
    }
  }
`;

export const GET_JOURNAL_ENTRIES_BEGINNING = gql`
  query ($id: UUID, $status: Boolean) {
    begBalanceAccountView(id: $id, status: $status) {
      code
      desc
      debit
      credit
    }
  }
`;
