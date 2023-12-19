import { gql } from "@apollo/client";

export const UPSERT_ASSET_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertAsset(id: $id, fields: $fields) {
      id
    }
  }
`;

export const UPSERT_MAINTENANCE_TYPE_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertAssetMaintenanceType(id: $id, fields: $fields) {
      id
    }
  }
`;


export const UPSERT_PREVENTIVE_MAINTENANCE_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertAssetPreventiveMaintenance(id: $id, fields: $fields) {
      id
    }
  }
`;

export const UPSERT_REPAIR_MAINTENANCE_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertAssetRepairMaintenance(id: $id, fields: $fields) {
      id
    }
  }
`;

export const UPSERT_REPAIR_MAINTENANCE_ITEM_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertAssetRepairMaintenanceItem(id: $id, fields: $fields) {
      id
    }
  }
`;

export const UPSERT_MP_REPAIR_MAINTENANCE_ITEM_RECORD = gql`
  mutation ( $items: [Map_String_ObjectScalar]) {
    upsertMPAssetRepairMaintenanceItem( items: $items) {
      id
    }
  }
`;

export const DELETE_REPAIR_MAINTENANCE_ITEM_RECORD = gql`
  mutation ( $id: UUID) {
    assetRepairMaintenanceItemDeletedById( id: $id) {
      id
    }
  }
`;

export const REGISTERED_FIXED_ASSET_PAGEABLE = gql`
  query ($filter: String, $page: Int, $size: Int) {
    page: getFixedAssetPageable(filter: $filter, page: $page, size: $size) {
      content {
        id
        assetNo
        serialNo
        itemId
        itemName
        depreciationMethod
        depreciationStartDate
        office {
          id
          officeDescription
        }
        salvageValue
        purchasePrice
        purchaseDate
        usefulLife
        accumulatedDepreciation
        isBeginningBalance
      }
    }
  }
`


