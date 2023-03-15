import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import CModal from "../../../../app/components/common/CModal";
import FormCheckbox from "../../../../util/customForms/formCheckbox";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";



const UPSERT_RECORD = gql`
 mutation($id: UUID, $fields: Map_String_ObjectScalar) {
     upsert: upsertGenerics(id: $id, fields: $fields) {
         id
	}
}`;

const GenericForm = ({ visible, hide, ...props }) => {

    const [formError, setFormError] = useState({});
    {/* error = { errorTitle: "", errorMsg: ""}*/ }

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                if (props?.id) {
                    hide("Generics Information Updated")
                } else {
                    hide("Generics Information Added")
                }
            }
        }
    });

    //======================= =================== =================================================//

    const onSubmit = (data) => {
        upsertRecord({
            variables: {
                id: props?.id,
                fields: data
            }
        })
    }

    return (
        <CModal
            width={"30%"}
            title={"Generics Information"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button form="genericsForm" key="submit" htmlType="submit" type="primary" loading={upsertLoading}>
                    Submit
                </Button>,
            ]}
        >
            <MyForm
                name="genericsForm"
                id="genericsForm"
                error={formError}
                onFinish={onSubmit}
                className="form-card"
            >
                <Row>
                    <Col span={24}>
                        <FormInput description={"Generic Code"}
                            name="genericCode"
                            initialValue={props?.genericCode}
                            placeholder="Generic Code" disabled />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"Generic Description"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="genericDescription"
                            initialValue={props?.genericDescription}
                            placeholder="Generic Description" />
                    </Col>
                    <Col span={24}>
                        <FormCheckbox description={"Set as Active"}
                            name="isActive"
                            valuePropName="checked"
                            initialValue={props?.isActive}
                            field="status" />
                    </Col>
                </Row>
            </MyForm>
        </CModal>
    );
};

export default (GenericForm);
