import {
  DeleteOutlined,
  EyeOutlined,
  PrinterOutlined,
  SolutionOutlined,
  StopOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

export const CreatePaymentMenu: MenuProps['items'] = [
  {
    label: 'Invoice Payments',
    key: 'INVOICE',
    icon: <SolutionOutlined />,
  },
  {
    label: 'Promissory Note Payments',
    key: 'PROMISSORY_NOTE',
    icon: <TagsOutlined />,
  },
]

export const ActionPaymentItem: MenuProps['items'] = [
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
