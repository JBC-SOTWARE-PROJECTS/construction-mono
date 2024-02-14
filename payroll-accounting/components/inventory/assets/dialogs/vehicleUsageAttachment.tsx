import {
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
  Card,
} from "antd";
import _ from "lodash";
import { EditOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import DOImageViewer from "@/components/thirdParty/doImageViewer";
import { apiUrlPrefix } from "@/shared/settings";
import { RcFile } from "antd/es/upload";
import useGetVehicleUsageDocs from "@/hooks/asset/useGetVehicleUsageDocs";
import { FormInput, FormSelect } from "@/components/common";
import { requiredField } from "@/utility/helper";
import { VUDesignationList } from "../masterfile/vehicleUsageEmployee";
import Meta from "antd/es/card/Meta";
import { UPSERT_VEHICLE_USAGE_DOCS_RECORD } from "@/graphql/assets/queries";
import { useMutation } from "@apollo/client";

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

const initialFormState: any = {
  designation: null,
  description: null,
};

export default function VehicleUsageAttachemntModal(props: IProps) {
  const { hide, record, projectOpts } = props;
  const [state, setState] = useState(initialState);
  const [formState, setFormState] = useState(initialFormState);
  const [segregatedAttch, setSegregatedAttch] = useState<any>({});
  const [hasRequired, sethasRequired] = useState(true);
  const [toUpdate, setToUpdate] = useState<string | null>(null);
  const [form] = Form.useForm();

  const [data, loading, refetch] = useGetVehicleUsageDocs({
    variables: {
      ...state,
      vehicleUsageId: record?.id,
    },
    fetchPolicy: "network-only",
  });

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_VEHICLE_USAGE_DOCS_RECORD,
    {
      ignoreResults: false,
      onCompleted: (dataResp : VehicleUsageDocs) => {
        if (dataResp) {
         
          message.success("File updated successfully");
          const newDocs = _.map(data?.content, (e)=>{
            return {
              ...e,
              description: dataResp?.description
            }
          })
          const segregatedObjects = segregateObjectsByDesignation(newDocs);
          setSegregatedAttch(segregatedObjects);

          setToUpdate(null);
          // refetch();
          // hide(data);
        }
      },
    }
  );

  useEffect(() => {
    if (data?.content) {
      const segregatedObjects = segregateObjectsByDesignation(data?.content);
      setSegregatedAttch(segregatedObjects);
    }
  }, [data]);

  const handleUpload = (info: any) => {
    const { status } = info.file;
    
    if (status !== "uploading") {
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
      refetch();
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
    if (_.some(allValues, (value) => _.isUndefined(value) || value === "")) {
      sethasRequired(true);
    } else {
      sethasRequired(false);
    }
    setFormState({ ...allValues });
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
    ...formState,
  });

  var designationOpts = VUDesignationList.map((item: string) => {
    return {
      value: item,
      label: item,
    };
  });

  const saveUpdate =({description}: VehicleUsageDocs)=>{
    console.log("hello", description)
    upsert({
      variables: {
        fields: {
          description: description
        },
        id: toUpdate,
      },
    });
  }

  function segregateObjectsByDesignation(
    objects: VehicleUsageDocs[]
  ): _.Dictionary<VehicleUsageDocs[]> {
    // Extract unique designations
    const uniqueDesignations = _.uniq(objects.map((obj) => obj.designation));

    // Create an object to hold segregated objects
    const segregatedObjects: _.Dictionary<VehicleUsageDocs[]> = {};

    // Initialize segregatedObjects with empty arrays for each unique designation
    uniqueDesignations.forEach((designation) => {
      segregatedObjects[designation ?? "OTHERS"] = [];
    });

    // Populate segregatedObjects with objects grouped by designation
    objects.forEach((obj) => {
      segregatedObjects[obj.designation ?? "OTHERS"].push(obj);
    });

    return segregatedObjects;
  }

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
                <Button disabled={hasRequired} icon={<UploadOutlined />}>
                  Click to Upload
                </Button>
              </Upload>
            </Col>
          </Row>
        </Form>
        <Divider />
        <div>
          {Object.keys(segregatedAttch).map((designation) => (
            <div key={designation}>
              <Divider orientation="left">{designation}</Divider>

              <Row gutter={16}>
                {segregatedAttch[designation].length > 0 && (
                  <>
                    {segregatedAttch[designation].map(
                      (r: VehicleUsageDocs, index: number) => (
                        <Col className="gutter-row" span={6} key={index}>
                          <Card
                            hoverable
                            style={{ marginBottom: 20 }}
                            cover={
                              <>
                                <DOImageViewer
                                  key={index}
                                  filename={r.file ?? ""}
                                  folder="VEHICLE_USAGE_DOCS"
                                  width={"100%"}
                                  height={250}
                                  style={{
                                    objectFit: "cover",
                                  }}
                                />
                              </>
                            }
                            actions={[
                              <EditOutlined
                                key="edit"
                                onClick={() => {
                                  toUpdate
                                    ? setToUpdate(null)
                                    : setToUpdate(r.id);
                                }}
                              />,
                            ]}
                          >
                            {toUpdate && toUpdate == r.id ? (
                              <Form
                                name="updateAtt"
                                layout="vertical"
                                onFinish={saveUpdate}
                                onFinishFailed={() => {}}
                                onValuesChange={() => {}}
                              >
                                <FormInput
                                  name="description"
                                  label="Description"
                                  rules={requiredField}
                                  propsinput={{
                                    placeholder: "Type purpose here",
                                    defaultValue: r?.description ?? ""
                                  }}
                                />
                                <Button
                                  type="primary"
                                  size="small"
                                  htmlType="submit"
                                  form="updateAtt"
                                  // loading={upsertLoading}
                                  icon={<SaveOutlined />}
                                >
                                  Save
                                </Button>
                              </Form>
                            ) : (
                              <Meta title={""} description={r.description} />
                            )}
                          </Card>
                        </Col>
                      )
                    )}
                  </>
                )}
              </Row>
            </div>
          ))}
        </div>
      </>
    </Modal>
  );
}
