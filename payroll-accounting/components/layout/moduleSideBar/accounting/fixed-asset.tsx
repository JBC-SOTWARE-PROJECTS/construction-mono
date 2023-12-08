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
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
}

export default FixedAssetMenu
