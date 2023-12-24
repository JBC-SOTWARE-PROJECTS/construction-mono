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

export const UPSERT_VEHICLE_USAGE_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertVehicleUsageMonitoring(id: $id, fields: $fields) {
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


