import React, { useContext, useState } from "react";
import { ProjectProgressImages, Query } from "@/graphql/gql/graphql";
import { DeleteFilled, UploadOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Button,
  App,
  Upload,
  Image,
  Spin,
  Empty,
  Switch,
} from "antd";
import _ from "lodash";
import { confirmDelete } from "@/hooks";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_PROGRESS_IMAGES,
  REMOVE_PROGRESS_IMAGE,
} from "@/graphql/inventory/project-queries";
import type { UploadProps } from "antd";
import { apiUrlPrefix, s3UrlPrefix } from "@/shared/settings";
import { accessControl } from "@/utility/helper";
import { AccountContext } from "@/components/accessControl/AccountContext";
import index from "../../../../pages/index";

interface IProps {
  projectProgressId: string;
  isLocked?: boolean;
}

export default function ProjectProgressImagesLists({
  projectProgressId,
  isLocked,
}: IProps) {
  // ===================== menus ========================
  const { message } = App.useApp();
  const [uploading, setUploading] = useState<boolean>(false);
  const account = useContext(AccountContext);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  // ===================== queries ========================
  const { data, loading, refetch } = useQuery<Query>(GET_PROGRESS_IMAGES, {
    variables: {
      id: projectProgressId ?? null,
    },
    fetchPolicy: "cache-and-network",
  });
  const [removeRecord, { loading: removeLoading }] = useMutation(
    REMOVE_PROGRESS_IMAGE,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data?.removeProjectProgressImage?.success) {
          message.success(data?.removeProjectProgressImage?.message);
          refetch();
        } else {
          message.error(data?.removeProjectProgressImage?.message);
        }
      },
    }
  );

  const onConfirmRemove = (record: ProjectProgressImages) => {
    confirmDelete(
      "Click Yes if you want to proceed",
      () => {
        removeRecord({
          variables: {
            id: record?.id,
          },
        });
      },
      "Do you want to delete this image?"
    );
  };

  const uploadProps: UploadProps = {
    name: "file",
    method: "POST",
    multiple: true,
    action: `${apiUrlPrefix}/project/upload/`,
    data: {
      id: projectProgressId,
    },
    accept: "image/*",
    onChange(info) {
      if (info.file.status === "uploading") {
        setUploading(true);
      }
      if (info.file.status === "done") {
        message.success(`Images uploaded successfully`);
        setUploading(false);
        refetch();
      } else if (info.file.status === "error") {
        message.error(`Images upload failed.`);
        setUploading(false);
        refetch();
      }
    },
    showUploadList: false,
  };

  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <div className="w-full upload-justify-between">
          <div className="upload-switch-action">
            Delete Images:{" "}
            <Switch
              checked={showDelete}
              onChange={(e) => setShowDelete(e)}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
          </div>
          <Upload {...uploadProps} className="project-upload">
            <Button
              type="primary"
              loading={uploading}
              disabled={
                isLocked
                  ? accessControl(
                      account?.user?.access,
                      "overwrite_lock_progress"
                    )
                  : false
              }
              icon={<UploadOutlined />}>
              {uploading ? "Uploading Images ... Please wait" : "Upload Images"}
            </Button>
          </Upload>
        </div>
      </Col>
      <Col span={24}>
        <Spin spinning={loading || removeLoading}>
          {_.isEmpty(data?.pProgressImagesByList) ? (
            <Empty description="No Images Available" />
          ) : (
            <Image.PreviewGroup
              preview={{
                onChange: (current, prev) =>
                  console.log(`current index: ${current}, prev index: ${prev}`),
              }}>
              <div className="project-images">
                {(data?.pProgressImagesByList as ProjectProgressImages[]).map(
                  (image: ProjectProgressImages) => (
                    <div
                    key={image.id}
                      style={{ height: 200, width: 200, position: "relative" }}>
                      {showDelete && (
                        <div
                          style={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            zIndex: 999,
                          }}>
                          <Button
                            type="primary"
                            danger
                            size="small"
                            disabled={removeLoading}
                            onClick={() => onConfirmRemove(image)}
                            icon={<DeleteFilled />}
                          />
                        </div>
                      )}
                      <Image
                        key={image?.id}
                        style={{ objectPosition: "center", objectFit: "cover" }}
                        width={200}
                        height={200}
                        src={`${s3UrlPrefix}${image?.imageUrl}`}
                      />
                    </div>
                  )
                )}
              </div>
            </Image.PreviewGroup>
          )}
        </Spin>
      </Col>
    </Row>
  );
}
