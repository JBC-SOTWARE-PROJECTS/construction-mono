import CreateFixedAsset from '@/components/accounting/fixed-asset/dialogs/create-fixed-asset'
import CreateMultiFixedAsset from '@/components/accounting/fixed-asset/dialogs/create-multi-fixed-asset'
import { UPSERT_FIXED_ASSET } from '@/components/accounting/fixed-asset/others/gql'
import {
  CardLayout,
  CustomPageTitle,
} from '@/components/common/custom-components'
import { FixedAssetItems, Office } from '@/graphql/gql/graphql'
import { useConfirmationPasswordHook, useDialog } from '@/hooks'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Button, Dropdown, Space, Table, message } from 'antd'
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
        isBeginningBalance
      }
    }
  }
`

export default function RegisteredAssets() {
  const createDialog = useDialog(CreateFixedAsset)
  const createMultiDialog = useDialog(CreateMultiFixedAsset)
  const [showPasswordConfirmation] = useConfirmationPasswordHook()

  const [onUpdate, { loading }] = useMutation(UPSERT_FIXED_ASSET)

  const {
    data: registeredData,
    loading: registeredLoading,
    refetch,
  } = useQuery(REGISTERED_FIXED_ASSET_PAGEABLE, {
    variables: {
      filter: '',
      page: 0,
      size: 10,
    },
  })

  const handleSearch = (e: string) => {
    refetch({ filter: e })
  }
  const handleVoid = (id: string) => {
    showPasswordConfirmation(() => {
      onUpdate({
        variables: {
          id,
          fields: {
            status: 'VOIDED',
          },
        },
        onCompleted: (data) => {
          data?.upsertFixedAssetItems?.success
            ? message.success('Successfully voided.')
            : message.error('Something went wrong.')
          refetch()
        },
      })
    })
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
        createDialog({ record }, () => {
          refetch()
        })
        break
      case 'void':
        handleVoid(record?.id)
        break
      default:
        break
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Asset No.',
      dataIndex: 'assetNo',
      width: 70,
    },
    {
      title: 'Serial No.',
      dataIndex: 'serialNo',
      width: 70,
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
      width: 70,
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
      width: 80,
      render: (text) => (text ? `${text} year(s)` : ''),
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
