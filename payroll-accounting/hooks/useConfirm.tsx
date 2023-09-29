import React from "react";
import { App } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

interface OwnProps {
  title?: string;
  subTitle?: string;
  loading?: boolean;
  onCallBack: () => void;
}

const UseConfirm = (props: OwnProps) => {
  const { modal } = App.useApp();
  const { title, subTitle, loading, onCallBack } = props;

  const showConfirm = () => {
    return modal.confirm({
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

  return showConfirm();
};

export default UseConfirm;
