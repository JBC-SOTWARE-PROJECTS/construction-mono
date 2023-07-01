import React, { useState } from "react";
import { Col, Row, Button, Form } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import FormSelect from "../../../util/customForms/formSelect";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col3 } from "../../../shared/constant";
import _ from "lodash";
import moment from "moment";
import CModal from "../../../app/components/common/CModal";

const GET_RECORDS = gql`
  {
    customer: customerAssets {
      value: id
      label: fullName
      type: customerType
    }
    projects: projectList {
      value: id
      label: description
    }
    assets: findAllAssets {
      value: id
      label: description
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertJobOrder(id: $id, fields: $fields) {
      id
    }
  }
`;

const AddJobOrderForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }
  const [form] = Form.useForm();

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
            hide("Job Order Information Updated");
          } else {
            hide("Job Order Information Added");
          }
        }
      },
    }
  );

  //======================= =================== =================================================//

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.customer = { id: data?.customer };
    payload.assets = { id: data?.assets };
    payload.project = { id: data?.project };

    if (_.isEmpty(props?.id)) {
      payload.status = "ONGOING";
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
      title={"Job Order Information"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="jobForm"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={upsertLoading}
          disabled={props?.status === "COMPLETED"}
        >
          Submit
        </Button>,
      ]}
    >
      <MyForm
        form={form}
        name="jobForm"
        id="jobForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col {...col3}>
            <FormInput
              description={"Transaction Date"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={moment(props?.dateTrans)}
              name="dateTrans"
              type="datepicker"
              placeholder="Transaction Date"
              disabled={props?.status === "COMPLETED"}
            />
          </Col>
          <Col {...col3}>
            <FormInput
              description={"Work Duration Start"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={moment(props?.durationStart)}
              name="durationStart"
              type="datepicker"
              placeholder="Work Duration Start"
              disabled={props?.status === "COMPLETED"}
            />
          </Col>
          <Col {...col3}>
            <FormInput
              description={"Work Duration End"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={moment(props?.durationEnd)}
              name="durationEnd"
              type="datepicker"
              placeholder="Work Duration End"
              disabled={props?.status === "COMPLETED"}
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Job Description"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="description"
              initialValue={props?.description}
              placeholder="Job Description"
              disabled={props?.status === "COMPLETED"}
            />
          </Col>

          <Col {...col3}>
            <FormSelect
              loading={loading}
              description={"Customer"}
              initialValue={props?.customer?.id}
              name="customer"
              field="customer"
              placeholder="Select Customer"
              list={_.get(data, "customer")}
              disabled={props?.status === "COMPLETED"}
            />
          </Col>
          <Col {...col3}>
            <FormSelect
              loading={loading}
              description={"Asset"}
              initialValue={props?.assets?.id}
              name="assets"
              field="assets"
              placeholder="Select Asset (Heavy Equipment)"
              list={_.get(data, "assets")}
            />
          </Col>

          <Col {...col3}>
            <FormSelect
              loading={loading}
              description={"Project"}
              initialValue={props?.project?.id}
              name="project"
              field="project"
              placeholder="Select Projects"
              list={_.get(data, "projects")}
            />
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

export default AddJobOrderForm;
