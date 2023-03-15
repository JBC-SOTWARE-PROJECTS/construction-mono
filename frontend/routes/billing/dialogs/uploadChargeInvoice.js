import React, { useState, useContext } from "react";
import { AccountContext } from "../../../app/components/accessControl/AccountContext";
import { Col, Row, Button, message } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { getUrlPrefix } from "../../../shared/global";
import { InboxOutlined } from "@ant-design/icons";
import _ from "lodash";
import CModal from "../../../app/components/common/CModal";

const UploadChargeInvoice = ({ visible, hide, ...props }) => {
  const uploadProps = {
    disabled: false,
    name: "file",
    multiple: true,
    withCredentials: true,
    showUploadList: false,
    data: {
      billingId: props.id,
    },
    action: `${getUrlPrefix()}/api/upload-file`,
    onChange: (info) => {
      const { status } = info.file;

      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        console.log(info.file);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop: (e) => {
      console.log(e);
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <CModal
      width="30%"
      title={"Upload Charge Invoice"}
      visible={visible}
      footer={
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>
      }
    >
      <Row>
        <Col span={24}>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload
            </p>
          </Dragger>
        </Col>
      </Row>
    </CModal>
  );
};

export default UploadChargeInvoice;
