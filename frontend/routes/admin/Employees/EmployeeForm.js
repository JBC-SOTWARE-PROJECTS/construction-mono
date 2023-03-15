import React, { useState } from "react";
import { Col, Row, Card, Divider, Skeleton, message, Modal } from "antd";
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import FormBtnSubmit from "../../../util/customForms/formBtnSubmit";
import FormSelect from "../../../util/customForms/formSelect";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { GENDER, CIVIL, EMPSTATUS } from "../../../shared/constant"
import _ from "lodash";
import moment from "moment";
import FormBtn from "../../../util/customForms/formBtn";
import { col2, col4, col3 } from "../../../shared/constant";


const GET_RECORDS = gql`
query($id: UUID) {
    emp: employeeById(id: $id) {
        id
        office{
            id
            officeDescription
        }
        position{
            id
            description
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
    permissions{
        value: name
        label: description
    }
    authorities{
        value: name
        label: name
    }
}`;

const GET_RECORDS_ADDRESS = gql`
query($provice: UUID, $city: UUID) {
    country: countries {
        value: country
        label: country
    }
    province: provinces {
        id
        value: provinceName
        label: provinceName
    }
    city: cityByProvince(id: $provice){
        id
        value: cityName
        label: cityName
    }
    barangay: barangayByCity(id: $city){
        value: barangayName
        label: barangayName
    }
}`;

const UPSERT_RECORD = gql`
 mutation($id: UUID, $fields: Map_String_ObjectScalar, $authorities: [String!],$permissions: [String!], $officeId: UUID, $position: UUID) {
     upsert: upsertEmployee(id: $id, fields: $fields, authorities: $authorities, permissions: $permissions, officeId: $officeId, position: $position) {
         id
	}
}`;

const CHANGE_PASSWORD = gql`
	mutation ChangePassword($username: String) {
		newPassword: changePassword(username: $username)
	}
`;

const EmployeeForm = ({ account, id }) => {

    const [formError, setFormError] = useState({});
    const [state, setState] = useState({
        provice: null,
        city: null,
    })
    {/* error = { errorTitle: "", errorMsg: ""}*/ }

    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        variables: {
            id: id,
        },
        fetchPolicy: 'network-only',
    });

    const { loading: loadingAddress, data: addressData } = useQuery(GET_RECORDS_ADDRESS, {
        variables: {
            provice: state.provice,
            city: state.city
        }
    });

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                if (id) {
                    message.success("Employee Information Updated")
                    refetch()
                } else {
                    window.location.href = `/admin/employees`;
                }
            }
        }
    });

    const [changePasswordNow, { loading: changePasswordLoading }] = useMutation(CHANGE_PASSWORD, {
        ignoreResults: false,
        onCompleted: data => {
            Modal.info({
                title: 'Success',
                icon: < InfoCircleOutlined />,
                content:
                    'The temporary password is ' +
                    data.newPassword +
                    '. Please copy and email this to the user',
                onOk() { },
                onCancel() { },
            });
        },
    });

    //======================= =================== =================================================//
    const onSubmitEmployee = (e) => {
        let payload = _.clone(e)
        delete payload.position
        delete payload.office
        delete payload.authorities
        delete payload.permissions
        delete payload.confirmPassword

        if (id) {
            if (_.isEmpty(_.get(data, "emp.user"))) {
                if (e.password !== e.confirmPassword) {
                    message.error("Password Mismatch")
                } else {
                    upsertRecord({
                        variables: {
                            id: id,
                            fields: payload,
                            authorities: e.authorities,
                            permissions: e.permissions,
                            officeId: e.office,
                            position: e.position
                        }
                    })
                }
            } else {
                upsertRecord({
                    variables: {
                        id: id,
                        fields: payload,
                        authorities: e.authorities,
                        permissions: e.permissions,
                        officeId: e.office,
                        position: e.position
                    }
                })
            }
        } else {
            upsertRecord({
                variables: {
                    id: id,
                    fields: payload,
                    authorities: e.authorities,
                    permissions: e.permissions,
                    officeId: e.office,
                    position: e.position
                }
            })
        }
    }

    const changePassword = login => {
        Modal.confirm({
            title: 'Change Password Confirmation?',
            content: 'Please Confirm to reset Password',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                changePasswordNow({
                    variables: {
                        username: login,
                    },
                });
            },
            onCancel() { },
        });
    };

    return (
        <Row>
            <Col span={24}>
                <Card className="gx-card" title="Employee Informations">
                    {loading ? (<Skeleton active />) :
                        (
                            <MyForm
                                name="employeeForm"
                                error={formError}
                                onFinish={onSubmitEmployee}
                                className="form-card"
                            >
                                <Row>
                                    <Col {...col4}>
                                        <FormInput description={"First Name"}
                                            initialValue={_.get(data, "emp.firstName")}
                                            rules={[{ required: true, message: 'This Field is required' }]}
                                            name="firstName"
                                            placeholder="First Name" />
                                    </Col>
                                    <Col {...col4}>
                                        <FormInput description={"Middle Name"}
                                            initialValue={_.get(data, "emp.middleName")}
                                            name="middleName"
                                            placeholder="Middle Name" />
                                    </Col>
                                    <Col {...col4}>
                                        <FormInput description={"Last Name"}
                                            rules={[{ required: true, message: 'This Field is required' }]}
                                            initialValue={_.get(data, "emp.lastName")}
                                            name="lastName"
                                            placeholder="Last Name" />
                                    </Col>
                                    <Col {...col4}>
                                        <FormInput description={"Suffix"}
                                            initialValue={_.get(data, "emp.nameSuffix")}
                                            name="nameSuffix"
                                            placeholder="Suffix (e.g J.R, S.R, II, III etc.)" />
                                    </Col>
                                    {/* 2nd row */}
                                    <Col {...col4}>
                                        <FormInput description={"Date of Birth"}
                                            rules={[{ required: true, message: 'This Field is required' }]}
                                            initialValue={moment(_.get(data, "emp.dob"))}
                                            name="dob"
                                            type="datepicker"
                                            placeholder="Date of Birth" />
                                    </Col>
                                    <Col {...col4}>
                                        <FormSelect
                                            description={"Gender"}
                                            rules={[{ required: true, message: 'This Field is required' }]}
                                            initialValue={_.get(data, "emp.gender")}
                                            name="gender"
                                            field="gender"
                                            placeholder="Gender"
                                            list={GENDER}
                                        />
                                    </Col>
                                    <Col {...col4}>
                                        <FormSelect
                                            description={"Position/Designation"}
                                            rules={[{ required: true, message: 'This Field is required' }]}
                                            initialValue={_.get(data, "emp.position.id")}
                                            name="position"
                                            field="position"
                                            placeholder="Position/Designation"
                                            list={_.get(data, "pos", [])}
                                        />
                                    </Col>
                                    <Col {...col4}>
                                        <FormSelect
                                            description={"Employment Status"}
                                            rules={[{ required: true, message: 'This Field is required' }]}
                                            initialValue={_.get(data, "emp.employeeType")}
                                            name="employeeType"
                                            field="employeeType"
                                            placeholder="Employment Status"
                                            list={EMPSTATUS}
                                        />
                                    </Col>
                                    {/* 3rd Row */}
                                    <Col {...col4}>
                                        <FormInput description={"Title"}
                                            name="titleInitials"
                                            initialValue={_.get(data, "emp.titleInitials")}
                                            placeholder="Title (e.g Mr., Ms., etc.)" />
                                    </Col>
                                    <Col {...col4}>
                                        <FormInput description={"Email Address"}
                                            name="emailAddress"
                                            initialValue={_.get(data, "emp.emailAddress")}
                                            type="email"
                                            placeholder="Email Address (e.g juan@matamad.com)" />
                                    </Col>
                                    <Col {...col4}>
                                        <FormInput description={"Nationality"}
                                            name="nationality"
                                            initialValue={_.get(data, "emp.nationality")}
                                            placeholder="Nationality (e.g FILIPINO, JAPANESE, etc.)" />
                                    </Col>
                                    <Col {...col4}>
                                        <FormSelect
                                            description={"Civil/Marital Status"}
                                            rules={[{ required: true, message: 'This Field is required' }]}
                                            initialValue={_.get(data, "emp.civilStatus")}
                                            name="civilStatus"
                                            field="civilStatus"
                                            placeholder="Civil/Marital Status"
                                            list={CIVIL}
                                        />
                                    </Col>
                                    {/* 4th Row */}
                                    <Divider>Employee Address</Divider>
                                    <Col {...col2}>
                                        <FormInput description={"Street Address"}
                                            name="street"
                                            initialValue={_.get(data, "emp.street")}
                                            placeholder="Street Address" />
                                    </Col>
                                    <Col {...col2}>
                                        <FormSelect
                                            loading={loadingAddress}
                                            description={"Country"}
                                            rules={[{ required: true, message: 'This Field is required' }]}
                                            initialValue={_.get(data, "emp.country")}
                                            name="country"
                                            field="country"
                                            placeholder="Country"
                                            list={_.get(addressData, "country", [])}
                                        />
                                    </Col>
                                    {/* 5th Row */}
                                    <Col {...col4}>
                                        <FormSelect
                                            description={"Province"}
                                            rules={[{ required: true, message: 'This Field is required' }]}
                                            initialValue={_.get(data, "emp.stateProvince")}
                                            name="stateProvince"
                                            field="stateProvince"
                                            placeholder="Province"
                                            loading={loadingAddress}
                                            list={_.get(addressData, "province", [])}
                                            onChange={(e) => {
                                                let obj = _.find(_.get(addressData, "province"), ['value', e]);
                                                if (obj) setState({ ...state, provice: obj.id });
                                            }}
                                        />
                                    </Col>
                                    <Col {...col4}>
                                        <FormSelect
                                            description={"City/Municipality"}
                                            rules={[{ required: true, message: 'This Field is required' }]}
                                            initialValue={_.get(data, "emp.cityMunicipality")}
                                            name="cityMunicipality"
                                            field="cityMunicipality"
                                            placeholder="City/Municipality"
                                            loading={loadingAddress}
                                            list={_.get(addressData, "city", [])}
                                            onChange={(e) => {
                                                let obj = _.find(_.get(addressData, "city"), ['value', e]);
                                                if (obj) setState({ ...state, city: obj.id });
                                            }}
                                        />
                                    </Col>
                                    <Col {...col4}>
                                        <FormSelect
                                            description={"Barangay"}
                                            rules={[{ required: true, message: 'This Field is required' }]}
                                            initialValue={_.get(data, "emp.barangay")}
                                            name="barangay"
                                            field="barangay"
                                            placeholder="Barangay"
                                            loading={loadingAddress}
                                            list={_.get(addressData, "barangay", [])}
                                        />
                                    </Col>
                                    <Col {...col4}>
                                        <FormInput description={"Postal / Zip code"}
                                            name="zipCode"
                                            initialValue={_.get(data, "emp.zipCode")}
                                            placeholder="Postal / Zip code" />
                                    </Col>
                                    {/* 6th Row */}
                                    <Divider>Employee Contact Information and Office Designation</Divider>
                                    <Col {...col3}>
                                        <FormInput description={"Telephone No."}
                                            initialValue={_.get(data, "emp.employeeTelNo")}
                                            name="employeeTelNo"
                                            placeholder="Telephone No." />
                                    </Col>
                                    <Col {...col3}>
                                        <FormInput description={"Mobile No."}
                                            initialValue={_.get(data, "emp.employeeCelNo")}
                                            name="employeeCelNo"
                                            placeholder="Mobile No." />
                                    </Col>
                                    <Col {...col3}>
                                        <FormSelect
                                            loading={loading}
                                            description={"Assigned Office"}
                                            initialValue={_.get(data, "emp.office.id")}
                                            rules={[{ required: true, message: 'This Field is required' }]}
                                            name="office"
                                            field="office"
                                            placeholder="Assigned Office"
                                            list={_.get(data, "office", [])}
                                        />
                                    </Col>
                                    {/* 7th Row */}
                                    <Divider>Employee Details</Divider>
                                    <Col {...col3}>
                                        <FormInput description={"PhilHealth #"}
                                            initialValue={_.get(data, "emp.philhealthNo")}
                                            name="philhealthNo"
                                            placeholder="PhilHealth #" />

                                    </Col>
                                    <Col {...col3}>
                                        <FormInput description={"SSS #"}
                                            initialValue={_.get(data, "emp.sssNo")}
                                            name="sssNo"
                                            placeholder="SSS #" />
                                    </Col>
                                    <Col {...col3}>
                                        <FormInput description={"Tin #"}
                                            initialValue={_.get(data, "emp.tinNo")}
                                            name="tinNo"
                                            placeholder="Tin #" />
                                    </Col>
                                    {/* 8th Row */}
                                    <Col {...col3}>
                                        <FormInput description={"Pag-Ibig #"}
                                            initialValue={_.get(data, "emp.pagIbigId")}
                                            name="pagIbigId"
                                            placeholder="Pag-Ibig #" />
                                    </Col>
                                    <Col {...col3}>
                                        <FormInput description={"Blood Type"}
                                            initialValue={_.get(data, "emp.bloodType")}
                                            name="bloodType"
                                            placeholder="Blood Type" />
                                    </Col>
                                    <Col {...col3}>
                                        <FormInput description={"Basic Salary"}
                                            initialValue={_.get(data, "emp.basicSalary")}
                                            type="number"
                                            name="basicSalary"
                                            placeholder="Basic Salary" />
                                    </Col>
                                    {/* 9th Row */}
                                    <Divider>In Case of Emergency</Divider>
                                    <Col {...col2}>
                                        <FormInput description={"Name"}
                                            initialValue={_.get(data, "emp.emergencyContactName")}
                                            name="emergencyContactName"
                                            placeholder="Name" />
                                    </Col>
                                    <Col {...col2}>
                                        <FormInput description={"Adress"}
                                            initialValue={_.get(data, "emp.emergencyContactAddress")}
                                            name="emergencyContactAddress"
                                            placeholder="Postal / Zip code" />
                                    </Col>
                                    {/* 10th Row */}
                                    <Col {...col2}>
                                        <FormInput description={"Relationship"}
                                            initialValue={_.get(data, "emp.emergencyContactRelationship")}
                                            name="emergencyContactRelationship"
                                            placeholder="Relationship" />
                                    </Col>
                                    <Col {...col2}>
                                        <FormInput description={"Contact No."}
                                            initialValue={_.get(data, "emp.emergencyContactNo")}
                                            name="emergencyContactNo"
                                            placeholder="Contact No." />
                                    </Col>
                                    {/* 11th Row */}
                                    {!_.isEmpty(id) && (
                                        <>
                                            <Divider>User Credentials</Divider>
                                            {_.isEmpty(_.get(data, "emp.user")) ? (
                                                <Col {...col3}>
                                                    <FormInput description={"Username"}
                                                        name="login"
                                                        rules={[{ required: true, message: 'This Field is required' }]}
                                                        placeholder="username (e.g jdcruz)" />
                                                </Col>
                                            ) : (
                                                <Col {...col2}>
                                                    <FormInput description={"Username"}
                                                        name="login"
                                                        disabled
                                                        initialValue={_.get(data, "emp.user.login")}
                                                        rules={[{ required: true, message: 'This Field is required' }]}
                                                        placeholder="username (e.g jdcruz)" />
                                                </Col>
                                            )}


                                            {_.isEmpty(_.get(data, "emp.user")) ? (
                                                <Col {...col3}>
                                                    <FormInput description={"Password"}
                                                        rules={[{ required: true, message: 'This Field is required' }]}
                                                        type="password"
                                                        name="password"
                                                        placeholder="Password" />
                                                </Col>
                                            ) : (
                                                <Col {...col2}>
                                                    <FormInput description={"Password"}
                                                        rules={[{ required: true, message: 'This Field is required' }]}
                                                        disabled
                                                        type="password"
                                                        name="password"
                                                        initialValue={_.get(data, "emp.user.password")}
                                                        placeholder="Password" />
                                                </Col>
                                            )}

                                            {_.isEmpty(_.get(data, "emp.user")) && (
                                                <Col {...col3}>
                                                    <FormInput description={"Confirm Password"}
                                                        type="password"
                                                        name="confirmPassword"
                                                        placeholder="Confirm Password" />
                                                </Col>
                                            )}
                                            {/* 12th Row */}
                                            <Col {...col2}>
                                                <FormSelect
                                                    description={"Roles"}
                                                    name="authorities"
                                                    field="authorities"
                                                    mode="multiple"
                                                    placeholder="Roles"
                                                    initialValue={_.get(data, "emp.user.roles")}
                                                    list={_.get(data, "authorities", [])}
                                                />
                                            </Col>
                                            <Col {...col2}>
                                                <FormSelect
                                                    description={"Permissions"}
                                                    name="permissions"
                                                    field="permissions"
                                                    mode="multiple"
                                                    placeholder="Permissions"
                                                    initialValue={_.get(data, "emp.user.access")}
                                                    list={_.get(data, "permissions", [])}
                                                />
                                            </Col>
                                        </>
                                    )}
                                    {/* button */}
                                    <Col span={24}>
                                        <FormBtnSubmit type="primary"
                                            block loading={upsertLoading}
                                            id="app.form.saveEmployee" />
                                        {!_.isEmpty(_.get(data, "emp.user")) && (
                                            <FormBtn type="danger"
                                                block loading={changePasswordLoading}
                                                onClick={() => {
                                                    changePassword(_.get(data, 'emp.user.login'));
                                                }}
                                                id="app.form.resetpassword" />
                                        )}
                                    </Col>
                                </Row>
                            </MyForm>
                        )}
                </Card>
            </Col>
        </Row>
    );
};

export default (EmployeeForm);
