import CreateFixedAsset from '@/components/accounting/fixed-asset/dialogs/create-fixed-asset'
import CreateMultiFixedAsset from '@/components/accounting/fixed-asset/dialogs/create-multi-fixed-asset'
import {
  CardLayout,
  CustomPageTitle,
} from '@/components/common/custom-components'
import { useDialog } from '@/hooks'
import { PageContainer } from '@ant-design/pro-components'
import { Button, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import numeral from 'numeral'

export default function RegisteredAssets() {
  const createDialog = useDialog(CreateFixedAsset)
  const createMultiDialog = useDialog(CreateMultiFixedAsset)

  const handleSearch = () => {}
  const handleCreateClick = () => {
    createDialog({}, () => {})
  }
  const handleMultiCreateClick = () => {
    createMultiDialog({}, () => {})
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Serial No.',
      dataIndex: 'serialNo',
      width: 100,
    },
    {
      title: 'Asset Name',
      dataIndex: 'assetName',
      width: 200,
    },
    {
      title: 'Depreciation Start Date',
      dataIndex: 'depreciationStartDate',
      width: 70,
    },
    {
      title: 'Salvage Value',
      dataIndex: 'salvage_value',
      align: 'right',
      width: 120,
    },
    {
      title: 'Purchase Price',
      dataIndex: 'purchase_price',
      align: 'right',
      width: 120,
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Useful Life',
      dataIndex: 'useful_life',
      width: 120,
    },
    {
      title: '#',
      dataIndex: 'id',
      fixed: 'right',
      width: 40,
    },
  ]

  return (
    <PageContainer
      title={
        <CustomPageTitle
          title='Registered Assets'
          subTitle='Managing and Maximizing Registered Assets.'
        />
      }
    >
      <CardLayout
        onSearch={handleSearch}
        extra={
          <Space>
            <Button onClick={handleCreateClick}>Add an asset</Button>
            <Button onClick={handleMultiCreateClick} type='dashed'>
              Add multiple assets
            </Button>
          </Space>
        }
      >
        <Table size='small' columns={columns} />
      </CardLayout>
    </PageContainer>
  )
}
