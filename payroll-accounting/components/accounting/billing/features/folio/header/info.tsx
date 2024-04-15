import { ArCustomers, Billing, Customer, Projects } from "@/graphql/gql/graphql"
import {
  AuditOutlined,
  IdcardOutlined,
  LockOutlined,
  SelectOutlined,
  SolutionOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons"
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Space,
  Tag,
  Typography,
} from "antd"
import { DescriptionsItemProps } from "antd/lib/descriptions/Item"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import styled from "styled-components"

const LabelProps: Omit<DescriptionsItemProps, "children"> = {
  labelStyle: { fontWeight: 700 },
}

export const BillingInfo = (props: Billing) => {
  return (
    <Col
      xs={{ flex: "100%" }}
      sm={{ flex: "100%" }}
      md={{ flex: "100%" }}
      lg={{ flex: "50%" }}
      xl={{ flex: "50%" }}
    >
      <CardFlex>
        <Card size="small" bordered={false}>
          <Descriptions
            title={
              <Typography.Text style={{ color: "#399b53 " }}>
                <SolutionOutlined />
                Billing Information
              </Typography.Text>
            }
            column={{ xs: 1, sm: 2, md: 3, lg: 2, xl: 2, xxl: 2 }}
          >
            <Descriptions.Item
              label="Transaction Date"
              {...LabelProps}
              span={2}
            >
              {props?.dateTrans
                ? dayjs(props?.dateTrans).format("MMMM D,YYYY")
                : "--"}
            </Descriptions.Item>

            <Descriptions.Item label="Billing No." {...LabelProps}>
              {props?.billNo ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Billing Status" {...LabelProps}>
              {props?.status ? (
                <Badge status="processing" text="Active" />
              ) : (
                <Badge status="success" text="Closed" />
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Locked Status	" {...LabelProps}>
              {props?.locked ? (
                <Tag color="error" icon={<LockOutlined />}>
                  Locked
                </Tag>
              ) : (
                <Tag color="#87d068" icon={<UnlockOutlined />}>
                  Open
                </Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Locked By" {...LabelProps}>
              {props?.lockedBy ?? "--"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </CardFlex>
    </Col>
  )
}

export const CustomerInfo = (props?: ArCustomers) => {
  const onNewTab = () => {
    window.open(`/accounting/accounts-receivable/clients/${props?.id}`)
  }

  return (
    <Col
      xs={{ flex: "100%" }}
      sm={{ flex: "100%" }}
      md={{ flex: "100%" }}
      lg={{ flex: "50%" }}
      xl={{ flex: "50%" }}
    >
      <CardFlex>
        <Card size="small" bordered={false}>
          <Descriptions
            title={
              <Typography.Text style={{ color: "#399b53 " }}>
                <IdcardOutlined /> Customer Information
              </Typography.Text>
            }
            column={{ xs: 1, sm: 2, md: 3, lg: 2, xl: 2, xxl: 2 }}
            extra={
              <Space>
                <Button
                  type="link"
                  size="small"
                  icon={<SelectOutlined />}
                  onClick={onNewTab}
                />
              </Space>
            }
          >
            <Descriptions.Item label="Customer Name" {...LabelProps} span={2}>
              {props?.customerName ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Customer Type" {...LabelProps} span={2}>
              {props?.customerType ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Contact Number" {...LabelProps}>
              {props?.contactNo ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Email Address" {...LabelProps}>
              {props?.contactEmail ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Address" {...LabelProps}>
              {props?.address ?? "--"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </CardFlex>
    </Col>
  )
}

export const ProjectInfo = (props?: Projects & { swa: string }) => {
  const onNewTab = () => {
    window.open(`/inventory/project-details/${props?.id}/bill-quantities`)
  }

  return (
    <Col
      xs={{ flex: "100%" }}
      sm={{ flex: "100%" }}
      md={{ flex: "100%" }}
      lg={{ flex: "100%" }}
      xl={{ flex: "100%" }}
    >
      <CardFlex>
        <Card size="small" bordered={false}>
          <Descriptions
            title={
              <Typography.Text style={{ color: "#399b53 " }}>
                <AuditOutlined />
                Project&apos;s Information
              </Typography.Text>
            }
            extra={
              <Space>
                <Button
                  type="link"
                  size="small"
                  icon={<SelectOutlined />}
                  onClick={onNewTab}
                />
              </Space>
            }
          >
            <Descriptions.Item label="Code " {...LabelProps}>
              {props?.projectCode ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="SWA " {...LabelProps}>
              {props?.swa ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={2} {...LabelProps}>
              {props?.status == "PENDING" ? (
                <Badge status="processing" text={props?.status ?? "--"} />
              ) : (
                <Badge status="success" text={props?.status ?? "--"} />
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={3} {...LabelProps}>
              {props?.description ?? "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={3} {...LabelProps}>
              {props?.location?.fullAddress ?? "--"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </CardFlex>
    </Col>
  )
}

const CardFlex = styled.div`
  height: 100%;
  .ant-card {
    height: 100%;
  }
`
