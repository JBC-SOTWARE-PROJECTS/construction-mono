import { gql } from "@apollo/client";

export const GET_INVENTORY_BY_LOCATION = gql`
  query (
    $filter: String
    $office: UUID
    $group: UUID
    $category: [UUID]
    $brand: String
    $page: Int
    $size: Int
  ) {
    inventoryListPageableByDep(
      filter: $filter
      office: $office
      group: $group
      category: $category
      brand: $brand
      page: $page
      size: $size
    ) {
      content {
        id
        itemCode
        sku
        item {
          id
          item_category {
            id
            categoryDescription
          }
          item_conversion
          production
          isMedicine
          vatable
          fixAsset
          consignment
          forSale
        }
        descLong
        uou
        brand
        reOrderQty
        actualCost
        outputTax
        sellingPrice
        onHand
        lastUnitCost
        last_wcost
        markup
        status
      }
      size
      totalElements
      number
    }
  }
`;

export const UPSERT_CRITICAL_LEVEL_INVENTORY = gql`
  mutation ($value: BigDecimal, $id: UUID) {
    updateReOrderQty(value: $value, id: $id) {
      id
    }
  }
`;

export const GET_BEGINNING_BY_LOCATION = gql`
  query (
    $filter: String
    $office: UUID
    $groupId: UUID
    $category: [UUID]
    $brand: String
    $page: Int
    $size: Int
  ) {
    beginningBalancePage(
      filter: $filter
      office: $office
      groupId: $groupId
      category: $category
      brand: $brand
      page: $page
      size: $size
    ) {
      content {
        id
        item {
          id
          descLong
          sku
          itemCode
          brand
          itemGroupId
          categoryDescription
          itemCategory
          production
          isMedicine
          vatable
          fixAsset
          consignment
          forSale
        }
        office {
          id
          officeDescription
        }
        uou
        beginningBalance
        beginningCost
      }
      size
      totalElements
      number
    }
  }
`;
