import TitleBox from "@/components/common/custom/title-box";
import { Progress, Layout, Space, Typography } from "antd";
import React from "react";
import { green } from "@ant-design/colors";
import { TerminalWindowsFooterProps } from "../data-types/interfaces";

const { Text } = Typography;
const { Footer } = Layout;

const TerminalWindowFooter = ({ ...props }: TerminalWindowsFooterProps) => {
  const getPercentage = () => {
    let percentage = 0;
    if (props?.macAddress) percentage += 20;

    if (props?.shiftId) percentage += 20;

    if (props?.terminalId) percentage += 20;

    if (props.batchReceiptId) percentage += 20;

    return percentage;
  };

  return (
    <Footer
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background: "#fff",
        padding: "3px 12px 3px 12px",
        borderTop: " 1px solid #e5e7eb",
        zIndex: 2,
      }}
    >
      <TitleBox
        title={
          <Space>
            <Text style={{ fontSize: "12px" }}>
              Mac Address : {props?.macAddress ?? ""}
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Shift : {props?.shift ?? ""}
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Terminal Code : {props?.terminalCode ?? ""}
            </Text>
            <Text style={{ fontSize: "12px" }}>
              Terminal : {props?.terminalName ?? ""}
            </Text>
          </Space>
        }
        extra={
          <Progress
            percent={getPercentage()}
            steps={5}
            showInfo={false}
            strokeColor={green[6]}
          />
        }
      />
    </Footer>
  );
};

export default TerminalWindowFooter;
