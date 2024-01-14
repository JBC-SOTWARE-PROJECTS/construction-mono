import { gql } from "@apollo/client";

export const GET_ITEM_RECORDS = gql`
  query (
    $filter: String
    $groupId: UUID
    $category: [UUID]
    $brand: String
    $type: String
    $page: Int
    $size: Int
  ) {
    itemByFiltersPage(
      filter: $filter
      group: $groupId
      category: $category
      brand: $brand
      type: $type
      page: $page
      size: $size
    ) {
      content {
        id
        sku
        itemCode
        item_group {
          id
          itemDescription
        }
        item_category {
          id
          categoryDescription
        }
        descLong
        brand
        unitMeasurement
        specification
        unit_of_purchase {
          id
          unitDescription
        }
        unit_of_usage {
          id
          unitDescription
        }
        item_generics {
          id
          genericDescription
        }
        assetSubAccount {
          id
          subAccountDescription
        }
        expenseSubAccount {
          id
          subAccountDescription
        }
        item_conversion
        item_maximum
        item_demand_qty
        actualUnitCost
        item_markup
        markupLock
        isMedicine
        vatable
        consignment
        discountable
        production
        fixAsset
        active
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

//graphQL Queries
export const GET_RECORDS_ITEM_GROUPS = gql`
  query ($filter: String) {
    itemGroupList(filter: $filter) {
      id
      itemCode
      itemDescription
      isActive
    }
  }
`;

export const GET_RECORDS_ACTIVE_ITEM_GROUP = gql`
  {
    list: itemGroupActive {
      value: id
      label: itemDescription
    }
  }
`;

export const GET_RECORDS_SUPPLER = gql`
  query ($filter: String!, $size: Int, $page: Int) {
    supplier_list_pageable(filter: $filter, size: $size, page: $page) {
      content {
        id
        supplierCode
        supplierFullname
        supplierTin
        supplierEmail
        paymentTerms {
          id
          paymentDesc
        }
        supplierEntity
        supplierTypes {
          id
          supplierTypeDesc
        }
        creditLimit
        isVatable
        isVatInclusive
        remarks
        leadTime
        primaryAddress
        primaryTelphone
        primaryContactPerson
        primaryFax
        secondaryAddress
        secondaryTelphone
        secondaryContactPerson
        secondaryFax
        atcNo
        isActive
      }
      totalElements
      totalPages
      size
      number
    }
  }
`;

//graphQL Queries
export const UPSERT_RECORD_SUPPLER = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertSupplier(id: $id, fields: $fields) {
      id
    }
  }
`;

export const UPSERT_RECORD_ITEM_GROUP = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertItemGroup(id: $id, fields: $fields) {
      id
    }
  }
`;

export const GET_RECORDS_ITEM_CATEGORY = gql`
  query ($filter: String) {
    itemCategoryList(filter: $filter) {
      id
      itemGroup {
        id
        itemDescription
      }
      prefixCode
      categoryCode
      categoryDescription
      isActive
    }
  }
`;

export const UPSERT_RECORD_ITEM_CATEGORY = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertItemCategory(id: $id, fields: $fields) {
      id
    }
  }
`;

export const GET_RECORDS_ITEM_MEASUREMENT = gql`
  query ($filter: String) {
    unitMeasurementList(filter: $filter) {
      id
      unitCode
      unitDescription
      isSmall
      isBig
      isActive
    }
  }
`;

export const UPSERT_RECORD_ITEM_MEASUREMENT = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertUnitMeasurement(id: $id, fields: $fields) {
      id
    }
  }
`;

export const GET_RECORDS_ITEM_GENERICS = gql`
  query ($filter: String) {
    genericList(filter: $filter) {
      id
      genericCode
      genericDescription
      isActive
    }
  }
`;

export const UPSERT_RECORD_ITEM_GENERICS = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertGenerics(id: $id, fields: $fields) {
      id
    }
  }
`;

export const GET_RECORDS_SUPPLIER_TYPES = gql`
  query ($filter: String) {
    supplierTypeList(filter: $filter) {
      id
      supplierTypeCode
      supplierTypeDesc
      isActive
    }
  }
`;

export const UPSERT_RECORD_SUPPLIER_TYPES = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertSupplierType(id: $id, fields: $fields) {
      id
    }
  }
`;

export const GET_RECORDS_PAYMENT_TERMS = gql`
  query ($filter: String) {
    paymentTermList(filter: $filter) {
      id
      paymentCode
      paymentDesc
      paymentNoDays
      isActive
    }
  }
`;

export const UPSERT_RECORD_PAYMENT_TERMS = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertPaymentTerms(id: $id, fields: $fields) {
      id
    }
  }
`;

export const GET_RECORDS_PROJECT_STATUS = gql`
  query ($filter: String) {
    jobStatusList(filter: $filter) {
      id
      code
      description
      disabledEditing
      statusColor
      is_active
    }
  }
`;

export const UPSERT_RECORD_PROJECT_STATUS = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertJobStatus(id: $id, fields: $fields) {
      id
    }
  }
`;

export const GET_RECORDS_TRANSACTION_TYPE = gql`
  query ($tag: String, $filter: String) {
    transTypeByTagFilter(tag: $tag, filter: $filter) {
      id
      description
      flagValue
      status
      fixAsset
      consignment
      tag
    }
  }
`;

export const UPSERT_RECORD_TRANSACTION_TYPE = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertTransType(id: $id, fields: $fields) {
      id
    }
  }
`;

export const GET_RECORDS_QUANTITY_ADJUSTMENT = gql`
  query ($filter: String) {
    quantityAdjustmentTypeFilter(filter: $filter) {
      id
      code
      description
      flagValue
      sourceColumn
      is_active
    }
  }
`;

export const UPSERT_RECORD_QUANTITY_ADJUSTMENT = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertQuantityAdjustmentType(id: $id, fields: $fields) {
      id
    }
  }
`;

export const GET_RECORDS_SIGNATURES = gql`
  query ($type: String!, $filter: String) {
    signatureListFilter(type: $type, filter: $filter) {
      id
      signatureType
      signatureHeader
      signaturePerson
      signaturePosition
      currentUsers
      sequence
    }
  }
`;

export const UPSERT_RECORD_SIGNATURES = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertSignature(id: $id, fields: $fields) {
      id
    }
  }
`;

export const GET_RECORDS_ITEM_SUB_ACCOUNT = gql`
  query ($filter: String, $type: String!) {
    itemSubAccountList(filter: $filter, type: $type) {
      id
      subAccountCode
      subAccountDescription
      accountType
      sourceColumn
      isActive
      isFixedAsset
    }
  }
`;

export const UPSERT_RECORD_ITEM_SUB_ACCOUNT = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsertItemSubAccount(id: $id, fields: $fields) {
      id
    }
  }
`;

export const GET_RECORDS_LOCATION_ITEM = gql`
  query ($id: UUID) {
    officeListByItem(id: $id) {
      id
      office {
        id
        officeDescription
      }
      allow_trade
      is_assign
    }
  }
`;

export const UPSERT_RECORD_LOCATION_ITEM = gql`
  mutation (
    $depId: UUID
    $itemId: UUID
    $trade: Boolean
    $assign: Boolean
    $id: UUID
  ) {
    upsertOfficeItem(
      depId: $depId
      itemId: $itemId
      trade: $trade
      assign: $assign
      id: $id
    ) {
      id
    }
  }
`;

export const GET_RECORDS_SUPPLIER_BY_ITEM = gql`
  query ($id: UUID) {
    allSupplierByItem(id: $id) {
      id
      supplier {
        id
        supplierFullname
      }
      cost
      costPurchase
    }
  }
`;

export const UPSERT_RECORD_SUPPLIER_BY_ITEM = gql`
  mutation (
    $fields: Map_String_ObjectScalar
    $itemId: UUID
    $supId: UUID
    $id: UUID
  ) {
    upsertSupplierItem(
      fields: $fields
      itemId: $itemId
      supId: $supId
      id: $id
    ) {
      id
    }
  }
`;

export const DELETE_RECORD_SUPPLIER_BY_ITEM = gql`
  mutation ($id: UUID) {
    removeItemSupplier(id: $id) {
      id
    }
  }
`;

export const GET_RECORD_ITEM_BY_SUPPLIER = gql`
  query ($id: UUID, $filter: String) {
    allItemBySupplier(id: $id, filter: $filter) {
      id
      itemId
      item {
        id
        unit_of_usage {
          id
          unitDescription
        }
        unit_of_purchase {
          id
          unitDescription
        }
      }
      cost
      costPurchase
      descLong
      brand
      unitMeasurement
      genericName
    }
  }
`;

export const UPSERT_RECORD_ITEM_BY_SUPPLIER = gql`
  mutation (
    $fields: Map_String_ObjectScalar
    $itemId: UUID
    $supId: UUID
    $id: UUID
  ) {
    upsertSupplierItem(
      fields: $fields
      itemId: $itemId
      supId: $supId
      id: $id
    ) {
      id
    }
  }
`;

export const DELETE_RECORD_ITEM_BY_SUPPLIER = gql`
  mutation ($id: UUID) {
    removeItemSupplier(id: $id) {
      id
    }
  }
`;

export const GET_ACTIVE_ITEM = gql`
  query ($filter: String!, $size: Int, $page: Int) {
    list: itemsActivePage(filter: $filter, size: $size, page: $page) {
      content {
        value: id
        label: descLong
      }
      totalElements
    }
  }
`;
