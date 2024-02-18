import {
  Employee
} from "@/graphql/gql/graphql";
import React, { useState } from "react";
import {
  Form,
  Modal,
  Space,
  Typography,
  message,
  Upload,
  GetProp,
} from "antd";
import {  PlusOutlined } from "@ant-design/icons";
import _ from "lodash";
import { apiUrlPrefix } from "@/shared/settings";
import { RcFile } from "antd/es/upload";
import { UploadFile, UploadProps } from "antd/lib";

interface IProps {
  hide: (hideProps: any) => void;
  submitted: (sub: any) => void;
  record?: Employee | null | undefined;
  refetch: () => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function UpsertEmployeeDocsModal(props: IProps) {
  const { hide, record, refetch } = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

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


  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>{
    
    setFileList(newFileList);
    refetch()
  }
    

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
        onFinish={()=>{}}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...record,
        }}
      >
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
