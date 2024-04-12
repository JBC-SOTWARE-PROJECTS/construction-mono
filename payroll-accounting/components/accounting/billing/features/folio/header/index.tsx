import { Col, ColProps, Row } from "antd"
import styled from "styled-components"
import { FolioHeaderProps } from ".."
import { BillingInfo, CustomerInfo, ProjectInfo } from "./info"
import { FolioActions, FolioSummary } from "./others"

const firstInfoProps: ColProps = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 19 },
}

const secondInfoProps: ColProps = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 5 },
}

export default function FolioHeader(props: FolioHeaderProps) {
  return (
    <Row gutter={[8, 8]}>
      <Col {...firstInfoProps}>
        <InfoContainer>
          <Row gutter={[8, 8]} style={{ height: "100%" }}>
            <BillingInfo {...props?.billing} />
            <CustomerInfo {...props?.billing?.customer} />
            <ProjectInfo
              {...{
                ...props?.billing?.project,
                swa: props?.billing?.projectWorkAccomplishNo ?? "--",
              }}
            />
          </Row>
        </InfoContainer>
      </Col>
      <Col {...secondInfoProps}>
        <Row gutter={[8, 8]} style={{ height: "100%" }}>
          <FolioSummary {...props?.billing} />
          <FolioActions
            {...{
              id: props?.billing?.id,
              locked: !!props?.billing?.locked,
              messageApi: props.messageApi,
              onRefetchBilling: props.onRefetchBilling,
            }}
          />
        </Row>
      </Col>
    </Row>
  )
}

const InfoContainer = styled.div`
  height: 100%;
`
