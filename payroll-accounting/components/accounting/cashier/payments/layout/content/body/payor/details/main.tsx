import {
  PaymentType,
  PayorType,
} from "@/components/accounting/cashier/payments/data-types/types"
import { getRandomBoyGirl } from "@/utility/helper"
import { Avatar, Card, Skeleton, Space } from "antd"
import { useRouter } from "next/router"
import { ReactNode } from "react"
import styled from "styled-components"

interface PayorAvatarProps {
  loading: boolean
}

export const PayorAvatar = (props: PayorAvatarProps) => {
  return props.loading ? (
    <Skeleton.Avatar
      active={true}
      size="default"
      shape="circle"
    ></Skeleton.Avatar>
  ) : (
    <Avatar
      style={{ marginRight: 10 }}
      src={`/images/avatar-${getRandomBoyGirl()}.svg`}
    />
  )
}

interface PayorName {
  loading: boolean
  children: ReactNode
}

export const PayorName = (props: PayorName) => {
  return props.loading ? (
    <Skeleton.Button active={true} size="small" style={{ height: 15 }} block />
  ) : (
    props.children
  )
}

interface PayorDescription {
  loading: boolean
  label: ReactNode | string
  extra: ReactNode | string
}

export const PayorDescription = (props: PayorDescription) => {
  return (
    <DescriptionBox className="description-box">
      <div className="box">{props?.label}</div>
      <div className="box">{props?.extra}</div>
    </DescriptionBox>
  )
}

type PayorDescType = {
  label: ReactNode | string
  extra: ReactNode | string
}

interface PayorLayoutProps {
  title?: ReactNode | string
  payorName: ReactNode | string
  payorDescription: PayorDescType
  paymentType: PaymentType
  payorType: PayorType
  loading: boolean
  children?: ReactNode
}

export const PayorLayout = ({ loading, ...props }: PayorLayoutProps) => {
  const hasValue = !!props?.payorName
  const { push } = useRouter()

  return (
    <>
      <Card size="small">
        <MetaCSS>
          <Card.Meta
            avatar={<PayorAvatar loading={loading} />}
            title={
              <Space>
                <PayorName loading={loading}>{props.payorName ?? ""}</PayorName>
                <>{props?.title ?? ""}</>
              </Space>
            }
            style={{ marginBottom: 5 }}
          />
          <PayorDescription {...{ loading, ...props.payorDescription }} />
        </MetaCSS>
      </Card>
      {props?.children ?? ""}
    </>
  )
}

const MetaCSS = styled.div`
  .ant-card-meta-description {
    color: black;
  }
`

const DescriptionBox = styled.div`
  display: flex;
  align-items: flex-end !important;
  .box:first-child {
    margin-right: auto;
    align-item: end;
  }
`
