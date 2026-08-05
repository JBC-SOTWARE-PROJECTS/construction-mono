import { Statistic, StatisticProps, Typography } from "antd"
import CountUp from "react-countup"
import styled from "styled-components"

interface StatisticCardProps {
  title: string
  value: number | string
  loading: boolean
}

const StatisticCard = (props: StatisticCardProps) => {
  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} separator="," />
  )

  return (
    <CardStyled>
      <Statistic
        title={<Typography.Title level={5}>{props.title}</Typography.Title>}
        value={props.value}
        formatter={formatter}
        prefix={<p>&#x20B1;</p>}
        style={{
          color: "#171826",
        }}
        valueStyle={{
          fontWeight: 700,
          color: "#00b5ad",
        }}
        loading={props.loading}
      />
    </CardStyled>
  )
}

const CardStyled = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  text-align: left;
  box-shadow: 0 6px 16px -8px #00000014, 0 9px 28px #0000000d,
    0 12px 48px 16px #00000008;
  border-radius: 8px;
`

export default StatisticCard
