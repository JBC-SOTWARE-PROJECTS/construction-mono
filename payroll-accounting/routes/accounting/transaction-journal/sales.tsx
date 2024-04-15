import { TransactionJournalI } from "@/components/accounting/transaction-journal/features/transaction-journal-page"
import asyncComponent from "@/utility/asyncComponent"
import { PageContainer } from "@ant-design/pro-components"

const TransactionJournal = asyncComponent(
  () =>
    import(
      "@/components/accounting/transaction-journal/features/transaction-journal-page"
    )
)

export default function TJSalesRoute(props: TransactionJournalI) {
  return (
    <PageContainer content="Sales Records in Transaction Journal">
      <TransactionJournal {...props} />
    </PageContainer>
  )
}
