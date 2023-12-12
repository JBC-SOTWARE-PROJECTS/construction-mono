import { TransactionJournalI } from '@/components/accounting/transaction-journal'
import { PageContainer } from '@ant-design/pro-components'
import asyncComponent from '@/utility/asyncComponent'

const TransactionJournal = asyncComponent(
  () => import('@/components/accounting/transaction-journal')
)
export default function TJGeneralRoute(props: TransactionJournalI) {
  return (
    <PageContainer content='General Records in Transaction Journal'>
      <TransactionJournal {...props} />
    </PageContainer>
  )
}
