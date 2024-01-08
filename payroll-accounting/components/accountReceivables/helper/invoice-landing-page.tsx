import {
  DeleteOutlined,
  EyeOutlined,
  PrinterOutlined,
  SolutionOutlined,
  StopOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

export const CreateInvoiceMenu: MenuProps['items'] = [
  {
    label: 'Project Invoice',
    key: 'PROJECT',
    icon: <SolutionOutlined />,
  },
  {
    label: 'Regular Invoice',
    key: 'REGULAR',
    icon: <TagsOutlined />,
  },
]

export const ActionInvoiceItem: MenuProps['items'] = [
  {
    label: 'View/Edit',
    key: 'view-edit',
    icon: <EyeOutlined />,
  },
  {
    label: 'Print',
    key: 'print',
    icon: <PrinterOutlined />,
  },
  {
    label: 'Void',
    key: 'void',
    icon: <StopOutlined />,
    danger: true,
  },
  // {
  //   label: 'Delete',
  //   key: 'delete',
  //   icon: <DeleteOutlined />,
  //   danger: true,
  // },
]
