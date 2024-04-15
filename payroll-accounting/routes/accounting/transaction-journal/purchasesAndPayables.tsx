import { TransactionJournalI } from "@/components/accounting/transaction-journal/features/transaction-journal-page"
import { PageContainer } from "@ant-design/pro-components"
import asyncComponent from "@/utility/asyncComponent"

const TransactionJournal = asyncComponent(
  () =>
    import(
      "@/components/accounting/transaction-journal/features/transaction-journal-page"
    )
)

export default function TJPurchasePayableRoute(props: TransactionJournalI) {
  return (
    <PageContainer content="Purchases & Payable Records in Transaction Journal">
      <TransactionJournal {...props} />
    </PageContainer>
  )
}
