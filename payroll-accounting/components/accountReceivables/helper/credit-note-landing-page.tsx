import {
  DeleteOutlined,
  EyeOutlined,
  PrinterOutlined,
  SolutionOutlined,
  StopOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

export const CreateCreditNoteMenu: MenuProps['items'] = [
  {
    label: 'Invoice Credit Note',
    key: 'INVOICE',
    icon: <SolutionOutlined />,
  },
  {
    label: 'Promissory Note Credit Note',
    key: 'PROMISSORY_NOTE',
    icon: <TagsOutlined />,
  },
]

export const ActionCreditNoteItem: MenuProps['items'] = [
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
