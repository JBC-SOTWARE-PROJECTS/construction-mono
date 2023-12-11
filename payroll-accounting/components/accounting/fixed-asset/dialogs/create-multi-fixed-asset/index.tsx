import { Header } from '@/components/common/custom-components/styled-html'
import { Modal, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useForm } from 'antd/lib/form/Form'
import numeral from 'numeral'
import MultiFixedAssetItemTable from './table'
import { useGetFixedAssetItems } from '@/hooks/fixed-asset'
import { createContext, useState } from 'react'
import { ApolloError } from '@apollo/client'
import { FixedAssetItems, Item, Maybe, Office } from '@/graphql/gql/graphql'
import { useGetCompanyActiveOffices } from '@/hooks/public'
import { CustomHooksQueryList } from '@/interface/common/graphql-hooks'
import MultiFixedAssetItemFooter from './footer'

interface CreateMultiFixedAssetI {
  hide: () => void
}

interface MultiFixedAssetI {
  fixedAssetItemList?: CustomHooksQueryList<Item>
  companyOffices?: CustomHooksQueryList<Office>
}

export const MultiFixedAssetContext = createContext<MultiFixedAssetI | null>(
  null
)

export default function CreateMultiFixedAsset(props: CreateMultiFixedAssetI) {
  const [form] = useForm()
  const [isBegBal, setIsBegBal] = useState(true)
  const [dataSource, setDataSource] = useState<FixedAssetItems[]>([])

  const fixedAssetItemList = useGetFixedAssetItems()
  const companyOffices = useGetCompanyActiveOffices()

  return (
    <Modal
      title={<Header $bold='bolder'>Create Multiple Fixed Asset Items</Header>}
      open
      okText='Create'
      width='100%'
      footer={<></>}
      maskStyle={{ background: '#f2f3f4' }}
      closeIcon={false}
    >
      <MultiFixedAssetContext.Provider
        value={{ fixedAssetItemList, companyOffices }}
      >
        <MultiFixedAssetItemTable
          {...{ isBegBal, dataSource, setDataSource }}
        />
        <MultiFixedAssetItemFooter
          {...{ form, isBegBal, setIsBegBal, dataSource, ...props }}
        />
      </MultiFixedAssetContext.Provider>
    </Modal>
  )
}
