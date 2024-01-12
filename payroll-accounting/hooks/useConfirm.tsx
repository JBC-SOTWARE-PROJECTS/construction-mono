import React from "react";
import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

const confirmDelete = (message: string, onComfirm: () => void, title?: string) => {
  confirm({
    title: title ?? "Are you sure delete this record?",
    icon: <ExclamationCircleFilled />,
    content: message,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk() {
      onComfirm();
    },
  });
};

export default confirmDelete;
