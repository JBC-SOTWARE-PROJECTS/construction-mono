import { FormInput, FormSelect } from "@/components/common";
import FormButton from "@/components/common/formButton/formButton";
import FormCheckBox from "@/components/common/formCheckBox/formCheckBox";
import FormDatePicker from "@/components/common/formDatePicker/formDatePicker";
import FormRadioButton from "@/components/common/formRadioButton";
import { UseCompanySelection } from "@/hooks/companySelection";
import { CIVIL, EMPSTATUS, GENDER, col2, col3, col4 } from "@/utility/constant";
import { IPageProps } from "@/utility/interfaces";
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  LockOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Skeleton,
  message,
} from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";

const GET_RECORDS = gql`
  query ($id: UUID) {
    emp: employeeById(id: $id) {
      id
      office {
        id
        officeDescription
      }
      position {
        id
        description
      }
      currentCompany {
        id
      }
      employeeNo
      firstName
      lastName
      middleName
      nameSuffix
      titleInitials
      emailAddress
      nationality
      civilStatus
      gender
      dob
      street
      country
      stateProvince
      cityMunicipality
      bloodType
      barangay
      zipCode
      emergencyContactName
      emergencyContactAddress
      emergencyContactRelationship
      emergencyContactNo
      employeeTelNo
      employeeCelNo
      philhealthNo
      sssNo
      tinNo
      pagIbigId
      employeeType
      basicSalary
      isActivePHIC
      isActiveSSS
      isActiveHDMF
      monthlyRate
      hourlyRate
      isFixedRate
      isExcludedFromAttendance
      user {
        login
        password
        id
        access
        roles
      }
    }
    office: activeOffices {
      value: id
      label: officeDescription
    }
    pos: activePositions {
      value: id
      label: description
    }
    permissions {
      value: name
      label: description
    }
    authorities {
      value: name
      label: name
    }
  }
`;

const GET_RECORDS_ADDRESS = gql`
  query ($province: UUID, $city: UUID) {
    country: countries {
      value: country
      label: country
    }
    province: provinces {
      id
      value: provinceName
      label: provinceName
    }
    city: cityByProvince(id: $province) {
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
  mutation (
    $id: UUID
    $fields: Map_String_ObjectScalar
    $authorities: [String!]
    $permissions: [String!]
    $officeId: UUID
    $position: UUID
    $company: UUID
  ) {
    upsert: upsertEmployee(
      id: $id
      fields: $fields
      authorities: $authorities
      permissions: $permissions
      officeId: $officeId
      position: $position
      company: $company
    ) {
      id
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($username: String) {
    newPassword: changePassword(username: $username)
  }
`;

const EmployeeForm = ({ account }: IPageProps) => {
  const router = useRouter();
  const companyList = UseCompanySelection();
  const id = router?.query?.id;
  const [state, setState] = useState({
    province: null,
    city: null,
  });
  {
    /* error = { errorTitle: "", errorMsg: ""}*/
  }

  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: id,
    },
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      console.log(res.data.isFixedRate);
      setState({
        ...state,
        city: res.data.cityMunicipality,
        province: res.data.stateProvince,
      });
    },
  });

  const { loading: loadingAddress, data: addressData } = useQuery(
    GET_RECORDS_ADDRESS,
    {
      variables: {
        province: state.province,
        city: state.city,
      },
    }
  );

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_RECORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.upsert?.id)) {
          if (id) {
            message.success("Employee Information Updated");
            refetch();
          } else {
            window.location.href = `/payroll/employees`;
          }
        }
      },
    }
  );

  const [changePasswordNow, { loading: changePasswordLoading }] = useMutation(
    CHANGE_PASSWORD,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        Modal.info({
          title: "Success",
          icon: <InfoCircleOutlined />,
          content:
            "The temporary password is " +
            data.newPassword +
            ". Please copy and email this to the user",
          onOk() {},
          onCancel() {},
        });
      },
    }
  );

  //======================= =================== =================================================//
  const onSubmitEmployee = (e: any) => {
    let payload = _.clone(e);
    delete payload.position;
    delete payload.office;
    delete payload.authorities;
    delete payload.permissions;
    delete payload.confirmPassword;

    if (id) {
      if (_.isEmpty(_.get(data, "emp.user"))) {
        if (e.password !== e.confirmPassword) {
          message.error("Password Mismatch");
        } else {
          upsertRecord({
            variables: {
              id: id,
              fields: payload,
              authorities: e.authorities,
              permissions: e.permissions,
              officeId: e.office,
              position: e.position,
              company: e.company,
            },
          });
        }
      } else {
        upsertRecord({
          variables: {
            id: id,
            fields: payload,
            authorities: e.authorities,
            permissions: e.permissions,
            officeId: e.office,
            position: e.position,
            company: e.company,
          },
        });
      }
    } else {
      upsertRecord({
        variables: {
          id: id,
          fields: payload,
          authorities: e.authorities,
          permissions: e.permissions,
          officeId: e.office,
          position: e.position,
          company: e.company,
        },
      });
    }
  };

  const changePassword = (login: any) => {
    Modal.confirm({
      title: "Change Password Confirmation?",
      content: "Please Confirm to reset Password",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        changePasswordNow({
          variables: {
            username: login,
          },
        });
      },
      onCancel() {},
    });
  };

  const handleChangeAddress = (value: any, address: string) => {
    let obj = _.find(_.get(addressData, address), ["value", value]);
    if (obj) setState({ ...state, [address]: obj.id });
  };
  const [form] = Form.useForm();
  const fixedRate = Form.useWatch("isFixedRate", form);
  return (
    <Row gutter={16}>
      <Col span={24}>
        <Card
          title={
            <>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
                type="text"
                shape="circle"
              />
              Employee Information
            </>
          }
        >
          {loading ? (
            <Skeleton active />
          ) : (
            <Form
              layout="vertical"
              name="employeeForm"
              //   error={formError}
              onFinish={onSubmitEmployee}
              className="form-card"
              form={form}
            >
              <Row gutter={16}>
                <Col {...col4}>
                  <FormInput
                    label={"First Name"}
                    initialValue={_.get(data, "emp.firstName")}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    name="firstName"
                    propsinput={{ placeholder: "First Name" }}
                  />
                </Col>
                <Col {...col4}>
                  <FormInput
                    label={"Middle Name"}
                    initialValue={_.get(data, "emp.middleName")}
                    name="middleName"
                    propsinput={{ placeholder: "Middle Name" }}
                  />
                </Col>
                <Col {...col4}>
                  <FormInput
                    label={"Last Name"}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    initialValue={_.get(data, "emp.lastName")}
                    name="lastName"
                    propsinput={{ placeholder: "Last Name" }}
                  />
                </Col>
                <Col {...col4}>
                  <FormInput
                    label={"Suffix"}
                    initialValue={_.get(data, "emp.nameSuffix")}
                    name="nameSuffix"
                    propsinput={{
                      placeholder: "Suffix (e.g J.R, S.R, II, III etc.)",
                    }}
                  />
                </Col>
                {/* 2nd row */}
                <Col {...col4}>
                  <FormDatePicker
                    label={"Date of Birth"}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    initialValue={dayjs(_?.get(data, "emp.dob"))}
                    name="dob"
                    propsdatepicker={{}}
                  />
                </Col>
                <Col {...col4}>
                  <FormSelect
                    propsselect={{
                      placeholder: "Gender",
                      loading: loading,
                      options: GENDER,
                    }}
                    label={"Gender"}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    initialValue={_.get(data, "emp.gender")}
                    name="gender"
                  />
                </Col>
                <Col {...col4}>
                  <FormSelect
                    propsselect={{
                      loading: loading,
                      options: _.get(data, "pos", []),
                    }}
                    label={"Position/Designation"}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    initialValue={_.get(data, "emp.position.id")}
                    name="position"
                  />
                </Col>
                <Col {...col4}>
                  <FormSelect
                    label={"Employment Status"}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    initialValue={_.get(data, "emp.employeeType")}
                    name="employeeType"
                    propsselect={{
                      placeholder: "Employment Status",
                      options: EMPSTATUS,
                    }}
                  />
                </Col>
                {/* 3rd Row */}
                <Col {...col4}>
                  <FormInput
                    label={"Title"}
                    name="titleInitials"
                    initialValue={_.get(data, "emp.titleInitials")}
                    propsinput={{ placeholder: "Title (e.g Mr., Ms., etc.)" }}
                  />
                </Col>
                <Col {...col4}>
                  <FormInput
                    label={"Email Address"}
                    name="emailAddress"
                    initialValue={_.get(data, "emp.emailAddress")}
                    propsinput={{
                      type: "email",
                      placeholder: "Email Address (e.g juan@matamad.com)",
                    }}
                  />
                </Col>
                <Col {...col4}>
                  <FormInput
                    label={"Nationality"}
                    name="nationality"
                    initialValue={_.get(data, "emp.nationality")}
                    propsinput={{
                      placeholder: "Nationality (e.g FILIPINO, JAPANESE, etc.)",
                    }}
                  />
                </Col>
                <Col {...col4}>
                  <FormSelect
                    label={"Civil/Marital Status"}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    initialValue={_.get(data, "emp.civilStatus")}
                    name="civilStatus"
                    propsselect={{
                      placeholder: "Civil/Marital Status",
                      options: CIVIL,
                    }}
                  />
                </Col>
                {/* 4th Row */}
                <Divider>Employee Address</Divider>
                <Col {...col2}>
                  <FormInput
                    label={"Street Address"}
                    name="street"
                    initialValue={_.get(data, "emp.street")}
                    propsinput={{ placeholder: "Street Address" }}
                  />
                </Col>
                <Col {...col2}>
                  <FormSelect
                    label={"Country"}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    initialValue={_.get(data, "emp.country")}
                    name="country"
                    propsselect={{
                      placeholder: "Country",
                      loading: loadingAddress,
                      options: _.get(addressData, "country", []),
                    }}
                  />
                </Col>
                {/* 5th Row */}
                <Col {...col4}>
                  <FormSelect
                    propsselect={{
                      placeholder: "Province",
                      loading: loading,
                      options: _.get(addressData, "province", []),
                      onChange: (value) => {
                        handleChangeAddress(value, "province");
                      },
                    }}
                    label={"Province"}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    initialValue={_.get(data, "emp.stateProvince")}
                    name="stateProvince"
                  />
                </Col>
                <Col {...col4}>
                  <FormSelect
                    label={"City/Municipality"}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    initialValue={_.get(data, "emp.cityMunicipality")}
                    name="cityMunicipality"
                    propsselect={{
                      placeholder: "City/Municipality",
                      loading: loadingAddress,
                      options: _.get(addressData, "city", []),
                      onChange: (value) => {
                        handleChangeAddress(value, "city");
                      },
                    }}
                  />
                </Col>
                <Col {...col4}>
                  <FormSelect
                    label={"Barangay"}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    initialValue={_.get(data, "emp.barangay")}
                    name="barangay"
                    propsselect={{
                      placeholder: "Barangay",
                      loading: loadingAddress,
                      options: _.get(addressData, "barangay", []),
                      onChange: (value) => {
                        handleChangeAddress(value, "barangay");
                      },
                    }}
                  />
                </Col>
                <Col {...col4}>
                  <FormInput
                    label={"Postal / Zip code"}
                    name="zipCode"
                    initialValue={_.get(data, "emp.zipCode")}
                    propsinput={{ placeholder: "Postal / Zip code" }}
                  />
                </Col>
                {/* 6th Row */}
                <Divider>
                  Employee Contact Information and Office Designation
                </Divider>
                <Col {...col4}>
                  <FormInput
                    label={"Telephone No."}
                    initialValue={_.get(data, "emp.employeeTelNo")}
                    name="employeeTelNo"
                    propsinput={{ placeholder: "Telephone No." }}
                  />
                </Col>
                <Col {...col4}>
                  <FormInput
                    label={"Mobile No."}
                    initialValue={_.get(data, "emp.employeeCelNo")}
                    name="employeeCelNo"
                    propsinput={{ placeholder: "Mobile No." }}
                  />
                </Col>
                <Col {...col4}>
                  <FormSelect
                    label={"Assigned Office"}
                    initialValue={_.get(data, "emp.office.id")}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    name="office"
                    propsselect={{
                      placeholder: "Assigned Office",
                      loading: loading,
                      options: _.get(data, "office", []),
                      onChange: (value) => {
                        handleChangeAddress(value, "barangay");
                      },
                    }}
                  />
                </Col>
                <Col {...col4}>
                  <FormSelect
                    label={"Company"}
                    initialValue={_.get(data, "emp.currentCompany.id")}
                    rules={[
                      { required: true, message: "This Field is required" },
                    ]}
                    name="company"
                    propsselect={{
                      placeholder: "Company",
                      loading: loading,
                      options: companyList?.map((item) => {
                        return { value: item.id, label: item.companyName };
                      }),
                      onChange: (value) => {
                        handleChangeAddress(value, "barangay");
                      },
                    }}
                  />
                </Col>
                {/* 7th Row */}
                <Divider>Employee Details</Divider>
                <Col {...col4}>
                  <FormInput
                    label={"PhilHealth #"}
                    initialValue={_.get(data, "emp.philhealthNo")}
                    name="philhealthNo"
                    propsinput={{ placeholder: "PhilHealth #" }}
                  />
                </Col>
                <Col {...col4}>
                  <FormInput
                    label={"SSS #"}
                    initialValue={_.get(data, "emp.sssNo")}
                    name="sssNo"
                    propsinput={{ placeholder: "SSS #" }}
                  />
                </Col>
                <Col {...col4}>
                  <FormInput
                    label={"Tin #"}
                    initialValue={_.get(data, "emp.tinNo")}
                    name="tinNo"
                    propsinput={{ placeholder: "Tin #" }}
                  />
                </Col>
                {/* 8th Row */}
                <Col {...col4}>
                  <FormInput
                    label={"Pag-Ibig #"}
                    initialValue={_.get(data, "emp.pagIbigId")}
                    name="pagIbigId"
                    propsinput={{ placeholder: "Pag-Ibig #" }}
                  />
                </Col>
                <Col {...col4}>
                  <FormInput
                    label={"Blood Type"}
                    initialValue={_.get(data, "emp.bloodType")}
                    name="bloodType"
                    propsinput={{ placeholder: "Blood Type" }}
                  />
                </Col>
                <Col {...col4}>
                  <FormRadioButton
                    label="Has Fixed Monthly Rate?"
                    name="isFixedRate"
                    initialValue={_.get(data, "emp.isFixedRate") || false}
                    propsradiobutton={{
                      options: [
                        {
                          label: "Yes",
                          value: true,
                        },
                        {
                          label: "No",
                          value: false,
                        },
                      ],
                      optionType: "button",
                      buttonStyle: "solid",
                    }}
                  />
                </Col>
                <Col {...col4}>
                  <FormInput
                    label={"Monthly Rate"}
                    initialValue={_.get(data, "emp.monthlyRate") || 0}
                    name="monthlyRate"
                    propsinput={{
                      placeholder: "Monthly Rate",
                      type: "number",

                      disabled: !fixedRate,
                    }}
                  />
                </Col>
                <Col {...col4}>
                  <FormInput
                    label={"Hourly Rate"}
                    initialValue={_.get(data, "emp.hourlyRate") || 0}
                    name="hourlyRate"
                    propsinput={{
                      placeholder: "Houry Rate",
                      type: "number",
                      disabled: fixedRate,
                    }}
                  />
                </Col>
                <Col {...col4}>
                  <FormInput
                    label={"Basic Salary (for contributions computation)"}
                    initialValue={_.get(data, "emp.basicSalary") || 0}
                    name="basicSalary"
                    propsinput={{
                      placeholder: "Basic Salary",
                      type: "number",
                    }}
                  />
                </Col>
                <Col {...col4}>
                  <FormCheckBox
                    name="isActiveSSS"
                    valuePropName="checked"
                    checkBoxLabel="Include in SSS"
                    initialValue={_.get(data, "emp.isActiveSSS")}
                    propscheckbox={{
                      defaultChecked: true,
                    }}
                  />
                </Col>
                <Col {...col4}>
                  <FormCheckBox
                    name="isActivePHIC"
                    valuePropName="checked"
                    checkBoxLabel="include in PHIC"
                    initialValue={_.get(data, "emp.isActivePHIC")}
                    propscheckbox={{
                      defaultChecked: true,
                    }}
                  />
                </Col>
                <Col {...col4}>
                  <FormCheckBox
                    name="isActiveHDMF"
                    initialValue={_.get(data, "emp.isActiveHDMF")}
                    valuePropName="checked"
                    checkBoxLabel="include in HDMF"
                    propscheckbox={{
                      defaultChecked: true,
                    }}
                  />
                </Col>
                <Col {...col4}>
                  <FormCheckBox
                    name="isExcludedFromAttendance"
                    valuePropName="checked"
                    checkBoxLabel="Exclude from attendance"
                    initialValue={_.get(data, "emp.isExcludedFromAttendance")}
                    propscheckbox={{
                      defaultChecked: true,
                    }}
                  />
                </Col>
                {/* 9th Row */}
                <Divider>In Case of Emergency</Divider>
                <Col {...col2}>
                  <FormInput
                    label={"Name"}
                    initialValue={_.get(data, "emp.emergencyContactName")}
                    name="emergencyContactName"
                    propsinput={{ placeholder: "Name" }}
                  />
                </Col>
                <Col {...col2}>
                  <FormInput
                    label={"Adress"}
                    initialValue={_.get(data, "emp.emergencyContactAddress")}
                    name="emergencyContactAddress"
                    propsinput={{ placeholder: "Postal / Zip code" }}
                  />
                </Col>
                {/* 10th Row */}
                <Col {...col2}>
                  <FormInput
                    label={"Relationship"}
                    initialValue={_.get(
                      data,
                      "emp.emergencyContactRelationship"
                    )}
                    name="emergencyContactRelationship"
                    propsinput={{ placeholder: "Relationship" }}
                  />
                </Col>
                <Col {...col2}>
                  <FormInput
                    label={"Contact No."}
                    initialValue={_.get(data, "emp.emergencyContactNo")}
                    name="emergencyContactNo"
                    propsinput={{ placeholder: "Contact No." }}
                  />
                </Col>
                {/* 11th Row */}
                {!_.isEmpty(id) && (
                  <>
                    <Divider>User Credentials</Divider>
                    {_.isEmpty(_.get(data, "emp.user")) ? (
                      <Col {...col3}>
                        <FormInput
                          label={"Username"}
                          name="login"
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "This Field is required",
                          //   },
                          // ]}
                          propsinput={{ placeholder: "username (e.g jdcruz)" }}
                        />
                      </Col>
                    ) : (
                      <Col {...col2}>
                        <FormInput
                          label={"Username"}
                          name="login"
                          initialValue={_.get(data, "emp.user.login")}
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "This Field is required",
                          //   },
                          // ]}
                          propsinput={{ placeholder: "username (e.g jdcruz)" }}
                        />
                      </Col>
                    )}

                    {_.isEmpty(_.get(data, "emp.user")) ? (
                      <Col {...col3}>
                        <FormInput
                          label={"Password"}
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "This Field is required",
                          //   },
                          // ]}
                          name="password"
                          propsinput={{
                            placeholder: "Password",
                            type: "password",
                          }}
                        />
                      </Col>
                    ) : (
                      <Col {...col2}>
                        <FormInput
                          label={"Password"}
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "This Field is required",
                          //   },
                          // ]}
                          name="password"
                          initialValue={_.get(data, "emp.user.password")}
                          propsinput={{
                            placeholder: "Password",
                            type: "password",
                          }}
                        />
                      </Col>
                    )}

                    {_.isEmpty(_.get(data, "emp.user")) && (
                      <Col {...col3}>
                        <FormInput
                          label={"Confirm Password"}
                          name="confirmPassword"
                          propsinput={{
                            placeholder: "Confirm Password",
                            type: "password",
                          }}
                        />
                      </Col>
                    )}
                    {/* 12th Row */}
                    <Col {...col2}>
                      <FormSelect
                        label={"Roles"}
                        name="authorities"
                        initialValue={_.get(data, "emp.user.roles")}
                        propsselect={{
                          mode: "multiple",
                          placeholder: "Roles",
                          options: _.get(data, "authorities", []),
                        }}
                      />
                    </Col>
                    <Col {...col2}>
                      <FormSelect
                        label={"Permissions"}
                        name="permissions"
                        initialValue={_.get(data, "emp.user.access")}
                        propsselect={{
                          mode: "multiple",
                          placeholder: "Permissions",
                          options: _.get(data, "permissions", []),
                        }}
                      />
                    </Col>
                  </>
                )}
                {/* button */}
                <div style={{ width: "100%", marginTop: 20 }}>
                  <FormButton
                    buttonprops={{
                      type: "primary",
                      block: true,
                      loading: upsertLoading,
                      btnlabel: " Save Employee",
                      icon: <SaveOutlined />,
                    }}
                  />
                  {!_.isEmpty(_.get(data, "emp.user")) && (
                    <FormButton
                      buttonprops={{
                        danger: true,
                        block: true,
                        loading: changePasswordLoading,
                        onClick: () => {
                          changePassword(_.get(data, "emp.user.login"));
                        },
                        btnlabel: "Change Password",
                        icon: <LockOutlined />,
                      }}
                    />
                  )}
                </div>
              </Row>
            </Form>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default EmployeeForm;
