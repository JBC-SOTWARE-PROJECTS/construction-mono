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

export const AP_TRANSCTION_CATEGORY = [
  { label: "ACCOUNTS PAYABLE", value: "AP" },
  { label: "DISBURSEMENT VOUCHERS", value: "DS" },
  { label: "REAPPLICATION DISBURSEMENT", value: "RP" },
  { label: "PETTY CASH", value: "PC" },
  { label: "DEBIT MEMO", value: "DM" },
  { label: "DEBIT ADVICE", value: "DA" },
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
