import React, { useState } from "react";
import { Col, Row, Button, Divider } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import FormSelect from "../../../util/customForms/formSelect";
import CModal from "../../../app/components/common/CModal";
import { OFFICETYPE, col2 } from "../../../shared/constant";
import FormCheckbox from "../../../util/customForms/formCheckbox";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_RECORDS_ADDRESS = gql`
  query ($provice: UUID, $city: UUID) {
    country: countries {
      value: country
      label: country
    }
    province: provinces {
      id
      value: provinceName
      label: provinceName
    }
    city: cityByProvince(id: $provice) {
      id
      value: cityName
      label: cityName
    }
    barangay: barangayByCity(id: $city) {
      value: barangayName
      label: barangayName
    }
  }
`;

const UPSERT_RECORD = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    upsert: upsertOffice(id: $id, fields: $fields) {
      id
    }
  }
`;

const OfficeForm = ({ visible, hide, ...props }) => {
  const [formError, setFormError] = useState({});
  const [state, setState] = useState({
    provice: null,
    city: null,
  });
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }

  const { loading, data } = useQuery(GET_RECORDS_ADDRESS, {
    variables: {
      provice: state.provice,
      city: state.city,
    },
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (props?.id) {
            hide("Office Information Updated");
          } else {
            hide("Office Information Added");
          }
        }
      },
    }
  );

  //======================= =================== =================================================//

  const onSubmit = (data) => {
    console.log("User data => ", data);
    upsertRecord({
      variables: {
        id: props?.id,
        fields: data,
      },
    });
  };

  console.log("modal props => ", props);

  return (
    <CModal
      width={"50%"}
      title={"Office Information"}
      visible={visible}
      footer={[
        <Button key="back" onClick={() => hide()} type="danger">
          Return
        </Button>,
        <Button
          form="officeForm"
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
        name="officeForm"
        id="officeForm"
        error={formError}
        onFinish={onSubmit}
        className="form-card"
      >
        <Row>
          <Col {...col2}>
            <FormInput
              description={"Office Code"}
              name="officeCode"
              initialValue={props?.officeCode}
              placeholder="Office Code"
              disabled
            />
          </Col>
          <Col {...col2}>
            <FormSelect
              description={"Office Type"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.officeType}
              name="officeType"
              field="officeType"
              placeholder="Office Type"
              list={OFFICETYPE}
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Office Description"}
              rules={[{ required: true, message: "This Field is required" }]}
              name="officeDescription"
              initialValue={props?.officeDescription}
              placeholder="Office Description"
            />
          </Col>
          <Col {...col2}>
            <FormInput
              description={"Telephone #"}
              initialValue={props?.telNo}
              name="telNo"
              placeholder="Telephone #"
            />
          </Col>
          <Col {...col2}>
            <FormInput
              description={"Mobile #"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.phoneNo}
              name="phoneNo"
              placeholder="Mobile #"
            />
          </Col>
          <Col span={24}>
            <FormInput
              description={"Email Address"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.emailAdd}
              name="emailAdd"
              placeholder="Email Address"
            />
          </Col>
          <Divider>Office Address</Divider>
          <Col span={24}>
            <FormInput
              description={"Street"}
              name="officeStreet"
              initialValue={props?.officeStreet}
              placeholder="Street/Building No./etc."
            />
          </Col>
          <Col {...col2}>
            <FormSelect
              loading={loading}
              description={"Country"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.officeCountry}
              name="officeCountry"
              field="officeCountry"
              placeholder="Country"
              list={_.get(data, "country", [])}
            />
          </Col>
          <Col {...col2}>
            <FormSelect
              description={"Province"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.officeProvince}
              name="officeProvince"
              field="officeProvince"
              placeholder="Province"
              loading={loading}
              list={_.get(data, "province", [])}
              onChange={(e) => {
                let obj = _.find(_.get(data, "province"), ["value", e]);
                if (obj) setState({ ...state, provice: obj.id });
              }}
            />
          </Col>
          <Col {...col2}>
            <FormSelect
              description={"City/Municipality"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.officeMunicipality}
              name="officeMunicipality"
              field="officeMunicipality"
              placeholder="City/Municipality"
              loading={loading}
              list={_.get(data, "city", [])}
              onChange={(e) => {
                let obj = _.find(_.get(data, "city"), ["value", e]);
                if (obj) setState({ ...state, city: obj.id });
              }}
            />
          </Col>
          <Col {...col2}>
            <FormSelect
              description={"Barangay"}
              rules={[{ required: true, message: "This Field is required" }]}
              initialValue={props?.officeBarangay}
              name="officeBarangay"
              field="officeBarangay"
              placeholder="Barangay"
              loading={loading}
              list={_.get(data, "barangay", [])}
            />
          </Col>
          <Col span={24}>
            <FormCheckbox
              description={"Set as Active"}
              name="status"
              valuePropName="checked"
              initialValue={props?.status}
              field="status"
            />
          </Col>
        </Row>
      </MyForm>
    </CModal>
  );
};

export default OfficeForm;
