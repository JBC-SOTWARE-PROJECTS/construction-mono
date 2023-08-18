import { Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function PageHeader(props: { title: string; subTitle: string }) {
  const { title, subTitle } = props
  return (
    <Typography>
      <Title level={3}>{title}</Title>
      <Paragraph>{subTitle}</Paragraph>
    </Typography>
  )
}
