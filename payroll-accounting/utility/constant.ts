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
  { label: "value_a", value: "value_a" },
  { label: "value_b", value: "value_b" },
  { label: "value_c", value: "value_c" },
  { label: "value_d", value: "value_d" },
  { label: "value_e", value: "value_e" },
  { label: "value_f", value: "value_f" },
  { label: "value_g", value: "value_g" },
  { label: "value_h", value: "value_h" },
  { label: "value_i", value: "value_i" },
  { label: "value_j", value: "value_j" },
  { label: "value_k", value: "value_k" },
  { label: "value_l", value: "value_l" },
  { label: "value_m", value: "value_m" },
  { label: "value_n", value: "value_n" },
  { label: "value_o", value: "value_o" },
  { label: "value_p", value: "value_p" },
  { label: "value_q", value: "value_q" },
  { label: "value_r", value: "value_r" },
  { label: "value_s", value: "value_s" },
  { label: "value_t", value: "value_t" },
  { label: "value_u", value: "value_u" },
  { label: "value_v", value: "value_v" },
  { label: "value_w", value: "value_w" },
  { label: "value_x", value: "value_x" },
  { label: "value_y", value: "value_y" },
  { label: "value_z", value: "value_z" },
  { label: "value_z1", value: "value_z1" },
  { label: "value_z2", value: "value_z2" },
  { label: "value_z3", value: "value_z3" },
  { label: "value_z4", value: "value_z4" },
  { label: "value_z5", value: "value_z5" },
  { label: "value_z6", value: "value_z6" },
  { label: "value_z7", value: "value_z7" },
  { label: "value_z8", value: "value_z8" },
  { label: "value_z9", value: "value_z9" },
  { label: "value_z10", value: "value_z10" },
  { label: "value_z11", value: "value_z11" },
  { label: "value_z12", value: "value_z12" },
  { label: "value_z13", value: "value_z13" },
  { label: "value_z14", value: "value_z14" },
  { label: "value_z15", value: "value_z15" },
  { label: "value_z16", value: "value_z16" },
  { label: "value_z17", value: "value_z17" },
  { label: "value_z18", value: "value_z18" },
  { label: "value_z19", value: "value_z19" },
  { label: "value_z20", value: "value_z20" },
  { label: "value_z21", value: "value_z21" },
  { label: "value_z22", value: "value_z22" },
  { label: "value_z23", value: "value_z23" },
  { label: "value_z24", value: "value_z24" },
  { label: "value_z25", value: "value_z25" },
  { label: "value_z26", value: "value_z26" },
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
