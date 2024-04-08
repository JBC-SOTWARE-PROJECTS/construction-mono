import React from "react";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Button, Col, Row, Table, Upload, message } from "antd";
import type { UploadProps } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Attachments, Query } from "@/graphql/gql/graphql";
import { s3UrlPrefix } from "@/shared/settings";
import { REMOVE_INVENTORY_ATTACHMENT } from "@/graphql/inventory/global-queries";
import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
} from "@apollo/client";
import { useConfirmationPasswordHook } from "@/hooks";
import _ from "lodash";

interface IProps {
  allowUpload: boolean;
  uploadProps: UploadProps;
  loading: boolean;
  uploading: boolean;
  attachments: Attachments[];
  fetchAttachments: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<Query>>;
}

export default function DocumentUpload(props: IProps) {
  const { message } = App.useApp();
  const {
    allowUpload,
    uploadProps,
    attachments,
    loading,
    uploading,
    fetchAttachments,
  } = props;
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  // ==================== queies ===================================
  const [removeRecord, { loading: removeLoading }] = useMutation(
    REMOVE_INVENTORY_ATTACHMENT,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.removeAttachment?.success) {
          message.success(data?.removeAttachment?.message);
          fetchAttachments();
        }
      },
    }
  );
  // ==================== functions =================================
  const onClickRemove = (id: string) => {
    showPasswordConfirmation(() => {
      removeRecord({
        variables: {
          id: id,
        },
      });
    });
  };
  // ==================== columns ===================================
  const columns: ColumnsType<Attachments> = [
    {
      title: "Attachment",
      dataIndex: "fileName",
      key: "fileName",
      render: (text, record) => {
        return (
          <Button
            type="link"
            size="small"
            disabled={false}
            onClick={() => window.open(`${s3UrlPrefix}${record?.imageUrl}`)}>
            {text}
          </Button>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 80,
      render: (id) => {
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => onClickRemove(id)}
            danger
            icon={<DeleteOutlined />}
          />
        );
      },
    },
  ];

  return (
    <Row gutter={[0, 8]}>
      <Col span={24}>
        <div className="w-full dev-right">
          <Upload {...uploadProps}>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              disabled={!allowUpload}>
              Click to Upload Documents
            </Button>
          </Upload>
        </div>
      </Col>
      <Col span={24}>
        <Table
          size="small"
          rowKey="id"
          loading={{
            spinning: uploading || loading || removeLoading,
            tip: uploading
              ? "The attachment is currently uploading; Please wait..."
              : "Fecthing all attachments ...",
          }}
          columns={columns}
          dataSource={attachments as Attachments[]}
          pagination={{
            pageSize: 3,
            showSizeChanger: false,
          }}
          scroll={{ x: 500 }}
        />
      </Col>
    </Row>
  );
}
