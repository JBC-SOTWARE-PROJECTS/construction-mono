import {
  Inventory,
  PurchaseOrderItems,
  PurchaseRequestItem,
  SupplierInventory,
} from "@/graphql/gql/graphql";
import { decimalRound2 } from "./helper";

export interface PurchaseRequestItemExtended extends PurchaseRequestItem {
  isNew?: boolean;
}

export interface PurchaseOrderItemsExtended extends PurchaseOrderItems {
  isNew?: boolean;
  noPr?: boolean;
}

export const formatObjSupplierPurchaseRequest = (
  records: SupplierInventory[]
): PurchaseRequestItemExtended[] => {
  let result = [] as PurchaseRequestItemExtended[];
  result = (records || []).map((e) => {
    return {
      id: e.id,
      item: {
        ...e.item,
        descLong: e.descLong,
      },
      unitMeasurement: e.unitMeasurement,
      requestedQty: 1,
      onHandQty: e.onHand,
      unitCost: e.unitCost,
      remarks: null,
      isNew: true,
    };
  }) as PurchaseRequestItemExtended[];
  return result;
};

export const formatObjInventoryPurchaseRequest = (
  records: Inventory[]
): PurchaseRequestItemExtended[] => {
  let result = [] as PurchaseRequestItemExtended[];
  result = (records || []).map((e) => {
    return {
      id: e.id,
      item: {
        ...e.item,
        descLong: e.descLong,
      },
      unitMeasurement: e.unitMeasurement,
      requestedQty: 1,
      onHandQty: e.onHand,
      unitCost: e.lastUnitCost,
      remarks: null,
      isNew: true,
    };
  }) as PurchaseRequestItemExtended[];
  return result;
};

export const formatObjPrItemsToPoItems = (
  records: PurchaseRequestItem
): PurchaseOrderItemsExtended => {
  let result = {
    id: records?.id,
    item: records.item,
    unitMeasurement: records?.unitMeasurement,
    quantity: records.requestedQty || 1,
    unitCost: records?.unitCost,
    prNos: records?.purchaseRequest?.prNo ?? null,
    type: null,
    type_text: null,
    isNew: true,
    noPr: true,
  };
  return result;
};
