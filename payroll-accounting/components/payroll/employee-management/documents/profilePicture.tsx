import { Employee } from "@/graphql/gql/graphql";
import { EditOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Upload } from "antd";
import React, { useState } from "react";
import type { UploadProps } from 'antd';
const { Meta } = Card;

type Props = {
  record: Employee;
};
// type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


function ProfilePicture({ record }: Props) {
  const [imageUrl, setImageUrl] = useState<string>();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

//   const getBase64 = (img: FileType, callback: (url: string) => void) => {
//     const reader = new FileReader();
//     reader.addEventListener('load', () => callback(reader.result as string));
//     reader.readAsDataURL(img);
//   };
  
//   const beforeUpload = (file: FileType) => {
//     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//     if (!isJpgOrPng) {
//       message.error('You can only upload JPG/PNG file!');
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//       message.error('Image must smaller than 2MB!');
//     }
//     return isJpgOrPng && isLt2M;
//   };

  const uploadButton = (
    <button style={{ border: 0, background: "none", width: 240 }} type="button">
      {false ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const onClickUpdate = ()=>{
    setIsUpdating(!isUpdating);
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
                name="avatar"
                listType="picture-card"
                className="avatar-uploader avatar-uploader-cust"
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={() => {}}
                onChange={() => {}}
              >
                {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
              </Upload>
            ) : (
              <img
                alt="example"
                height={200}
                style={{ objectFit: "cover" }}
                src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=1380&t=st=1707239619~exp=1707240219~hmac=a39f2138ffae5270dd2812f14625ba8cd87ba5782043aba7c2ddc05afb7ec94d"
              />
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
