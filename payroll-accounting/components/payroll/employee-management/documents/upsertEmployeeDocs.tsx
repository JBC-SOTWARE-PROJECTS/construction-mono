import {
  AssetStatus,
  AssetType,
  Assets,
  Employee,
  Item,
} from "@/graphql/gql/graphql";
import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  message,
  Upload,
  GetProp,
} from "antd";
import { LoadingOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput, FormSelect } from "@/components/common";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import {
  UPSERT_ASSET_RECORD,
  UPSERT_MAINTENANCE_TYPE_RECORD,
} from "@/graphql/assets/queries";

import { useMutation, useQuery } from "@apollo/client";
import { useDialog } from "@/hooks";
import _ from "lodash";
import { apiUrlPrefix } from "@/shared/settings";
import { RcFile } from "antd/es/upload";
import { UploadFile, UploadProps } from "antd/lib";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Employee | null | undefined;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function UpsertEmployeeDocsModal(props: IProps) {
  const { hide, record } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // const getBase64 = (img: FileType, callback: (url: string) => void) => {
  //   const reader = new FileReader();
  //   reader.addEventListener("load", () => callback(reader.result as string));
  //   reader.readAsDataURL(img);
  // };

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_MAINTENANCE_TYPE_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          hide(data);
        }
      },
    }
  );

  const onSubmit = (values: any) => {
    let payload = {
      ...values,
    };

    showPasswordConfirmation(() => {
      upsert({
        variables: {
          fields: payload,
          id: record?.id,
        },
      });
    });
  };

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const beforeUpload = (file: RcFile): Promise<File> => {
    return new Promise((resolve) => {
      // Split the file name to retain the original name and extension
      const fileNameParts = file.name.split(".");
      const extension = fileNameParts.pop(); // Get the original extension
      const newName = `DVT_EMPDOCS_${record?.id}_${Date.now()}.${extension}`; // Construct the new name with the original extension
      const renamedFile = new File([file], newName, { type: file.type });
      resolve(renamedFile);
    });
  };

  // const handleChange: UploadProps["onChange"] = (info) => {
  //   if (info.file.status === "uploading") {
  //     setLoading(true);
  //     return;
  //   }
  //   if (info.file.status === "done") {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj as FileType, (url) => {
  //       setLoading(false);
  //       setIsUpdating(false);
  //       setImageUrl(url);
  //     });
  //   }
  // };

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const uploadProps = {
    name: "file",
    action: `${apiUrlPrefix}/api/employee/employee-documents/upload`,
    withCredentials: true,
    crossDomain: true,
    headers: { "X-Requested-With": "XMLHttpRequest" },
    xsrfCookieName: "CSRF-TOKEN",
    xsrfHeaderName: "X-Csrf-Token",
    // onChange: handleUpload,
  };

  const fields = JSON.stringify({
    id: null,
    employee: record?.id,
  });

  // const uploadButton = (
  //   <button style={{ border: 0, background: "none", width: 240 }} type="button">
  //     {loading ? <LoadingOutlined /> : <PlusOutlined />}
  //     <div style={{ marginTop: 8 }}>Upload</div>
  //   </button>
  // );

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">Upload Document</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "800px" }}
      onCancel={() => hide(false)}
    >
      <Form
        name="upsertMaintenanceType"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...record,
        }}
      >
        {/* <Upload
                {...uploadProps}
                data={{ fields: fields }}
                listType="picture-card"
                className="avatar-uploader avatar-uploader-cust"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {uploadButton}
              </Upload> */}

        <Upload
          {...uploadProps}
          data={{ fields: fields }}
          listType="picture-card"
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          onPreview={handlePreview}
          onRemove={()=>{message.error("You need to manually remove the image on the uploaded document itself")}}
        >
          {uploadButton}
        </Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Form>
    </Modal>
  );
}
