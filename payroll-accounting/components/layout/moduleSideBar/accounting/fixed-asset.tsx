import { MenuOutlined } from '@ant-design/icons'

const FixedAssetMenu = {
  route: {
    path: '/',
    routes: [
      {
        path: '/accounting/fixed-asset',
        name: 'Accounts Receivable',
        routes: [
          {
            path: '/accounting/fixed-asset/registered-assets',
            name: 'Registered Assets',
          },
          {
            path: '/accounting/fixed-asset/depreciation',
            name: 'Depreciation',
          },
          {
            path: '/accounting/fixed-asset/maintenance',
            name: 'Maintenance',
          },
          {
            path: '/accounting/fixed-asset/disposal',
            name: 'Disposal',
          },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
}

export default FixedAssetMenu
