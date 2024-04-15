import React from "react"
import asyncComponent from "@/utility/asyncComponent"
import { useRouter } from "next/router"

const BillingFolioComponent = asyncComponent(
  () => import("@/routes/accounting/billing/folio")
)

const BillingFolio = () => {
  const router = useRouter()
  const { id }: { id?: string } = router.query

  return <BillingFolioComponent id={id} type="billing" />
}

export default BillingFolio
