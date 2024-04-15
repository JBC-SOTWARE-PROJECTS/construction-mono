import { TransactionJournalI } from "@/components/accounting/transaction-journal/features/transaction-journal-page"
import { PageContainer } from "@ant-design/pro-components"
import asyncComponent from "@/utility/asyncComponent"

const TransactionJournal = asyncComponent(
  () =>
    import(
      "@/components/accounting/transaction-journal/features/transaction-journal-page"
    )
)
export default function TJDisbursementRoute(props: TransactionJournalI) {
  return (
    <PageContainer content="Disbursement Records in Transaction Journal">
      <TransactionJournal {...props} />
    </PageContainer>
  )
}
