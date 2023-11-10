import { LikeOutlined, PlusCircleOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

export const PromissoryMenuSaveItems: MenuProps['items'] = [
  {
    label: 'Submit for Approval',
    key: 'submit-approval',
    icon: <LikeOutlined />,
  },
]
