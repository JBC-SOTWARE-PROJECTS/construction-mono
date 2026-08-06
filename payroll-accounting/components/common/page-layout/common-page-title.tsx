import { Space, Typography } from 'antd'
import { ReactNode } from 'react'

interface CommonPageTitleI {
  title: string | ReactNode
  subTitle?: string
}

export default function CommonPageTitle(props: CommonPageTitleI) {
  const { title, subTitle } = props
  return (
    <Space direction='vertical'>
      <Typography.Title level={4} style={{ fontWeight: 700, margin: 0 }}>
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
