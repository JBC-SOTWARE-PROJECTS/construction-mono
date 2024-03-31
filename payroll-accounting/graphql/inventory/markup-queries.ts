import { gql } from "@apollo/client";

export const GET_RECORDS_MARKUP_CONTROL = gql`
  query (
    $filter: String
    $office: UUID
    $groupId: UUID
    $category: [UUID]
    $brand: String
    $page: Int
    $size: Int
  ) {
    markupListPage(
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
        item
        descLong
        sku
        itemCode
        brand
        uou
        categoryDescription
        lastUnitCost
        actualCost
        outputTax
        markup
        sellingPrice
        production
        isMedicine
        vatable
        fixAsset
        consignment
        forSale
      }
      size
      totalElements
      number
    }
  }
`;

export const UPSERT_RECORD_MARKUP_PRICE = gql`
  mutation ($id: UUID, $actualCost: BigDecimal, $sellingPrice: BigDecimal) {
    updateMarkupPrice(
      id: $id
      actualCost: $actualCost
      sellingPrice: $sellingPrice
    ) {
      id
    }
  }
`;

export const UPSERT_RECORD_MARKUP_PRICE_SYNC = gql`
  mutation ($item: UUID, $actualCost: BigDecimal, $sellingPrice: BigDecimal) {
    updateMarkupPriceSync(
      item: $item
      actualCost: $actualCost
      sellingPrice: $sellingPrice
    ) {
      id
    }
  }
`;
