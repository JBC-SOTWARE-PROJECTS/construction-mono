export const currency = "Php";
export const dateFormat = "YYYY-MM-DD";
export const vatRate = 12;

// =============== columns
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

// ===============end columns

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
  { label: "MAIN OFFICE", value: "MAIN" },
  { label: "BRANCH OFFICE", value: "BRANCH" },
  { label: "SATELITE OFFICE", value: "SATELITE" },
];

export const REST_DAY_SCHEDULE_LABEL = "R";
export const REST_DAY_SCHEDULE_TITLE = "Rest Day";
export const REST_DAY_SCHEDULE_COLOR = "#95a5a6";

export const ScheduledWorkFields = [
  {
    title: "Regular Day",
    name: "regular",
  },
  {
    title: "Rest Day",
    name: "restday",
  },
  {
    title: "Special Holiday",
    name: "specialHoliday",
  },
  {
    title: "Special Holiday and Restday",
    name: "specialHolidayAndRestDay",
  },
  {
    title: "Regular Holiday",
    name: "regularHoliday",
  },
  {
    title: "Regular Holiday and Restday",
    name: "regularHolidayAndRestDay",
  },
  {
    title: "Double Holiday",
    name: "doubleHoliday",
  },
  {
    title: "Double Holiday and Restday",
    name: "doubleHolidayAndRestDay",
  },
];
// =============== columns
export const responsiveColumn3 = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
};

export const responsiveColumn4 = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 6,
};

export const responsiveColumn3Last = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 8,
};

export const responsiveColumn2 = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
};

export const responsiveColumn18 = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 18,
};
export const responsiveColumn6 = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 6,
};
// ===============end columns
// =============== default datasource accounts payable ============
export const APTOTALS = [
  {
    id: "grossAmount",
    description: "Total Amount",
    debit: 0,
    credit: null,
    runningBalance: 0,
  },
  {
    id: "discountAmount",
    description: "Discount",
    debit: null,
    credit: 0,
    runningBalance: 0,
  },
  {
    id: "vatAmount",
    description: "Vat Amount",
    debit: 0,
    credit: null,
    runningBalance: 0,
  },
  {
    id: "ewtAmount",
    description: "Ewt Amount",
    debit: null,
    credit: 0,
    runningBalance: 0,
  },
];

export const DISTOTALS = [
  {
    id: "cash",
    description: "Cash Amount",
    debit: 0,
    credit: null,
    runningBalance: 0,
  },
  {
    id: "check",
    description: "Check Amount",
    debit: 0,
    credit: null,
    runningBalance: 0,
  },
  {
    id: "discount",
    description: "Discount",
    debit: 0,
    credit: null,
    runningBalance: 0,
  },
  {
    id: "ewtAmount",
    description: "Ewt Amount",
    debit: 0,
    credit: null,
    runningBalance: 0,
  },
];

export const RPTOTALS = [
  {
    id: "discount",
    description: "Discount",
    debit: 0,
    credit: null,
  },
  {
    id: "ewtAmount",
    description: "Ewt Amount",
    debit: 0,
    credit: null,
  },
];

export const PETTYTOTALS = [
  {
    id: "amountIssued",
    description: "Ammount Issued",
    debit: 0,
    credit: null,
  },
  {
    id: "amountUsed",
    description: "Ammount Used",
    debit: null,
    credit: 0,
  },
];
//================ end

export const AP_TRANSCTION_CATEGORY = [
  { label: "ACCOUNTS PAYABLE", value: "AP" },
  { label: "DISBURSEMENT VOUCHERS", value: "DS" },
  { label: "REAPPLICATION DISBURSEMENT", value: "RP" },
  { label: "PETTY CASH", value: "PC" },
  { label: "DEBIT MEMO", value: "DM" },
  { label: "DEBIT ADVICE", value: "DA" },
];

export const SOURCE_CLOUMN = [
  { label: "value_1", value: "value_1" },
  { label: "value_2", value: "value_2" },
  { label: "value_3", value: "value_3" },
  { label: "value_4", value: "value_4" },
  { label: "value_5", value: "value_5" },
  { label: "value_6", value: "value_6" },
  { label: "value_7", value: "value_7" },
  { label: "value_8", value: "value_8" },
  { label: "value_9", value: "value_9" },
  { label: "value_10", value: "value_10" },
  { label: "value_11", value: "value_11" },
  { label: "value_12", value: "value_12" },
  { label: "value_13", value: "value_13" },
  { label: "value_14", value: "value_14" },
  { label: "value_15", value: "value_15" },
  { label: "value_16", value: "value_16" },
  { label: "value_17", value: "value_17" },
  { label: "value_18", value: "value_18" },
  { label: "value_19", value: "value_19" },
  { label: "value_20", value: "value_20" },
  { label: "value_21", value: "value_21" },
  { label: "value_22", value: "value_22" },
  { label: "value_23", value: "value_23" },
  { label: "value_24", value: "value_24" },
  { label: "value_25", value: "value_25" },
  { label: "value_26", value: "value_26" },
  { label: "value_27", value: "value_27" },
  { label: "value_28", value: "value_28" },
  { label: "value_29", value: "value_29" },
  { label: "value_30", value: "value_30" },
  { label: "value_31", value: "value_31" },
  { label: "value_32", value: "value_32" },
  { label: "value_33", value: "value_33" },
  { label: "value_34", value: "value_34" },
  { label: "value_35", value: "value_35" },
  { label: "value_36", value: "value_36" },
  { label: "value_37", value: "value_37" },
  { label: "value_38", value: "value_38" },
  { label: "value_39", value: "value_39" },
  { label: "value_40", value: "value_40" },
  { label: "value_41", value: "value_41" },
  { label: "value_42", value: "value_42" },
  { label: "value_43", value: "value_43" },
  { label: "value_44", value: "value_44" },
  { label: "value_45", value: "value_45" },
  { label: "value_46", value: "value_46" },
  { label: "value_47", value: "value_47" },
  { label: "value_48", value: "value_48" },
  { label: "value_49", value: "value_49" },
  { label: "value_50", value: "value_50" },
  { label: "value_51", value: "value_51" },
  { label: "value_52", value: "value_52" },
  { label: "value_53", value: "value_53" },
  { label: "value_54", value: "value_54" },
  { label: "value_55", value: "value_55" },
  { label: "value_56", value: "value_56" },
  { label: "value_57", value: "value_57" },
  { label: "value_58", value: "value_58" },
  { label: "value_59", value: "value_59" },
  { label: "value_60", value: "value_60" },
  { label: "value_61", value: "value_61" },
  { label: "value_62", value: "value_62" },
  { label: "value_63", value: "value_63" },
  { label: "value_64", value: "value_64" },
  { label: "value_65", value: "value_65" },
  { label: "value_66", value: "value_66" },
  { label: "value_67", value: "value_67" },
  { label: "value_68", value: "value_68" },
  { label: "value_69", value: "value_69" },
  { label: "value_70", value: "value_70" },
  { label: "value_71", value: "value_71" },
  { label: "value_72", value: "value_72" },
  { label: "value_73", value: "value_73" },
  { label: "value_74", value: "value_74" },
  { label: "value_75", value: "value_75" },
  { label: "value_76", value: "value_76" },
  { label: "value_77", value: "value_77" },
  { label: "value_78", value: "value_78" },
  { label: "value_79", value: "value_79" },
  { label: "value_80", value: "value_80" },
  { label: "value_81", value: "value_81" },
  { label: "value_82", value: "value_82" },
  { label: "value_83", value: "value_83" },
  { label: "value_84", value: "value_84" },
  { label: "value_85", value: "value_85" },
  { label: "value_86", value: "value_86" },
  { label: "value_87", value: "value_87" },
  { label: "value_88", value: "value_88" },
  { label: "value_89", value: "value_89" },
  { label: "value_90", value: "value_90" },
  { label: "value_91", value: "value_91" },
  { label: "value_92", value: "value_92" },
  { label: "value_93", value: "value_93" },
  { label: "value_94", value: "value_94" },
  { label: "value_95", value: "value_95" },
  { label: "value_96", value: "value_96" },
  { label: "value_97", value: "value_97" },
  { label: "value_98", value: "value_98" },
  { label: "value_99", value: "value_99" },
  { label: "value_100", value: "value_100" },
];

export const AP_STATUS = [
  { label: "POSTED", value: "true" },
  { label: "DRAFT", value: "false" },
  { label: "ALL", value: "null" },
];

export const APCATEGORY = [
  {
    label: "ACCOUNTS PAYABLE",
    value: "ACCOUNTS PAYABLE",
  },
];

export const TAX_OPTIONS = [
  { label: "1%", value: 1 },
  { label: "2%", value: 2 },
  { label: "3%", value: 3 },
  { label: "4%", value: 4 },
  { label: "5%", value: 5 },
  { label: "7%", value: 7 },
  { label: "10%", value: 10 },
  { label: "15%", value: 15 },
  { label: "18%", value: 18 },
  { label: "30%", value: 30 },
];

export const HolidayTransferabilityTypes = {
  MOVABLE: "MOVABLE",
  FIXED: "FIXED",
};

export const HolidayTypes = {
  REGULAR: "REGULAR",
  SPECIAL: "SPECIAL_NON_WORKING",
  NON_HOLIDAY: "NON_HOLIDAY",
};

export const HolidayTransferability = [
  {
    label: "Fixed",
    value: "FIXED",
  },
  {
    label: "Movable",
    value: "MOVABLE",
  },
];

export const HolidayType = [
  {
    label: "Regular Holiday",
    value: "REGULAR",
  },
  {
    label: "Special Non-working Holiday",
    value: "SPECIAL_NON_WORKING",
  },
  {
    label: "Non-Holiday",
    value: "NON_HOLIDAY",
  },
];

export const AllowanceType = [
  {
    label: "SEMI-MONTHLY",
    value: "SEMI-MONTHLY",
  },
  {
    label: "HOURLY",
    value: "HOURLY",
  },
];

export const ACCOUNT_TYPES = [
  { label: "ASSET", value: "ASSET" },
  { label: "LIABILITY", value: "LIABILITY" },
  { label: "EQUITY", value: "EQUITY" },
  { label: "COST_OF_SALE", value: "COST_OF_SALE" },
  { label: "REVENUE", value: "REVENUE" },
  { label: "EXPENSE", value: "EXPENSE" },
];

export const APCAT_DIS = [
  {
    label: "PAYABLE",
    value: "PAYABLE",
  },
  {
    label: "EXPENSE",
    value: "EXPENSE",
  },
];

export const DIS_TYPE = [
  {
    label: "CHECK",
    value: "CHECK",
  },
  {
    label: "CASH",
    value: "CASH",
  },
];

export const statusMap: any = {
  DRAFT: "FINALIZED",
  FINALIZED: "DRAFT",
};

export const PC_CATEGORY = [
  {
    label: "ITEM PURCHASE",
    value: "PURCHASE",
  },
  {
    label: "OTHER TRASACTIONS",
    value: "OTHERS",
  },
];

export const headerConstant = [
  {
    title: "No. of Hrs",
  },
  {
    title: "Rate",
  },
  {
    title: "Total",
  },
];

export const grossName = [
  {
    title: "Regular",
  },
  {
    title: "Late",
  },
  {
    title: "Under Time",
  },
  {
    title: "Over Time",
  },
  {
    title: "Regular Holiday",
  },
  {
    title: "Special Non-Working",
  },
  {
    title: "Vication Leave",
  },
  {
    title: "Sick Leave",
  },
  {
    title: "Semi Monthly Allowance",
  },
  {
    title: "Dialy Allowance",
  },
  {
    title: "Load Allowance",
  },
  {
    title: "Transportation Allowance",
  },
  {
    title: "Food Allowance",
  },
];

export const payrollDeduction = [
  {
    title: "Withholding Tax",
  },
  {
    title: "SSS",
  },
  {
    title: "HDMF",
  },
  {
    title: "PHIC",
  },
  {
    title: "HMO Insurance",
  },
  {
    title: "Cash Advance",
  },
  {
    title: "Item Credit",
  },
];

export const SUP_EN_TYPE = [
  { label: "PERSONAL", value: "PERSONAL" },
  { label: "CORPORATE", value: "CORPORATE" },
];

export const VAT_CON = [
  { label: "VATABLE", value: "true" },
  { label: "NON-VATABLE", value: "false" },
];

export const REVISIONS_COST = [
  { label: "Revision 1", value: "rev_1" },
  { label: "Revision 2", value: "rev_2" },
  { label: "Revision 3", value: "rev_3" },
  { label: "Revision 4", value: "rev_4" },
  { label: "Revision 5", value: "rev_5" },
  { label: "Revision 6", value: "rev_6" },
  { label: "Revision 7", value: "rev_7" },
  { label: "Revision 8", value: "rev_8" },
  { label: "Revision 9", value: "rev_9" },
  { label: "Revision 10", value: "rev_10" },
];

export const AssetStatusColor = {
  ACTIVE: "blue",
  DISPOSED: "grey",
  IDLE: "warning",
  IN_REPAIR: "red",
  IN_SERVICE: "green",
  IN_TRANSIT: "purple",
  OUT_OF_SERVICE: "yellow",
  RESERVED: "cyan",
  RETIRED: "volcano",
  UNDER_INSPECTION: "magenta",
  UNDER_MAINTENANCE: "red",
  NO_STATUS: "gold",
  ON_SERVICE: "teal"
};
