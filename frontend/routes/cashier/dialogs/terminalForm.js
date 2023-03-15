import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import FormSelect from "../../../util/customForms/formSelect";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";



const UPSERT_RECORD = gql`
 mutation($id: UUID, $fields: Map_String_ObjectScalar) {
     upsert: addTerminal(id: $id, fields: $fields) {
         id
	}
}`;



const CASHIER = gql`
	query($role: String, $filter: String) {
		cashier: searchEmployeesByRole(role: $role, filter: $filter) {
			value: id
			label: fullName
		}
	}
`;

const TermninalForm = ({ visible, hide, ...props }) => {

    const [formError, setFormError] = useState({});

    const { loading, data } = useQuery(CASHIER, {
        variables: {
            role: "ROLE_CASHIER",
            filter: ""
        },
        fetchPolicy: 'network-only'
    });
    {/* error = { errorTitle: "", errorMsg: ""}*/ }

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                if (props?.id) {
                    hide("Terminal Information Updated")
                } else {
                    hide("Terminal Information Added")
                }
            }
        }
    });

    //======================= =================== =================================================//

    const onSubmit = (data) => {
        let payload = _.clone(data)
        payload.employee = { id: data.employee }
        upsertRecord({
            variables: {
                id: props?.id,
                fields: payload
            }
        })
    }

    return (
        <CModal
            width={"30%"}
            title={"Terminal Information"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button form="terminalForm" key="submit" htmlType="submit" type="primary" loading={upsertLoading}>
                    Submit
                </Button>,
            ]}
        >
            <MyForm
                name="terminalForm"
                id="terminalForm"
                error={formError}
                onFinish={onSubmit}
                className="form-card"
            >
                <Row>
                    <Col span={24}>
                        <FormInput description={"Terminal No"}
                            name="terminal_no"
                            initialValue={props?.terminal_no}
                            placeholder="AUTO GENERATE" disabled />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"Description"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="description"
                            initialValue={props?.description}
                            placeholder="Description" />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"MAC Address"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="mac_address"
                            initialValue={props?.mac_address}
                            placeholder="e.g 48-F1-7F-DB-CC-39" />
                    </Col>
                    <Col span={24}>
                        <FormSelect
                            description={"Assign Cashier"}
                            loading={loading}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            initialValue={props?.employee?.id}
                            name="employee"
                            field="employee"
                            placeholder="Assign Cashier"
                            list={_.get(data, "cashier")}
                        />
                    </Col>
                </Row>
            </MyForm>
        </CModal>
    );
};

export default (TermninalForm);
