import React from "react";
import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

interface OwnProps {
  title?: string;
  subTitle?: string;
  loading?: boolean;
  onCallBack: () => void;
}

const { confirm } = Modal;

const UseConfirm = (props: OwnProps) => {
  const { title, subTitle, loading, onCallBack } = props;
  confirm({
    title: title,
    icon: <ExclamationCircleFilled />,
    content: subTitle,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    okButtonProps: {
      loading: loading,
    },
    onOk() {
      onCallBack();
    },
  });
};

export default UseConfirm;
