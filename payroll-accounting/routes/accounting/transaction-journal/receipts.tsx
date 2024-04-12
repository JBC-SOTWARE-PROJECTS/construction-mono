import { TransactionJournalI } from "@/components/accounting/transaction-journal/features/transaction-journal-page"
import asyncComponent from "@/utility/asyncComponent"
import { PageContainer } from "@ant-design/pro-components"

const TransactionJournal = asyncComponent(
  () =>
    import(
      "@/components/accounting/transaction-journal/features/transaction-journal-page"
    )
)

export default function TJReceiptsRoute(props: TransactionJournalI) {
  return (
    <PageContainer content="Receipts Records in Transaction Journal">
      <TransactionJournal {...props} />
    </PageContainer>
  )
}
