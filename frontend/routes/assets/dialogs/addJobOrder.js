import React, { useState, useContext } from "react";
import { AccountContext } from "../../../app/components/accessControl/AccountContext";
import { Col, Row, Button, Form } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import FormSelect from "../../../util/customForms/formSelect";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col2, col3, col4 } from "../../../shared/constant";
import _ from "lodash";
import moment from "moment";
import CModal from "../../../app/components/common/CModal";

const GET_RECORDS = gql`
  {
    customer: customerAll {
      value: id
      label: fullName
      type: customerType
    }
    repairType: repairTypeActive {
      value: id
      label: description
    }
    insurances: insuranceActive {
      value: id
      label: description
    }
    office: activeOffices {
      value: id
      label: officeDescription
    }
    plates: getPlateNo {
      value: plate_no
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertJob(id: $id, fields: $fields) {
      id
    }
  }
`;

const GET_JOB_PLATE_NO = gql`
  query ($plateNo: String) {
    job: getJobByPlateNo(plateNo: $plateNo) {
      id
      customer {
        id
      }
      insurance {
        id
      }
      plateNo
      engineNo
      chassisNo
      bodyNo
      yearModel
      bodyColor
      series
      make
    }
  }
`;

const AddJobOrderForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }
  const [form] = Form.useForm();
  const { setFieldsValue } = form;

  const { loading, data } = useQuery(GET_RECORDS, {
    variables: {
      id: props?.id,
    },
    fetchPolicy: "network-only",
  });

  const [getJobByPlateNo, { loading: plateLoading }] = useLazyQuery(
    GET_JOB_PLATE_NO,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        const { job } = data;
        if (!_.isEmpty(job.id)) {
          setFieldsValue({
            customer: job.customer?.id,
            insurance: job.insurance?.id,
            engineNo: job.engineNo,
            chassisNo: job.chassisNo,
            bodyColor: job.bodyColor,
            yearModel: job.yearModel,
            series: job.series,
            make: job.make,
          });
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
    payload.plateNo = data?.plateNo || "";
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
          loading={upsertLoading || plateLoading}
          disabled={props?.completed}
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
              description={"Job Order #"}
              name="jobNo"
              initialValue={props?.jobNo}
              placeholder="Auto Generated"
              disabled
            />
          </Col>
          <Col {...col3}>
            <FormInput
              description={"Transaction Date"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={moment(props?.dateTrans)}
              name="dateTrans"
              type="datepicker"
              placeholder="Transaction Date"
              disabled={props?.billed || props?.completed}
            />
          </Col>
          <Col {...col3}>
            <FormInput
              description={"Due Date (Duration of Work)"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={moment(props?.deadline)}
              name="deadline"
              type="datepicker"
              placeholder="Due Date"
            />
          </Col>
          <Col {...col2}>
            <FormInput
              description={"Job Description"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="description"
              initialValue={props?.description}
              placeholder="Job Description"
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
          <Col {...col3}>
            <FormSelect
              loading={loading}
              description={"Office"}
              initialValue={props?.office?.id}
              name="office"
              field="office"
              placeholder="Select Office"
              list={_.get(data, "office")}
            />
          </Col>
          <Col {...col3}>
            <FormSelect
              description={"Type of Repair"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.repair?.id}
              name="repair"
              field="repair"
              placeholder="Type of Repair"
              list={_.get(data, "repairType")}
            />
          </Col>
          <Col {...col3}>
            <FormSelect
              description={"Insurance"}
              initialValue={props?.insurance?.id}
              allowClear
              name="insurance"
              field="insurance"
              placeholder="Insurance"
              list={_.get(data, "insurances")}
            />
          </Col>
          <Col {...col4}>
            <FormInput
              description={"Plate No."}
              name="plateNo"
              type="autocomplete"
              options={_.get(data, "plates")}
              onSelect={(value) => {
                getJobByPlateNo({
                  variables: {
                    plateNo: value,
                  },
                });
              }}
              initialValue={props?.plateNo}
              placeholder="Plate No."
            />
          </Col>
          <Col {...col4}>
            <FormInput
              description={"Engine No."}
              name="engineNo"
              readOnly={plateLoading}
              initialValue={props?.engineNo}
              placeholder="Engine No."
            />
          </Col>
          <Col {...col4}>
            <FormInput
              description={"Chassis No."}
              name="chassisNo"
              readOnly={plateLoading}
              initialValue={props?.chassisNo}
              placeholder="Chassis No."
            />
          </Col>
          <Col {...col4}>
            <FormInput
              description={"Body Color"}
              name="bodyColor"
              readOnly={plateLoading}
              initialValue={props?.bodyColor}
              placeholder="Body Color"
            />
          </Col>
          <Col {...col4}>
            <FormInput
              description={"Year Model"}
              name="yearModel"
              readOnly={plateLoading}
              initialValue={props?.yearModel}
              placeholder="Year Model"
            />
          </Col>
          <Col {...col4}>
            <FormInput
              description={"Series"}
              name="series"
              readOnly={plateLoading}
              initialValue={props?.series}
              placeholder="Series"
            />
          </Col>
          <Col {...col4}>
            <FormInput
              description={"Make (Brand)"}
              name="make"
              readOnly={plateLoading}
              initialValue={props?.make}
              placeholder="Make (Brand)"
            />
          </Col>
          <Col {...col4}>
            <FormInput
              description={"Odometer Reading"}
              name="odometerReading"
              initialValue={props?.odometerReading}
              placeholder="Odometer Reading"
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
