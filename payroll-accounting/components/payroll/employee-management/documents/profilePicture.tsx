import { Employee } from "@/graphql/gql/graphql";
import { EditOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Upload, message } from "antd";
import React, { useState } from "react";
import type { UploadProps } from "antd";
import { GetProp } from "antd/lib";
import { apiUrlPrefix } from "@/shared/settings";
import { RcFile } from "antd/es/upload";
import DOImageViewer from "@/components/thirdParty/doImageViewer";
const { Meta } = Card;

type Props = {
  record: Employee;
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

function ProfilePicture({ record }: Props) {
  console.log("record", record);
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  // const beforeUpload = (file: FileType) => {
  //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  //   if (!isJpgOrPng) {
  //     message.error('You can only upload JPG/PNG file!');
  //   }
  //   const isLt2M = file.size / 1024 / 1024 < 2;
  //   if (!isLt2M) {
  //     message.error('Image must smaller than 2MB!');
  //   }
  //   return isJpgOrPng && isLt2M;
  // };

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setIsUpdating(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none", width: 240 }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const onClickUpdate = () => {
    setIsUpdating(!isUpdating);
  };

  const uploadProps = {
    name: "file",
    action: `${apiUrlPrefix}/api/employee/employee-profile-picture/upload`, // Replace this with your API endpoint
    withCredentials: true,
    crossDomain: true,
    headers: { "X-Requested-With": "XMLHttpRequest" },
    xsrfCookieName: "CSRF-TOKEN",
    xsrfHeaderName: "X-Csrf-Token",
    // onChange: handleUpload,
  };

  const fields = JSON.stringify({
    id: record?.id,
  });

  const beforeUpload = (file: RcFile): Promise<File> => {
    return new Promise((resolve) => {
      // Split the file name to retain the original name and extension
      const fileNameParts = file.name.split(".");
      const extension = fileNameParts.pop(); // Get the original extension
      const newName = `DVT_EMPPP_${record?.id}_${Date.now()}.${extension}`; // Construct the new name with the original extension
      const renamedFile = new File([file], newName, { type: file.type });
      resolve(renamedFile);
    });
  };

  return (
    <div>
      <Card
        hoverable
        style={{ width: 240, marginBottom: 20 }}
        cover={
          <>
            {isUpdating ? (
              <Upload
                {...uploadProps}
                data={{ fields: fields }}
                listType="picture-card"
                className="avatar-uploader avatar-uploader-cust"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {uploadButton}
              </Upload>
            ) : (
              <>
                {record?.profilePicture ? (
                  <DOImageViewer
                    filename={record?.profilePicture ?? ""}
                    folder="EMPLOYEE_PROFILE_PICS"
                    height={200}
                    width={"100%"}
                  />
                ) : (
                  <img
                    alt="example"
                    height={200}
                    style={{ objectFit: "cover" }}
                    src={
                      imageUrl ??
                      "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=1380&t=st=1707239619~exp=1707240219~hmac=a39f2138ffae5270dd2812f14625ba8cd87ba5782043aba7c2ddc05afb7ec94d"
                    }
                  />
                )}
              </>
            )}
          </>
        }
        actions={[<EditOutlined key="edit" onClick={onClickUpdate} />]}
      >
        <Meta
          title={record?.fullName}
          description={record?.position?.description}
        />
      </Card>
    </div>
  );
}

export default ProfilePicture;
