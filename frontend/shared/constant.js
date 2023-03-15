import _ from "lodash";
import moment from "moment";

export const GENDER = [
  { label: "MALE", value: "MALE" },
  { label: "FEMALE", value: "FEMALE" },
];

export const CIVIL = [
  { label: "SINGLE", value: "SINGLE" },
  { label: "MARRIED", value: "MARRIED" },
  { label: "WIDOWED", value: "WIDOWED" },
  { label: "ANNULED", value: "ANNULED" },
  { label: "SEPARATED", value: "SEPARATED" },
];

export const EMPSTATUS = [
  { label: "PERMANENT-FULLTIME", value: "PERMANENT-FULLTIME" },
  { label: "CONTRACTUAL-FULLTIME", value: "CONTRACTUAL-FULLTIME" },
  { label: "PERMANENT-PARTIME", value: "PERMANENT-PARTIME" },
  { label: "CONTRACTUAL-PARTIME", value: "CONTRACTUAL-PARTIME" },
  { label: "ACTIVE-ROTATING", value: "ACTIVE-ROTATING" },
  { label: "OUTSOURCED", value: "OUTSOURCED" },
];

export const OFFICETYPE = [
  { label: "MAIN", value: "MAIN" },
  { label: "BRANCH", value: "BRANCH" },
];

export const SUP_EN_TYPE = [
  { label: "PERSONAL", value: "PERSONAL" },
  { label: "CORPORATE", value: "CORPORATE" },
];

export const VAT_CON = [
  { label: "VATABLE", value: true },
  { label: "NON-VATABLE", value: false },
];

export const PR_TYPE = [
  { label: "NORMAL", value: "NORMAL" },
  { label: "URGENT", value: "URGENT" },
  { label: "EMERGENCY", value: "EMERGENCY" },
];

export const CUS_TYPE = [
  { label: "INDIVIDUAL", value: "INDIVIDUAL" },
  { label: "GOVERNMENT", value: "GOVERNMENT" },
  { label: "PRIVATE", value: "PRIVATE" },
  { label: "INSURANCE", value: "INSURANCE" },
];

export const JOB_STATUS = [
  { label: "ONGOING", value: "ONGOING" },
  { label: "PENDING", value: "PENDING" },
  { label: "FOR PAINTING", value: "FOR PAINTING" },
  { label: "FOR ORDER PARTS", value: "FOR ORDER PARTS" },
  { label: "COMPLETED", value: "COMPLETED" },
  { label: "DUGTA", value: "DUGTA" },
  { label: "CANCELLED", value: "CANCELLED" },
];

export const SORT_BY = [
  { label: "JOB ORDER NO", value: "jobNo" },
  { label: "TRANSACTION DATE", value: "dateTrans" },
  { label: "DUE DATE", value: "deadline" },
  { label: "REPAIR TYPE", value: "repair.description" },
  { label: "INSURANCE", value: "insurance.description" },
];

export const SORT_TYPE = [
  { label: "ASCENDING", value: "ASC" },
  { label: "DESCENDING ", value: "DESC" },
];

export const ORDER_TYPE = [
  { label: "PICKUP", value: "PICKUP" },
  { label: "DELIVERED", value: "DELIVERED" },
];

export const avatar = [
  "/images/avatar-male.png", //male
  "/images/avatar-female.png", //female
];

export const calculate_age = (dob) => {
  let today = new Date();
  let birthDate = new Date(dob); // create a date object directly from `dob` argument
  let age_now = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age_now--;
  }
  return age_now;
};

export const poType = [
  { label: "N/A", value: "none" },
  { label: "Discount rate", value: "discountRate" },
  { label: "Discount amount", value: "discountAmount" },
  { label: "Package", value: "package" },
];

export const ISSUE_TYPE = [
  { label: "EXPENSE", value: "EXPENSE" },
  // { label: 'ISSUE', value: 'ISSUE' },
];

export const SERVICE_TYPE = [
  { label: "SINGLE", value: "SINGLE" },
  { label: "BUNDLE", value: "BUNDLE" },
];

export const typeLabel = (value) => {
  let result = "N/A";
  if (value == "discountRate") {
    result = "Discount rate";
  } else if (value == "discountAmount") {
    result = "Discount amount";
  } else if (value == "package") {
    result = "Package";
  }
  return result;
};

export const col4 = {
  xl: 6,
  lg: 6,
  md: 8,
  sm: 24,
  xs: 24,
};
export const col2 = {
  xl: 12,
  lg: 12,
  md: 12,
  sm: 24,
  xs: 24,
};
export const col3 = {
  xl: 8,
  lg: 8,
  md: 12,
  sm: 24,
  xs: 24,
};

export const col8 = {
  xl: 3,
  lg: 3,
  md: 4,
  sm: 24,
  xs: 24,
};

export const col18 = {
  xl: 18,
  lg: 18,
  md: 16,
  sm: 24,
  xs: 24,
};

export const colSearch = {
  xl: 20,
  lg: 20,
  md: 20,
  sm: 12,
  xs: 24,
};
export const colButton = {
  xl: 4,
  lg: 4,
  md: 4,
  sm: 12,
  xs: 24,
};

export const decimal = (value) => {
  return _.round(value, 4);
};

// createObj
export const createObj = (e, type) => {
  let unitcost = e?.unitCost || 0;
  let wcost = e?.wcost || 0;
  let obj = {
    id: null,
    item: {
      id: null,
      descLong: "",
    },
    unitMeasurement: "",
  };
  if (type === "PR") {
    obj = {
      id: e?.id,
      item: {
        id: e?.item?.id,
        descLong: e?.descLong,
      },
      unitMeasurement: e?.unitMeasurement,
      requestedQty: 1,
      onHandQty: e?.onHand,
      remarks: null,
      isNew: true,
    };
  } else if (type === "PO") {
    obj = {
      id: e?.id,
      item: e.item,
      unitMeasurement: e?.unitMeasurement,
      quantity: e.requestedQty || 1,
      unitCost: decimal(unitcost * e.item?.item_conversion),
      prNos: null,
      type: null,
      type_text: null,
      isNew: true,
      noPr: true,
    };
  } else if (type === "REC") {
    obj = {
      id: e?.id,
      item: e?.item,
      uou: e?.item?.unit_of_usage?.unitDescription,
      refPoItem: null,
      receiveQty: 1,
      receiveUnitCost: unitcost,
      discountRate: 0.0,
      receiveDiscountCost: 0.0,
      isFg: false,
      isDiscount: false,
      isPartial: false,
      isCompleted: true,
      isNew: true,
      isTax: false,
      expirationDate: null,
      totalAmount: unitcost,
      inputTax: 0,
      netAmount: unitcost,
    };
  } else if (type === "RTS") {
    obj = {
      id: e?.id,
      item: e?.item,
      uou: e?.item?.unit_of_usage?.unitDescription,
      returnQty: 1,
      returnUnitCost: unitcost,
      return_remarks: null,
      isPosted: false,
      isNew: true,
    };
  } else if (type === "STI") {
    obj = {
      id: e?.id,
      item: e?.item,
      uou: e?.item?.unit_of_usage?.unitDescription,
      issueQty: 1,
      unitCost: wcost,
      remarks: null,
      isPosted: false,
      isNew: true,
    };
  } else if (type === "SERVICE") {
    obj = {
      id: e?.id,
      item: e?.item,
      uou: e?.item?.unit_of_usage?.unitDescription,
      qty: 1,
      wcost: wcost,
      isNew: true,
    };
  }
  return obj;
};

export const createMPObj = (e, type, unitcost) => {
  let obj = {
    id: e?.id,
    item: e?.item,
    uou: e?.item?.unit_of_usage?.unitDescription,
    qty: 1,
    unitCost: unitcost,
    type: type,
    isPosted: false,
    isNew: true,
  };
  return obj;
};

export const createObjRecPo = (e) => {
  let unitcost = decimal(e?.unitCost / e.item?.item_conversion);
  let obj = {
    id: e?.id,
    item: e?.item,
    uou: e?.item?.unit_of_usage?.unitDescription,
    refPoItem: {
      id: e?.id,
      item: e?.item,
      purchaseOrder: {
        id: e?.purchaseOrder?.id,
        poNumber: e?.purchaseOrder?.poNumber,
      },
      qtyInSmall: e?.qtyInSmall,
      deliveredQty: e?.deliveredQty,
      deliveryBalance: e?.deliveryBalance,
      unitCost: e?.unitCost,
    },
    receiveQty: e?.deliveryBalance,
    receiveUnitCost: unitcost,
    discountRate: 0.0,
    receiveDiscountCost: 0.0,
    isFg: false,
    isDiscount: false,
    isPartial: false,
    isCompleted: true,
    isNew: true,
    isTax: e?.item.vatable,
    expirationDate: null,
    totalAmount: 0,
    inputTax: 0,
    netAmount: 0,
  };
  return obj;
};

export const postRecObj = (type, element, parent, index) => {
  let ledgerDate = moment(parent.receiveDate).add(index, "seconds");
  let obj = {
    id: element.id,
    source: parent.receivedOffice,
    destination: parent.receivedOffice,
    date: ledgerDate,
    type: type,
    item: element.item,
    unit: element.item?.unit_of_usage?.unitDescription,
    qty: element?.receiveQty,
    unitcost: element.receiveUnitCost,
    status: element?.isPosted,
    ledgerNo: parent?.rrNo,
    poId: parent?.purchaseOrder?.id,
    poItem: element.refPoItem?.id,
    typeId:
      parent?.receivedType === "EP"
        ? "af7dc429-8352-4f09-b58c-26a0a490881c"
        : element?.isFg
        ? "7b94c82f-081a-4578-82c2-f7343852fcf3"
        : "254a07d3-e33a-491c-943e-b3fe6792c5fc",
    itemId: element?.item?.id,
    isFg: element?.isFg,
    isDiscount: element?.isDiscount,
    isPartial: element?.isPartial,
    isCompleted: element?.isCompleted,
    account: parent?.account,
  };
  return obj;
};

export const postRetObj = (type, element, parent, index) => {
  let ledgerDate = moment(parent.returnDate).add(index, "seconds");
  let obj = {
    id: element.id,
    source: parent.office,
    destination: parent.office,
    date: ledgerDate,
    type: type,
    item: element.item,
    unit: element.item?.unit_of_usage?.unitDescription,
    qty: element?.returnQty,
    unitcost: element.returnUnitCost,
    status: element?.isPosted,
    ledgerNo: parent?.rtsNo,
    typeId: "56461ef7-5162-46ac-8fbb-0ab2bdcc2746",
    itemId: element?.item?.id,
  };
  return obj;
};

export const postSTIObj = (type, element, parent, index) => {
  let ledgerDate = moment(parent.issueDate).add(
    type === "STO" ? index : type === "STI" ? index + 1 : index + 2,
    "seconds"
  );
  let sto = "d12f0de2-cb65-42ab-bcdb-881ebce57045";
  let sti = "7250e64a-de1b-4015-80fb-e15f9f6762ab";
  let ex = "0f3c2b76-445a-4f78-a256-21656bd62872";
  let obj = {
    id: element.id,
    key:
      type === "STO"
        ? element.id
        : type === "STI"
        ? element.id + "STI"
        : element.id + "EX",
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
  };
  return obj;
};

export const postMPObj = (type, element, parent, index) => {
  let ledgerDate = moment(parent.dateTransaction).add(index, "seconds");
  let source = "c71a1f34-4358-4d6d-b504-488f1fcd4c31";
  let output = "27d236bb-c023-44dc-beac-18ddfe1daf79";

  let obj = {
    id: element.id,
    source: parent.office,
    destination: parent.office,
    date: ledgerDate,
    type: type === "output" ? "MPO" : "MPS",
    item: element.item,
    unit: element.item?.unit_of_usage?.unitDescription,
    qty: element?.qty,
    unitcost: element.unitCost,
    status: element?.isPosted,
    ledgerNo: parent?.mpNo,
    typeId: type === "output" ? output : source,
    itemId: element?.item?.id,
  };
  return obj;
};

export const endorsement = {
  fieldFindings: false,
  shopFindings: false,
  fuelGauge: "", // full, 3/4, 1/2, 1/4, alsmost, empty
  aircon: "", // Available, None
  lighter: "", // Available, None
  lighterPcs: "", //number
  headrest: "", // Available, None
  headrestPcs: "", //number
  horn: "", // Available, None
  wiperRH: false,
  wiperLH: false,
  windShieldFront: false,
  windShieldRear: false,
  runningBoardRH: false,
  runningBoardLH: false,
  spareTire: "", // Available, None
  hoodStand: "", // Available, None
  oilCap: "", // Available, None
  engineOilFilter: "", // Available, None
  headlightLH: false,
  headlightRH: false,
  carkey: false,
  carStereo: "", // Available, None
  sunVisor: "", // Available, None
  sunVisorPcs: "", //number
  domeLight: "", // Available, None
  sideMirrorRH: false,
  sideMirrorLH: false,
  logoFront: false,
  logoRear: false,
  windowsRH: false,
  windowsLH: false,
  antenna: "", // Available, None
  jack: "", // Available, None
  radiator: "", // Available, None
  dipStick: "", // Available, None
  speaker: "", // Available, None
  speakerPcs: "", // number
  rearViewMirror: "", // Available, None
  registrationPapers: "", // Available, None
  hubCupRHft: false,
  hubCupRHRr: false,
  hubCupLHft: false,
  hubCupLHRr: false,
  plateNumberFront: false,
  plateNumberRear: false,
  bumperFront: false,
  bumperRear: false,
  mudGuardRHft: false,
  mudGuardRHRr: false,
  mudGuardLHft: false,
  mudGuardLHRr: false,
  tieWrench: "", // Available, None
  washerTank: "", // Available, None
  clutchCap: "", // Available, None
  breakMaster: "", // Available, None
  tailLightRH: false,
  tailLightLH: false,
};
