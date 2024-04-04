import {
  Inventory,
  Item,
  Office,
  PurchaseOrderItems,
  PurchaseRequestItem,
  ReturnSupplier,
  ReturnSupplierItem,
  StockIssue,
  StockIssueItems,
  SupplierInventory,
} from "@/graphql/gql/graphql";
import { decimalRound2 } from "./helper";
import dayjs, { Dayjs } from "dayjs";

export interface PurchaseRequestItemExtended extends PurchaseRequestItem {
  isNew?: boolean;
}

export interface PurchaseOrderItemsExtended extends PurchaseOrderItems {
  isNew?: boolean;
  noPr?: boolean;
}

export interface ReturnItemsExtended extends ReturnSupplierItem {
  isNew?: boolean;
}
export interface StockIssueItemsExtended extends StockIssueItems {
  isNew?: boolean;
}

interface PostDto {
  id: string;
  ledgerNo: string;
  source: Office;
  destination: Office;
  date: string | Dayjs;
  type: string;
  typeId: string;
  itemId: string;
  qty: number;
  unitcost: number;
}

export interface InventoryPostList extends PostDto {
  item: Item;
  unit: string;
  status: boolean;
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

export const formatObjSupplierPurchaseOrder = (
  records: SupplierInventory[]
): PurchaseOrderItemsExtended[] => {
  let result = [] as PurchaseOrderItemsExtended[];
  result = (records || []).map((e) => {
    return {
      id: e.id,
      item: {
        ...e.item,
        descLong: e.descLong,
      },
      unitMeasurement: e.unitMeasurement,
      requestedQty: 1,
      unitCost: e.unitCost,
      prNos: null,
      type: null,
      type_text: null,
      isNew: true,
      noPr: true,
    };
  }) as PurchaseOrderItemsExtended[];
  return result;
};

export const formatObjSupplierReturnSupplier = (
  records: SupplierInventory[]
): ReturnItemsExtended[] => {
  let result = [] as ReturnItemsExtended[];
  result = (records || []).map((e) => {
    return {
      id: e?.id,
      item: e?.item,
      uou: e?.item?.unit_of_usage?.unitDescription,
      returnQty: 1,
      returnUnitCost: e?.unitCost ?? 0,
      return_remarks: null,
      isPosted: false,
      isNew: true,
    };
  }) as ReturnItemsExtended[];
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
    noPr: false,
  };
  return result;
};

export const formatObjInventoryStockIssuance = (
  records: Inventory[]
): StockIssueItemsExtended[] => {
  let result = [] as StockIssueItemsExtended[];
  result = (records || []).map((e) => {
    return {
      id: e?.id,
      item: e?.item,
      uou: e?.item?.unit_of_usage?.unitDescription,
      issueQty: 1,
      unitCost: e.last_wcost ?? 0,
      remarks: null,
      isPosted: false,
      isNew: true,
    };
  }) as StockIssueItemsExtended[];
  return result;
};

//  ===================== post inventory =============================
export const formatPostReturnSupplier = (
  element: ReturnSupplierItem,
  parent: ReturnSupplier,
  index: number
) => {
  let ledgerDate = dayjs(parent.returnDate).add(index, "seconds");
  let obj = {
    id: element.id,
    source: parent.office as Office,
    destination: parent.office as Office,
    date: ledgerDate,
    type: "RTS",
    item: element.item as Item,
    unit: element.item?.unit_of_usage?.unitDescription as string,
    qty: element?.returnQty as number,
    unitcost: element.returnUnitCost as number,
    status: element?.isPosted as boolean,
    ledgerNo: parent?.rtsNo as string,
    typeId: "56461ef7-5162-46ac-8fbb-0ab2bdcc2746",
    itemId: element?.item?.id as string,
  } as InventoryPostList;
  return obj;
};

export const formatPostStockIssuance = (
  type: string,
  element: StockIssueItems,
  parent: StockIssue,
  index: number
) => {
  let ledgerDate = dayjs(parent.issueDate).add(
    type === "STO" ? index : type === "STI" ? index + 1 : index + 2,
    "seconds"
  );
  let sto = "d12f0de2-cb65-42ab-bcdb-881ebce57045";
  let sti = "7250e64a-de1b-4015-80fb-e15f9f6762ab";
  let ex = "0f3c2b76-445a-4f78-a256-21656bd62872";
  let uniqId =
    type === "STO"
      ? element.id
      : type === "STI"
      ? element.id + "STI"
      : element.id + "EX";
  let obj = {
    id: element.id,
    key: uniqId,
    source:
      type === "STO"
        ? parent.issueFrom
        : type === "STI"
        ? parent.issueTo
        : parent.issueTo,
    destination:
      type === "STO"
        ? parent.issueTo
        : type === "STI"
        ? parent.issueFrom
        : parent.issueTo,
    date: ledgerDate,
    type: type,
    item: element.item,
    unit: element.item?.unit_of_usage?.unitDescription,
    qty: element?.issueQty,
    unitcost: element.unitCost,
    status: element?.isPosted,
    ledgerNo: parent?.issueNo,
    typeId: type === "STO" ? sto : type === "STI" ? sti : ex,
    itemId: element?.item?.id,
  } as InventoryPostList;
  return obj;
};
