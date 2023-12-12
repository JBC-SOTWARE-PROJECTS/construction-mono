import CreateFixedAsset from '@/components/accounting/fixed-asset/dialogs/create-fixed-asset'
import CreateMultiFixedAsset from '@/components/accounting/fixed-asset/dialogs/create-multi-fixed-asset'
import {
  CardLayout,
  CustomPageTitle,
} from '@/components/common/custom-components'
import { FixedAssetItems, Office } from '@/graphql/gql/graphql'
import { useDialog } from '@/hooks'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useQuery } from '@apollo/client'
import { Button, Dropdown, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import numeral from 'numeral'

const REGISTERED_FIXED_ASSET_PAGEABLE = gql`
  query ($filter: String, $page: Int, $size: Int) {
    page: getFixedAssetPageable(filter: $filter, page: $page, size: $size) {
      content {
        id
        assetNo
        serialNo
        itemId
        itemName
        depreciationMethod
        depreciationStartDate
        office {
          id
          officeDescription
        }
        salvageValue
        purchasePrice
        purchaseDate
        usefulLife
        accumulatedDepreciation
      }
    }
  }
`

export default function RegisteredAssets() {
  const createDialog = useDialog(CreateFixedAsset)
  const createMultiDialog = useDialog(CreateMultiFixedAsset)

  const {
    data: registeredData,
    loading: registeeredLoading,
    refetch,
  } = useQuery(REGISTERED_FIXED_ASSET_PAGEABLE, {
    variables: {
      filter: '',
      page: 0,
      size: 10,
    },
  })

  const handleSearch = () => {}
  const handleCreateClick = () => {
    createDialog({}, () => {})
  }
  const handleMultiCreateClick = () => {
    createMultiDialog({}, () => {
      refetch()
    })
  }

  const handleDepreciation = () => {}

  const handleMenuOptionClick = (
    { key }: { key: string },
    record: FixedAssetItems
  ) => {
    switch (key) {
      case 'view':
        createDialog({ record }, () => {})
      default:
        break
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Asset No.',
      dataIndex: 'assetNo',
      width: 100,
    },
    {
      title: 'Serial No.',
      dataIndex: 'serialNo',
      width: 100,
    },
    {
      title: 'Asset Name',
      dataIndex: 'itemName',
      width: 200,
    },
    {
      title: 'Office',
      dataIndex: 'office',
      width: 150,
      render: (text: Office) => text?.officeDescription ?? '',
    },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      width: 100,
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Purchase Price',
      dataIndex: 'purchasePrice',
      align: 'right',
      width: 120,
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Depreciation Start Date',
      dataIndex: 'depreciationStartDate',
      width: 120,
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Accumulated Depreciation',
      dataIndex: 'accumulatedDepreciation',
      align: 'right',
      width: 150,
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Salvage Value',
      dataIndex: 'salvageValue',
      align: 'right',
      width: 120,
      render: (text) => numeral(text).format('0,0.00'),
    },
    {
      title: 'Useful Life',
      dataIndex: 'usefulLife',
      width: 100,
    },
    {
      title: '#',
      dataIndex: 'id',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (_, record: FixedAssetItems) => (
        <Dropdown.Button
          type='primary'
          menu={{
            items: [
              {
                label: 'View/Edit',
                key: 'view',
                icon: <EyeOutlined />,
              },
              {
                label: 'Void',
                key: 'void',
                icon: <DeleteOutlined />,
              },
            ],
            onClick: (e) => handleMenuOptionClick(e, record),
          }}
          onClick={handleDepreciation}
        >
          Depreciate
        </Dropdown.Button>
      ),
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
            <Button onClick={handleMultiCreateClick} type='dashed'>
              Add asset(s)
            </Button>
          </Space>
        }
      >
        <Table
          size='small'
          columns={columns}
          dataSource={registeredData?.page?.content ?? []}
          scroll={{ x: 2000 }}
        />
      </CardLayout>
    </PageContainer>
  )
}
