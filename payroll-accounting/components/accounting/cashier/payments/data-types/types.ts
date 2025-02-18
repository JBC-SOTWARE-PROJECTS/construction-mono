import { ArCustomers, Billing, Projects } from "@/graphql/gql/graphql"

export type Payor = Projects | ArCustomers | Billing

export type GenderType = "boy" | "girl"

export type PayorType = "FOLIO" | "WALK-IN" | "EMPLOYEE" | "OTHER"

export type RegistryType = "OPD" | "IPD" | "ERD" | "ALL" | "OTC"

export type PaymentType =
  | "project-payments"
  | "otc-payments"
  | "miscellaneous-payments-or"
  | "miscellaneous-payments-ar"
