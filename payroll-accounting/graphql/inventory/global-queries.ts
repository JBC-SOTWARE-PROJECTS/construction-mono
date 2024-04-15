import { gql } from "@apollo/client";

export const GET_RECORDS_ITEMS_SUPPLIER = gql`
  query ($filter: String, $supplier: UUID, $page: Int, $size: Int) {
    inventorySupplierListPageable(
      filter: $filter
      supplier: $supplier
      page: $page
      size: $size
    ) {
      content {
        id
        descLong
        sku
        item {
          id
          descLong
          item_conversion
          unit_of_usage {
            id
            unitDescription
          }
          production
          isMedicine
          vatable
          fixAsset
          consignment
          forSale
        }
        unitMeasurement
        brand
        onHand
        last_wcost
        unitCost
      }
      size
      totalElements
      number
    }
  }
`;

export const GET_RECORDS_ITEMS_INVENTORY = gql`
  query (
    $filter: String
    $groupId: UUID
    $category: [UUID]
    $page: Int
    $size: Int
  ) {
    inventoryListPageable(
      filter: $filter
      group: $groupId
      category: $category
      page: $page
      size: $size
    ) {
      content {
        id
        sku
        item {
          id
          descLong
          item_conversion
          unit_of_usage {
            id
            unitDescription
          }
          production
          isMedicine
          vatable
          fixAsset
          consignment
        }
        descLong
        unitMeasurement
        brand
        onHand
        last_wcost
        lastUnitCost
      }
      size
      totalElements
      number
    }
  }
`;

export const REMOVE_INVENTORY_ATTACHMENT = gql`
  mutation ($id: UUID) {
    removeAttachment(id: $id) {
      payload
      success
      message
    }
  }
`;
