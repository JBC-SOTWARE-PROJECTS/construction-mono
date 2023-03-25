import React, { useState } from "react";
import { Col, Row, Button, message } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import FormSelect from "../../../util/customForms/formSelect";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import moment from "moment";

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertPettyCash(id: $id, fields: $fields) {
      id
    }
  }
`;

const TYPE = gql`
  {
    type: pettyTypeActive {
      value: id
      label: description
    }
    employee: searchEmployees(filter: "") {
      value: id
      label: fullName
    }
  }
`;

const GET_CONSTANT = gql`
  {
    projects: projectList {
      value: id
      label: description
    }
  }
`;


const PettyCashForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  const [projects, setProjects] = useState([])
  const { loading, data } = useQuery(TYPE, {
    fetchPolicy: "network-only",
  });
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }

  const { loading: projectLoading } = useQuery(
    GET_CONSTANT,
    {
      variables: {
        id: location,
      },
      onCompleted: (data) => {
        if (!_.isEmpty(data?.projects)) {
          setProjects(data?.projects);
        }else{
            setProjects([]);
        }
      },
    }
  );

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props?.id) {
            hide(`${props?.title} Updated`);
          } else {
            hide(`${props?.title} Added`);
          }
        }
      },
    }
  );

  //======================= =================== =================================================//

  const onSubmit = (data) => {
    let payload = _.clone(data);
    payload.receivedBy = { id: data.receivedBy };
    payload.cashType = props?.cashType;
    payload.shift = { id: props.shift };
    if (data?.amount > 0) {
      upsertRecord({
        variables: {
          id: props?.id,
          fields: payload,
        },
      });
    } else {
      setFormError({
        errorTitle: "Invalid Amount",
        errorMsg: "Amount must be greater than zero",
      });
    }
  };

  return (
    <CModal
      width={"30%"}
      title={props?.title}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="pettyCashForm"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={upsertLoading}
        >
          Submit
        </Button>,
      ]}
    >
      <MyForm
        name="pettyCashForm"
        id="pettyCashForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col span={24}>
            <FormInput
              description={"Transaction No"}
              name="code"
              initialValue={props?.code}
              placeholder="AUTO GENERATE"
              disabled
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Transaction Date"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={
                props?.id ? moment(props?.dateTrans) : moment(new Date())
              }
              name="dateTrans"
              type="datepicker"
              disabled={props?.isPosted || props?.isVoid}
              placeholder="Transaction Date"
            />
          </Col>
          {props?.cashType === "CASH_OUT" && (
            <Col span={24}>
              <FormSelect
                description={"Type"}
                loading={loading}
                rules={[{ required: true, message: "This Field is required" }]}
                initialValue={props?.pettyType?.id}
                name="pettyType"
                field="pettyType"
                placeholder="Type"
                list={_.get(data, "type")}
                disabled={props?.isPosted || props?.isVoid}
              />
            </Col>
          )}
          <Col span={24}>
            <FormInput
              description={"Description"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="remarks"
              initialValue={props?.remarks}
              placeholder="Description"
              disabled={props?.isPosted || props?.isVoid}
            />
          </Col>
          {props?.cashType === "CASH_OUT" && (
            <Col span={24}>
              <FormSelect
                description={"Project"}
                loading={projectLoading}
                initialValue={props?.project?.id}
                name="project"
                field="project"
                placeholder="Select Project"
                list={projects}
                disabled={props?.isPosted || props?.isVoid}
              />
            </Col>
          )}
          <Col span={24}>
            <FormSelect
              description={"Received By"}
              loading={loading}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.receivedBy?.id}
              name="receivedBy"
              field="receivedBy"
              placeholder="Received By"
              list={_.get(data, "employee")}
              disabled={props?.isPosted || props?.isVoid}
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Amount"}
              rules={[{ required: true, message: "This Field is required" }]}
              type="number"
              name="amount"
              formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              initialValue={props?.amount}
              placeholder="Amount"
              disabled={props?.isPosted || props?.isVoid}
            />
          </Col>

          <Col span={24}>
            <FormInput
              description={"Remarks/Notes"}
              type="textarea"
              name="notes"
              initialValue={props?.notes}
              placeholder="Remarks/Notes"
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default PettyCashForm;
