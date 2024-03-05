import { gql } from "@apollo/client";

export const GET_RECORDS_QUANTITY_ADJUSTMENTS = gql`
  query ($id: UUID) {
    quantityListByItem(item: $id) {
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
      unit_cost
      isPosted
      isCancel
      remarks
      uou
      quantityAdjustmentType {
        id
        description
      }
    }
  }
`;

export const UPSERT_RECORD_ADJUSTMENT = gql`
  mutation ($fields: Map_String_ObjectScalar) {
    quantityAdjustmentInsert(fields: $fields) {
      id
    }
  }
`;

export const UPSERT_QTY_ADJUSTMENT = gql`
  mutation ($qty: Int, $id: UUID) {
    upsertQty(qty: $qty, id: $id) {
      id
    }
  }
`;

export const UPSERT_REMARKS_ADJUSTMENT = gql`
  mutation ($remarks: String, $id: UUID) {
    upsertAdjustmentRemarks(remarks: $remarks, id: $id) {
      id
    }
  }
`;

export const UPSERT_STATUS_ADJUSTMENT = gql`
  mutation ($status: Boolean, $id: UUID) {
    updateQtyAdjStatus(status: $status, id: $id) {
      id
    }
  }
`;
