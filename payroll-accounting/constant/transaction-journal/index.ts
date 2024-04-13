export const JournalTypeLabel = {
  ALL: "ALL",
  DISBURSEMENT: "DISBURSEMENT",
  GENERAL: "GENERAL",
  PURCHASES_PAYABLES: "PURCHASES PAYABLES",
  RECEIPTS: "RECEIPTS",
  SALES: "SALES",
}

export const JournalTypeColor = {
  ALL: "orange",
  SALES: "magenta",
  DISBURSEMENT: "purple",
  GENERAL: "green",
  PURCHASES_PAYABLES: "red",
  RECEIPTS: "gold",
}

export const JournalTypeOpt = [
  { label: "General", value: "GENERAL" },
  { label: "Sales", value: "SALES" },
  { label: "Disbursement", value: "DISBURSEMENT" },
  { label: "Purchases Payables", value: "PURCHASES_PAYABLES" },
  { label: "Receipts", value: "RECEIPTS" },
]

export const JournalDocTypeOpt = [
  {
    label: "Journal Vouchers",
    value: "JV",
  },
  {
    label: "Credit Note",
    value: "CN",
  },
  {
    label: "Debit Note",
    value: "DM",
  },
]
