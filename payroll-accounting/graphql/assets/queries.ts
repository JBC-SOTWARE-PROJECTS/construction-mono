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


export const UPSERT_RENTAL_RATES_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertRentalRates(id: $id, fields: $fields) {
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

export const UPSERT_VEHICLE_USAGE_DOCS_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertVehicleUsageDocs(id: $id, fields: $fields) {
      id
      description
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

export const UPSERT_USAGE_EMPLOYEE_ITEM = gql`
  mutation (
    $employeeList:[Map_String_ObjectScalar],
    $usageID: UUID, 
    $toDelete: [UUID]
  ) {
    data: upsertMultiVehicleUsageEmployee(
      employeeList: $employeeList,
      usageID: $usageID,
      toDelete: $toDelete
    ) {
      payload
      message
      success
    }
  }
`;


