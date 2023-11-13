import { Space, Typography } from 'antd'
import { ReactNode } from 'react'

interface CustomPageTitleI {
  title: string | ReactNode
  subTitle?: string
}

export default function CustomPageTitle(props: CustomPageTitleI) {
  const { title, subTitle } = props
  return (
    <Space direction='vertical'>
      <Typography.Title level={3} style={{ fontWeight: 700, margin: 0 }}>
        {title}
      </Typography.Title>
      {subTitle && (
        <Typography.Paragraph style={{ margin: 0, fontWeight: 400 }}>
          {subTitle}
        </Typography.Paragraph>
      )}
    </Space>
  )
}
