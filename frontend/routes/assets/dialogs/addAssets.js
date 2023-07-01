import React, { useState } from "react";
import { Col, Row, Button, Form, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import FormSelect from "../../../util/customForms/formSelect";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { ASSET_STATUS, col2, col3 } from "../../../shared/constant";
import _ from "lodash";
import CModal from "../../../app/components/common/CModal";

const { Dragger } = Upload;

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertAsset(id: $id, fields: $fields) {
      id
    }
  }
`;


const AddAssetForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  /* error = { errorTitle: "", errorMsg: ""}*/
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(props?.image);

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props?.id) {
            hide("Project Information Updated");
          } else {
            hide("Project Information Added");
          }
        }
      },
    }
  );

  const getBase64 = (file) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setImageFile(reader.result);
    };
    reader.onerror = function (error) {
      console.error("Error: ", error);
    };
  };

  //upload props
  const uploadProps = {
    name: "file",
    multiple: false,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        getBase64(info.file.originFileObj);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  //======================= =================== =================================================//

  const onSubmit = (values) => {
    let payload = _.clone(values);

    if (!_.isEmpty(imageFile)) {
      payload.image = imageFile;
    }

    upsertRecord({
      variables: {
        id: props?.id,
        fields: payload,
      },
    });
  };

  return (
    <CModal
      width="60%"
      title={"Asset Information"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="assetForm"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={upsertLoading}
          disabled={props?.completed}
        >
          Submit
        </Button>,
      ]}
    >
      <MyForm
        form={form}
        name="assetForm"
        id="assetForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col {...col3}>
            <FormInput
              description={"Asset #"}
              name="assetCode"
              initialValue={props?.assetCode}
              placeholder="Auto Generated"
              disabled
            />
          </Col>
          <Col {...col3}>
            <FormInput
              description={"Equipment Brand"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="brand"
              initialValue={props?.brand}
              placeholder="Equipment Brand"
            />
          </Col>
          <Col {...col3}>
            <FormInput
              description={"Equipment Model"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="model"
              initialValue={props?.model}
              placeholder="Equipment Model"
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Project Description"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="description"
              initialValue={props?.description}
              placeholder="Project Description"
            />
          </Col>
          <Col {...col2}>
            <FormInput
              description={"Equipment Plate No"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="plateNo"
              initialValue={props?.plateNo}
              placeholder="Equipment Plate No"
            />
          </Col>

          <Col {...col2}>
            <FormSelect
              description={"Asset Status"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.status}
              name="status"
              field="status"
              placeholder="Select Status"
              list={ASSET_STATUS}
            />
          </Col>

          <Col span={24}>
            <Form.Item style={{ marginBottom: 5 }}>
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">Upload max file 5mb.</p>
              </Dragger>
            </Form.Item>
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default AddAssetForm;
