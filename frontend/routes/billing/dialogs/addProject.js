import React, { useState } from "react";
import { Col, Row, Button, Form, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import FormSelect from "../../../util/customForms/formSelect";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col2, col3 } from "../../../shared/constant";
import _ from "lodash";
import moment from "moment";
import CModal from "../../../app/components/common/CModal";

const { Dragger } = Upload;

const GET_RECORDS = gql`
  {
    customer: customerAll {
      value: id
      label: fullName
      type: customerType
    }
    office: activeOffices {
      value: id
      label: officeDescription
    }
    status: jobStatusActive {
      value: description
      label: description
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertProject(id: $id, fields: $fields) {
      id
    }
  }
`;

const AddPrjectForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  /* error = { errorTitle: "", errorMsg: ""}*/
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(props?.image);
  const { loading, data } = useQuery(GET_RECORDS, {
    variables: {
      id: props?.id,
    },
    fetchPolicy: "network-only",
  });

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

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.customer = { id: data?.customer };
    payload.location = { id: data?.location };
    if(!_.isEmpty(imageFile)){
      payload.image = imageFile
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
      title={"Project Information"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="projectForm"
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
        name="projectForm"
        id="projectForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col {...col3}>
            <FormInput
              description={"Project #"}
              name="projectCode"
              initialValue={props?.projectCode}
              placeholder="Auto Generated"
              disabled
            />
          </Col>
          <Col {...col3}>
            <FormInput
              description={"Project Start Date"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={moment(props?.projectStarted)}
              name="projectStarted"
              type="datepicker"
              placeholder="Project Start Date"
              disabled={props?.billed || props?.completed}
            />
          </Col>
          <Col {...col3}>
            <FormInput
              description={"Estimate Proj. End Date"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={moment(props?.projectEnded)}
              name="projectEnded"
              type="datepicker"
              placeholder="Estimate Project End Date"
            />
          </Col>
          <Col {...col2}>
            <FormInput
              description={"Project Description"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="description"
              initialValue={props?.description}
              placeholder="Project Description"
            />
          </Col>
          <Col {...col2}>
            <FormSelect
              loading={loading}
              description={"Customer"}
              initialValue={props?.customer?.id}
              name="customer"
              field="customer"
              placeholder="Select Customer"
              list={_.get(data, "customer")}
              disabled={props?.billed || props?.completed}
            />
          </Col>
          <Col {...col2}>
            <FormSelect
              loading={loading}
              description={"Project Location"}
              initialValue={props?.location?.id}
              name="location"
              field="location"
              placeholder="Select Office"
              list={_.get(data, "office")}
            />
          </Col>
          <Col {...col2}>
            <FormSelect
              description={"Project Status"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.status}
              name="status"
              field="status"
              placeholder="Select Status"
              list={_.get(data, "status")}
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

          <Col span={24}>
            <FormInput
              description={"Remarks/Notes"}
              type="textarea"
              name="remarks"
              initialValue={props?.remarks}
              placeholder="Remarks/Notes"
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default AddPrjectForm;
