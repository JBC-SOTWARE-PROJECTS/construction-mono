import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";



const UPSERT_RECORD = gql`
 mutation($id: UUID, $remarks: String) {
     upsert: addRemarks(id: $id, remarks: $remarks) {
		id
	}
}`;



const RemarksForm = ({ visible, hide, ...props }) => {

    const [formError, setFormError] = useState({});

    {/* error = { errorTitle: "", errorMsg: ""}*/ }

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                hide("Remarks Saved Successfully")
            }
        }
    });

    //======================= =================== =================================================//

    const onSubmit = (data) => {
        upsertRecord({
            variables: {
                id: props?.id,
                remarks: data?.remarks
            }
        })
    }

    return (
        <CModal
            width={"50%"}
            title={"Remarks"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button form="remarksForm" key="submit" htmlType="submit" type="primary" loading={upsertLoading}>
                    Submit
                </Button>,
            ]}
        >
            <MyForm
                name="remarksForm"
                id="remarksForm"
                error={formError}
                onFinish={onSubmit}
                className="form-card"
            >
                <Row>
                    <Col span={24}>
                        <FormInput description={"Remarks"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            type="textarea"
                            name="remarks"
                            initialValue={props?.remarks}
                            placeholder="Remarks" />
                    </Col>
                </Row>
            </MyForm>
        </CModal>
    );
};

export default (RemarksForm);
