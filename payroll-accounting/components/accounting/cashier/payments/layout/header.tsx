import { getRandomBoyGirl } from "@/utility/helper"
import { MenuOutlined } from "@ant-design/icons"
import { Avatar, Button, Layout, Tag, Typography } from "antd"
import styled from "styled-components"
import { TerminalWindowsHeaderProps } from "../data-types/interfaces"
import { paymentTypesLabel } from "../data-types/constants"
import { PaymentType } from "../data-types/types"

const { Header } = Layout

const TerminalWindowHeader = (props: TerminalWindowsHeaderProps) => {
  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",

        background: "#fff",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="link"
          icon={<MenuOutlined />}
          style={{ marginRight: 24, color: "#399b53" }}
        />
        <Logo>
          <b
            style={{
              color: "#399b53",
              fontWeight: "bolder",
              fontSize: "large",
            }}
          >
            {paymentTypesLabel[props.paymentType as PaymentType]} Payments{" "}
            {props?.nextOR ? (
              <Tag style={{ fontSize: "medium" }}>
                {props.type} - {props.nextOR}
              </Tag>
            ) : (
              <></>
            )}
          </b>
        </Logo>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          style={{ marginRight: 10 }}
          src={`/images/avatar-${
            props.randomGender == "boy" ? "girl" : "boy"
          }.svg`}
        />
        <b>{props?.userName ?? ""}</b>
      </div>
    </Header>
  )
}

export default TerminalWindowHeader

const Logo = styled.div`
  font-weight: bold;
`
