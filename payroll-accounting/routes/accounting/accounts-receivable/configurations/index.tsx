import ARDefaultConfig from '@/components/accountReceivables/configuration/default'
import InvoiceItems from '@/components/accountReceivables/configuration/invoiceItems'
// import ARConfigurationPAge from '@/pages/receivables-collections/accounts-receivable/configurations'
import { PageContainer } from '@ant-design/pro-components'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'

export default function Configuration() {
  const items: TabsProps['items'] = [
    // {
    //   key: '1',
    //   label: 'Default Setting',
    //   children: <ARDefaultConfig />,
    // },
    {
      key: '2',
      label: 'Product and services',
      children: <InvoiceItems />,
    },
  ]

  return (
    <PageContainer content='Customizing Accounts Receivable Settings'>
      <Tabs type='card' items={items} />
    </PageContainer>
  )
}
