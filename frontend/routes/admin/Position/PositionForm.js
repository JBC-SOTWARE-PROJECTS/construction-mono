import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import FormCheckbox from "../../../util/customForms/formCheckbox";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";


const UPSERT_RECORD = gql`
 mutation($id: UUID, $fields: Map_String_ObjectScalar) {
     upsert: upsertPosition(id: $id, fields: $fields) {
         id
	}
}`;

const PositionForm = ({ visible, hide, ...props }) => {

    const [formError, setFormError] = useState({});
    {/* error = { errorTitle: "", errorMsg: ""}*/ }

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                if (props?.id) {
                    hide("Position Information Updated")
                } else {
                    hide("Position Information Added")
                }
            }
        }
    });

    //======================= =================== =================================================//

    const onSubmit = (data) => {
        console.log("User data => ", data)
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
            title={"Position Information"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button form="positionForm" key="submit" htmlType="submit" type="primary" loading={upsertLoading}>
                    Submit
                </Button>,
            ]}
        >
            <MyForm
                name="positionForm"
                id="positionForm"
                error={formError}
                onFinish={onSubmit}
                className="form-card"
            >
                <Row>
                    <Col span={24}>
                        <FormInput description={"Position Code"}
                            name="code"
                            initialValue={props?.code}
                            placeholder="Position Code" disabled />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"Position Description"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="description"
                            initialValue={props?.description}
                            placeholder="Position Description" />
                    </Col>
                    <Col span={24}>
                        <FormCheckbox description={"Set as Active"}
                            name="status"
                            valuePropName="checked"
                            initialValue={props?.status}
                            field="status" />
                    </Col>
                </Row>
            </MyForm>
        </CModal>
    );
};

export default (PositionForm);
