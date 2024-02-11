import {
  VehicleUsageDocs,
  VehicleUsageMonitoring,
} from "@/graphql/gql/graphql";
import React, { useState } from "react";
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
import _ from "lodash";
import { UploadOutlined } from "@ant-design/icons";
import DOImageViewer from "@/components/thirdParty/doImageViewer";
import { apiUrlPrefix } from "@/shared/settings";
import { RcFile } from "antd/es/upload";
import useGetVehicleUsageDocs from "@/hooks/asset/useGetVehicleUsageDocs";
import { FormInput, FormSelect } from "@/components/common";
import { requiredField } from "@/utility/helper";
import { VUDesignationList } from "../masterfile/vehicleUsageEmployee";

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

const initialFormState : any={
  designation : null,
  description: null
}

export default function VehicleUsageAttachemntModal(props: IProps) {
  const { hide, record, projectOpts } = props;
  const [state, setState] = useState(initialState);
  const [formState, setFormState] = useState(initialFormState);
  const [hasRequired, sethasRequired] = useState(true);
  const [form] = Form.useForm();

  const [data, loading, refetch] = useGetVehicleUsageDocs({
    variables: {
      ...state,
      vehicleUsageId: record?.id,
    },
    fetchPolicy: "network-only",
  });

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

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
  
    if( _.some(allValues, value => _.isUndefined(value) || value === '')){
      sethasRequired(true)
    }else{
      sethasRequired(false)
    }
    setFormState({...allValues});
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
    ...formState
  });

  console.log("fields", fields)

  var designationOpts = VUDesignationList.map((item: string) => {
    return {
      value: item,
      label: item,
    };
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
      style={{ maxWidth: "900px" }}
      onCancel={() => hide(false)}
      footer={""}
    >
      <>
        <Form
          form={form}
          name="upsertAttch"
          layout="vertical"
          onFinish={() => {}}
          onFinishFailed={() => {}}
          onValuesChange={handleFormValuesChange}
        >
          <Row gutter={[8, 0]} align="bottom">
            <Col span={6}>
              <FormSelect
                label="Designation"
                rules={requiredField}
                name="designation"
                propsselect={{
                  showSearch: true,
                  options: designationOpts,
                  placeholder: "Select type",
                  allowClear: true,
                  onChange: (newValue) => {
                    //setState((prev) => ({ ...prev, type: newValue }));
                  },
                }}
              />
            </Col>

            <Col span={6}>
              <FormInput
                name="description"
                label="Description"
                rules={requiredField}
                propsinput={{
                  placeholder: "Type purpose here",
                }}
              />
            </Col>
            <Col span={12} style={{ paddingBottom: "6px" }}>
              <Upload
                {...uploadProps}
                data={{ fields: fields }}
                beforeUpload={beforeUpload}
               disabled={hasRequired}
              >
                <Button  disabled={hasRequired}  icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Col>
          </Row>
        </Form>
        <Divider />
        <div>
          <Row>
            {data?.content.length > 0 && (
              <>
                {data?.content.map((r: VehicleUsageDocs, index: number) => (
                  <Col span={12} key={index}>
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
