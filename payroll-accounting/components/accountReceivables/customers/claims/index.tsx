import { ClockCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { Button, Form, Modal, Space, Typography, Input, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import GuarantorClaims from './guarantorClaims'
import { CREATE_INVOICE } from '@/graphql/accountReceivables/invoices'
import { useMutation } from '@apollo/client'
import { useFindCustomers } from '@/hooks/accountReceivables'
import { useState } from 'react'
import TransferredClaims from './transferredClaims'
import { ArInvoice } from '@/graphql/gql/graphql'
import { CustomModalPageHeader } from '../../common'

const { Search } = Input

export default function CustomerClaims(props: {
  hide: (hideProps: any) => void
  id: string
  customerRefId: string
}) {
  const { hide, id, customerRefId } = props || { id: null, customerRefId: null }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Guarantor Claims`,
      children: <GuarantorClaims {...{ id, customerRefId, hide }} />,
    },
    // {
    //   key: '2',
    //   label: `Transferred Claims`,
    //   children: (
    //     <TransferredClaims
    //       {...{ invoiceId, customerId, invoiceReturn, setInvoiceReturn }}
    //     />
    //   ),
    // },
  ]

  return (
    <Modal
      title={
        <CustomModalPageHeader
          {...{
            label: 'Patient Claims',
          }}
        />
      }
      open={true}
      width={'100%'}
      style={{ maxWidth: '1600px' }}
      closable={false}
      // onCancel={() => hide(false)}
      footer={<></>}
    >
      <Tabs defaultActiveKey='1' items={items} type='card' />
    </Modal>
  )
}
