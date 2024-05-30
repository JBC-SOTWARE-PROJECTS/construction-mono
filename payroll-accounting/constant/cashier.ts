export const cashieringCardType = [
  { label: "VISA", value: "VISA" },
  { label: "MASTERCARD", value: "MASTERCARD" },
  { label: "JCB", value: "JCB" },
  { label: "UNIONPAY", value: "UNIONPAY" },
  { label: "AMEX", value: "AMEX" },
  { label: "OTHERS", value: "OTHERS" },
]

export const cashieringMiscEWalletType = [
  { label: "MAYA", value: "MAYA" },
  { label: "GCASH", value: "GCASH" },
  { label: "QRPH", value: "QRPH" },
  { label: "OTHERS", value: "OTHERS" },
]

export const PayorCategoryOptions = [
  { label: "FOLIO", value: "FOLIO" },
  { label: "HMO", value: "HMO" },
  { label: "CORPORATE", value: "CORPORATE" },
  { label: "DOCTORS", value: "DOCTORS" },
  { label: "EMPLOYEE", value: "EMPLOYEE" },
  { label: "INVESTOR", value: "INVESTOR" },
  { label: "PROMISSORY NOTE", value: "PROMISSORY NOTE" },
  { label: "OTHERS", value: "OTHERS" },
]

export const PayorOptionsPerType = {
  "project-payments": [{ label: "FOLIO", value: "FOLIO" }],
  "otc-payments": [{ label: "FOLIO", value: "FOLIO" }],
  "miscellaneous-payments-or": [
    { label: "FOLIO", value: "FOLIO" },
    { label: "OTHERS", value: "OTHERS" },
    { label: "EMPLOYEE", value: "EMPLOYEE" },
    { label: "DOCTORS", value: "DOCTORS" },
  ],
  "miscellaneous-payments-ar": [
    { label: "FOLIO", value: "FOLIO" },
    { label: "OTHERS", value: "OTHERS" },
    { label: "EMPLOYEE", value: "EMPLOYEE" },
    { label: "DOCTORS", value: "DOCTORS" },
  ],
}

export const RegistryTypeOption = [
  { label: "ALL", value: "ALL" },
  { label: "IPD", value: "IPD" },
  { label: "ERD", value: "ERD" },
  { label: "OPD", value: "OPD" },
]
