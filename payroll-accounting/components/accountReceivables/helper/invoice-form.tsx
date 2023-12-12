import {
  DislikeOutlined,
  LikeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

export const SaveItems: MenuProps['items'] = [
  {
    label: 'Submit for Approval',
    key: 'submit-approval',
    icon: <LikeOutlined />,
  },
]

export const SaveForApprovalItems: MenuProps['items'] = []

export const ApproveItems: MenuProps['items'] = [
  {
    label: 'Void & Close',
    key: 'void-close',
    icon: <DislikeOutlined />,
  },
]
