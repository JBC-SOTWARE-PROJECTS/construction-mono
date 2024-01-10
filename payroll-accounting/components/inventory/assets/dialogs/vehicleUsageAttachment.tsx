import {
  Assets,
  VehicleUsageDocs,
  VehicleUsageMonitoring,
} from "@/graphql/gql/graphql";
import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  message,
  Upload,
  Divider,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import useGetAssetById from "@/hooks/asset/useGetAssetById";
import _, { set } from "lodash";
import { UploadOutlined } from "@ant-design/icons";
import DOImageViewer from "@/components/thirdParty/doImageViewer";
import { apiUrlPrefix } from "@/shared/settings";
import useSessionCookie from "@/hooks/useSessionCookie";
import { RcFile } from "antd/es/upload";
import useGetVehicleUsageDocs from "@/hooks/asset/useGetVehicleUsageDocs";


interface IProps {
  hide: (hideProps: any) => void;
  record?: VehicleUsageMonitoring | null | undefined;
  projectOpts: any;
}

export interface IPMState {
  filter: string;
  page: number;
  size: number;
}

const initialState: IPMState = {
  filter: "",
  page: 0,
  size: 10,
};

export default function VehicleUsageAttachemntModal(props: IProps) {
  const { hide, record, projectOpts } = props;
  const [state, setState] = useState(initialState);

  const [data, loading, refetch] = useGetVehicleUsageDocs({
    variables: {
      ...state,
      vehicleUsageId: record?.id,
    },
    fetchPolicy: "network-only",
  });

  console.log("vh-data", data?.content);

  const handleUpload = (info: any) => {
    const { status } = info.file;
    // console.log("info", info)
    if (status !== "uploading") {
      // console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const beforeUpload = (file: RcFile): Promise<File> => {
    return new Promise((resolve) => {
      // Split the file name to retain the original name and extension
      const fileNameParts = file.name.split(".");
      const extension = fileNameParts.pop(); // Get the original extension
      const newName = `DVT_VUDOC_${record?.id}_${Date.now()}.${extension}`; // Construct the new name with the original extension
      const renamedFile = new File([file], newName, { type: file.type });
      resolve(renamedFile);
    });
  };

  const uploadProps = {
    name: "file",
    action: `${apiUrlPrefix}/api/asset/vehicle-usage-docs/upload`, // Replace this with your API endpoint
    withCredentials: true,
    crossDomain: true,
    headers: { "X-Requested-With": "XMLHttpRequest" },
    xsrfCookieName: "CSRF-TOKEN",
    xsrfHeaderName: "X-Csrf-Token",

    onChange: handleUpload,
  };

  const fields = JSON.stringify({
    vehicleUsage: record?.id,
    item: record?.item?.id,
  });
  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`Vehicle Usage Attachments`}</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "800px" }}
      onCancel={() => hide(false)}
      footer={
        ""
      }
    >
      <>
        <Upload
          {...uploadProps}
          data={{ fields: fields }}
          beforeUpload={beforeUpload}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        <Divider />
        <div>
          <Row>
            {data?.content.length > 0 && (
              <>
                {data?.content.map((r: VehicleUsageDocs, index : number) => (
                  <Col span={12}   key={index}>
                      <DOImageViewer
                        key={index}
                        filename={r.file ?? ""}
                        folder="VEHICLE_USAGE_DOCS"
                        width={300}
                        height={300}
                      />
                  </Col>
                ))}
              </>
            )}
          </Row>
        </div>
      </>
    </Modal>
  );
}
