import React, { useState } from "react";
import { Office } from "@/graphql/gql/graphql";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import { SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import _ from "lodash";
import {
  GET_RECORDS_ADDRESS,
  UPSER_OFFICE_RECORD,
} from "@/graphql/offices/queries";
import { requiredField } from "@/utility/helper";
import { FormCheckBox, FormInput, FormSelect } from "@/components/common";
import { useCompany } from "@/hooks/administrative";
import { OFFICETYPE } from "@/utility/constant";

interface IProps {
  hide: (hideProps: any) => void;
  record?: Office | null | undefined;
}

const colSpan2 = {
  xs: 24,
  md: 12,
};

export default function UpsertOfficeModal(props: IProps) {
  const { hide, record } = props;
  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const [province, setProvince] = useState(record?.provinceId);
  const [city, setCity] = useState(record?.cityId);
  // ===================== Queries ==============================
  const companies = useCompany();

  const { loading, data } = useQuery(GET_RECORDS_ADDRESS, {
    variables: {
      provice: province,
      city: city,
    },
  });

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSER_OFFICE_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          hide(data);
        }
      },
    }
  );

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: any) => {
    let payload = {
      ...values,
      company: { id: values?.company },
      provinceId: province,
      cityId: city,
      status: values.status ?? false,
    };
    console.log("payload", payload);
    showPasswordConfirmation(() => {
      upsert({
        variables: {
          fields: payload,
          id: record?.id,
        },
      });
    });
  };

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">{`${
            record?.id ? "Edit" : "Add"
          } Office`}</Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "800px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            form="upsertForm"
            loading={upsertLoading}
            icon={<SaveOutlined />}>
            {`${record?.id ? "Save Changes" : "Save"} & Close`}
          </Button>
        </Space>
      }>
      <Form
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          officeDescription: record?.officeDescription,
          officeType: record?.officeType,
          company: record?.company?.id,
          telNo: record?.telNo,
          phoneNo: record?.phoneNo,
          emailAdd: record?.emailAdd,
          officeStreet: record?.officeStreet,
          officeCountry: record?.officeCountry,
          officeProvince: record?.officeProvince,
          officeMunicipality: record?.officeMunicipality,
          officeBarangay: record?.officeBarangay,
          officeZipcode: record?.officeZipcode,
          tinNumber: record?.tinNumber,
          officeSecretary: record?.officeSecretary,
          status: record?.status ?? false,
        }}>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <FormInput
              name="officeDescription"
              rules={requiredField}
              label="Office Name / Description"
              propsinput={{
                placeholder: "Office Name / Description",
              }}
            />
          </Col>
          <Col {...colSpan2}>
            <FormSelect
              name="officeType"
              label="Office Types"
              rules={requiredField}
              propsselect={{
                options: OFFICETYPE,
                allowClear: true,
                placeholder: "Select Office Type",
              }}
            />
          </Col>
          <Col {...colSpan2}>
            <FormSelect
              name="company"
              label="Assign Company"
              rules={requiredField}
              propsselect={{
                options: companies,
                allowClear: true,
                placeholder: "Select Company",
              }}
            />
          </Col>
          <Col {...colSpan2}>
            <FormInput
              name="telNo"
              rules={requiredField}
              label="Telephone #"
              propsinput={{
                placeholder: "Telephone #",
              }}
            />
          </Col>
          <Col {...colSpan2}>
            <FormInput
              name="phoneNo"
              rules={requiredField}
              label="Mobile #"
              propsinput={{
                placeholder: "Mobile #",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="emailAdd"
              rules={requiredField}
              label="Email Address"
              propsinput={{
                placeholder: "Email Address",
              }}
            />
          </Col>
          <Divider plain>Office Address</Divider>
          <Col span={24}>
            <FormInput
              name="emailAdd"
              rules={requiredField}
              label="Street"
              propsinput={{
                placeholder: "Street",
              }}
            />
          </Col>
          <Col {...colSpan2}>
            <FormSelect
              name="officeCountry"
              label="Country"
              rules={requiredField}
              propsselect={{
                showSearch: true,
                loading: loading,
                options: _.get(data, "country", []),
                allowClear: true,
                placeholder: "Select Country",
              }}
            />
          </Col>
          <Col {...colSpan2}>
            <FormSelect
              name="officeProvince"
              label="Province"
              rules={requiredField}
              propsselect={{
                showSearch: true,
                loading: loading,
                options: _.get(data, "province", []),
                allowClear: true,
                placeholder: "Select Province",
                onChange: (e) => {
                  let obj = _.find(_.get(data, "province"), ["value", e]);
                  if (obj) {
                    setProvince(obj.id);
                  }
                },
              }}
            />
          </Col>
          <Col {...colSpan2}>
            <FormSelect
              name="officeMunicipality"
              label="City/Municipality"
              rules={requiredField}
              propsselect={{
                showSearch: true,
                loading: loading,
                options: _.get(data, "city", []),
                allowClear: true,
                placeholder: "Select City/Municipality",
                onChange: (e) => {
                  let obj = _.find(_.get(data, "city"), ["value", e]);
                  if (obj) {
                    setCity(obj.id);
                  }
                },
              }}
            />
          </Col>
          <Col {...colSpan2}>
            <FormSelect
              name="officeBarangay"
              label="Barangay"
              rules={requiredField}
              propsselect={{
                showSearch: true,
                loading: loading,
                options: _.get(data, "barangay", []),
                allowClear: true,
                placeholder: "Select Barangay",
              }}
            />
          </Col>
          <Col span={24}>
            <FormInput
              name="officeZipcode"
              rules={requiredField}
              label="Zip Code"
              propsinput={{
                placeholder: "Zip Code",
              }}
            />
          </Col>
          <Divider plain>Other Configuration</Divider>
          <Col {...colSpan2}>
            <FormInput
              name="tinNumber"
              rules={requiredField}
              label="Tin Number"
              propsinput={{
                placeholder: "Tin Number",
              }}
            />
          </Col>
          <Col {...colSpan2}>
            <FormInput
              name="officeSecretary"
              rules={requiredField}
              label="BIR 2307 Signatory"
              propsinput={{
                placeholder: "BIR 2307 Signatury",
              }}
            />
          </Col>
          <Col span={24}>
            <FormCheckBox
              name="status"
              valuePropName="checked"
              checkBoxLabel="Set as Active"
              propscheckbox={{
                defaultChecked: false,
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
