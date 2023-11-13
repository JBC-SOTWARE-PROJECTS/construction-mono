import { FieldTimeOutlined, SyncOutlined } from '@ant-design/icons'
import { Space, Tag, Typography } from 'antd'
import { textStatus } from '../invoice/form/helper'

interface CustomModalTitleI {
  title: { onNew: string; onEdit: string }
  subTitle: { onNew: string; onEdit: string }
  editing: boolean
  style?: any
}
export function CustomModalTitle(props: CustomModalTitleI) {
  const { title, subTitle, editing, style } = props
  return (
    <Space.Compact direction='vertical' style={style}>
      <Typography.Title level={4}>
        <Space align='baseline'>
          <FieldTimeOutlined />
          <b>
            <Space>
              <>
                {textStatus({
                  ...title,
                  editing,
                })}
              </>
            </Space>
          </b>
        </Space>
      </Typography.Title>
      <Typography.Text type='secondary' italic>
        {textStatus({
          ...subTitle,
          editing,
        })}
      </Typography.Text>
    </Space.Compact>
  )
}

export default function CustomModalPageHeader(props: {
  label: string
  tag?: { color?: string; label?: string } | null
  labelProps?: {}
}) {
  const { label, tag, labelProps } = props
  return (
    <Space direction='vertical'>
      <Space align='center'>
        <Typography.Title
          level={4}
          style={{
            fontWeight: 700,
            color: tag?.color,
            ...labelProps,
          }}
        >
          {label}
        </Typography.Title>
        <Typography.Title level={4}>
          {tag && (
            <Tag
              icon={<SyncOutlined spin />}
              bordered={false}
              color={tag?.color}
            >
              {tag?.label}
            </Tag>
          )}
        </Typography.Title>
      </Space>
    </Space>
  )
}
