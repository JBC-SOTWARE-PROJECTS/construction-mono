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
        active
      }
      totalElements
      totalPages
      size
      number
    }
  }
`;
