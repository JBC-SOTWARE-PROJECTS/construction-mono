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
     upsert: upsertSignature(id: $id, fields: $fields) {
         id
	}
}`;

const SignatureForm = ({ visible, hide, ...props }) => {

    const [formError, setFormError] = useState({});
    const [state, setState] = useState({
        current: false
    });
    {/* error = { errorTitle: "", errorMsg: ""}*/ }

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                if (props?.id) {
                    hide("Signature Information Updated")
                } else {
                    hide("Signature Information Added")
                }
            }
        }
    });

    //======================= =================== =================================================//

    const onSubmit = (data) => {
        let payload = _.clone(data);
        payload.signatureType = props.type;
        if (props?.id) {
            payload.signatureType = props.signatureType;
        }

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
            title={"Signature Information"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button form="signatureForm" key="submit" htmlType="submit" type="primary" loading={upsertLoading}>
                    Submit
                </Button>,
            ]}
        >
            <MyForm
                name="signatureForm"
                id="signatureForm"
                error={formError}
                onFinish={onSubmit}
                className="form-card"
            >
                <Row>
                    <Col span={24}>
                        <FormInput description={"Sequence"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            type="number"
                            name="sequence"
                            initialValue={props?.sequence}
                            placeholder="Sequence" />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"Signature Header"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="signatureHeader"
                            initialValue={props?.signatureHeader}
                            placeholder="Signature Header" />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"Signaturies"}
                            name="signaturePerson"
                            initialValue={props?.signaturePerson}
                            placeholder="Signaturies" disabled={state.current} />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"Position/Designation"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="signaturePosition"
                            initialValue={props?.signaturePosition}
                            placeholder="Position/Designation" />
                    </Col>
                    <Col span={24}>
                        <FormCheckbox description={"is Current user ?"}
                            name="currentUsers"
                            valuePropName="checked"
                            initialValue={props?.currentUsers || false}
                            onChange={(e) => {
                                // console.log("e => ", e)
                                setState({ ...state, current: e?.target?.checked })
                            }}
                            field="currentUsers" />
                    </Col>
                </Row>
            </MyForm>
        </CModal>
    );
};

export default (SignatureForm);
