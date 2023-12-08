import { Header } from '@/components/common/custom-components/styled-html'
import { Modal, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useForm } from 'antd/lib/form/Form'
import numeral from 'numeral'
import MultiFixedAssetItemTable from './table'

interface CreateMultiFixedAssetI {
  hide: () => void
}

export default function CreateMultiFixedAsset(props: CreateMultiFixedAssetI) {
  const [form] = useForm()

  return (
    <Modal
      title={<Header $bold='bolder'>Create Multiple Fixed Asset Items</Header>}
      open
      onCancel={props.hide}
      okText='Save'
      width='100%'
    >
      <MultiFixedAssetItemTable />
    </Modal>
  )
}
