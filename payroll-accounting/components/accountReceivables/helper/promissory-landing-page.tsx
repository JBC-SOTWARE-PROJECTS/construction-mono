import {
  DeleteOutlined,
  EyeOutlined,
  PrinterOutlined,
  SolutionOutlined,
  StopOutlined,
  TagsOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

export const CreatePromissoryMenu: MenuProps['items'] = [
  {
    label: 'Regular PN',
    key: 'REGULAR',
    icon: <TagsOutlined />,
  },
  {
    label: 'Secured PN',
    key: 'SECURED',
    icon: <SolutionOutlined />,
  },
  {
    label: 'Employee PN',
    key: 'EMPLOYEE',
    icon: <UsergroupAddOutlined />,
  },
]

export const PNTypeDetails = {
  REGULAR: { icon: <SolutionOutlined />, label: 'Regular PN', color: 'purple' },
  SECURED: { icon: <TagsOutlined />, label: 'Secured PN', color: 'magenta' },
  EMPLOYEE: { icon: <TagsOutlined />, label: 'Employee PN', color: 'magenta' },
}

export const ActionPNItem: MenuProps['items'] = [
  {
    label: 'View/Edit',
    key: 'view-edit',
    icon: <EyeOutlined />,
  },
]
export const ActionPNItemPending: MenuProps['items'] = [
  {
    label: 'Print',
    key: 'print',
    icon: <PrinterOutlined />,
  },
]
