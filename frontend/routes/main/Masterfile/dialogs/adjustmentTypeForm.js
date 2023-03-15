import React, { useState } from "react";
import { Col, Row, Button, Alert } from "antd";
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import CModal from "../../../../app/components/common/CModal";
import FormCheckbox from "../../../../util/customForms/formCheckbox";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";



const UPSERT_RECORD = gql`
 mutation($id: UUID, $fields: Map_String_ObjectScalar) {
     upsert: upsertQuantityAdjustmentType(id: $id, fields: $fields) {
         id
	}
}`;

const AdjustmentTypeForm = ({ visible, hide, ...props }) => {

    const [formError, setFormError] = useState({});
    {/* error = { errorTitle: "", errorMsg: ""}*/ }

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                if (props?.id) {
                    hide("Adjustment Type Information Updated")
                } else {
                    hide("Adjustment Type Information Added")
                }
            }
        }
    });

    //======================= =================== =================================================//

    const onSubmit = (data) => {
        let payload = _.clone(data)
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
            title={"Adjustment Type Information"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button form="atForm" key="submit" htmlType="submit" type="primary" loading={upsertLoading}>
                    Submit
                </Button>,
            ]}
        >
            <MyForm
                name="atForm"
                id="atForm"
                error={formError}
                onFinish={onSubmit}
                className="form-card"
            >
                <Row>
                    <Col span={24}>
                        <Alert message="Use underscore ( _ ) if you want separate words in flag value. Don't use space." type="info" showIcon />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"Adjustment Type Description"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="description"
                            initialValue={props?.description}
                            placeholder="Adjustment Type Description" />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"Flag Value"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="flagValue"
                            initialValue={props?.flagValue}
                            placeholder="Flag Value" />
                    </Col>
                    <Col span={24}>
                        <FormCheckbox description={"Set as Active"}
                            name="is_active"
                            valuePropName="checked"
                            initialValue={props?.is_active}
                            field="status" />
                    </Col>
                </Row>
            </MyForm>
        </CModal>
    );
};

export default (AdjustmentTypeForm);
