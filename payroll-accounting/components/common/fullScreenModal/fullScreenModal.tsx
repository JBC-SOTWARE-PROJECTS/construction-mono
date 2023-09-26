import React, { ReactNode } from "react";
import { Modal, Typography, Space, ModalProps, Tag } from "antd";
import _ from "lodash";

interface ExtendedModalProps extends ModalProps {
  allowFullScreen?: boolean;
  extraTitle?: string | ReactNode;
  hide: (e: boolean) => void;
  icon?: ReactNode;
  children?: ReactNode;
}

const FullScreenModal = ({
  allowFullScreen,
  extraTitle,
  hide,
  icon,
  title,
  children,
  ...props
}: ExtendedModalProps) => {
  let bodyStyle = props.bodyStyle;
  let style = props.style;
  let width = props.width;

  if (allowFullScreen) {
    bodyStyle = {
      minHeight: "calc(100vh - 130px)",
      width: "100%",
      overflowY: "auto",
      overflowX: "hidden",
    };
    style = { top: 0, height: "100vh", width: "100%" };
    width = "100%";
  }

  return (
    <Modal
      className={allowFullScreen ? "fullscreen-modal" : ""}
      title={
        <Typography.Title level={4}>
          <Space align="center">
            {icon} {title}
            {extraTitle && <Tag color="magenta">{extraTitle}</Tag>}
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      bodyStyle={bodyStyle}
      width={width}
      style={style}
      onCancel={() => hide(false)}
      {...props}>
      {children}
    </Modal>
  );
};

export default FullScreenModal;
