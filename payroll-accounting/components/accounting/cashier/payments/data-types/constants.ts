export type PaymentTypesLabel = {
  [key in keyof typeof paymentTypesLabel]: string
}

export const paymentTypesLabel = {
  "folio-payments": "Folio ",
  "otc-payments": "OTC",
  "investor-payments": "Investor ",
  "financial-assistance": "Financial Assistance",
  "insurance-payments": "Insurance ",
  "promissory-note-payments": "Promissory note ",
  "miscellaneous-payments-or": "Miscellaneous",
  "miscellaneous-payments-ar": "Miscellaneous",
}
