import React, { useState } from "react";
import { Col, Row, Button, message, Form } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import moment from "moment";


const UPSERT_RECORD = gql`
	mutation($customer: String, $dateTrans: Instant) {
		upsert: addOTC(customer: $customer, dateTrans: $dateTrans) {
			id
		}
	}
`;

const AddOTC = ({ visible, hide, ...props }) => {

    const [formError, setFormError] = useState({});
    const [form] = Form.useForm();
    {/* error = { errorTitle: "", errorMsg: ""}*/ }
    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                hide("OTC Transaction Added")
            }
        }
    });
    //======================= =================== =================================================//

    const onSubmit = (data) => {
        console.log(data)
        upsertRecord({
            variables: {
                customer: data?.otcName,
                dateTrans: data?.dateTrans
            }
        })
    }


    return (
        <CModal
            width={"30%"}
            title={"ADD OTC TRANSACTION"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button form="otcForm" key="submit" htmlType="submit" type="primary" loading={upsertLoading}>
                    Submit
                </Button>,
            ]}
        >
            <MyForm
                name="otcForm"
                id="otcForm"
                form={form}
                error={formError}
                onFinish={onSubmit}
                className="form-card"
            >
                <Row>
                    <Col span={24}>
                        <FormInput description={"Bill No"}
                            name="billNo"
                            placeholder="AUTO GENERATE" disabled />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"Transaction Date"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            initialValue={moment(new Date())}
                            name="dateTrans"
                            type="datepicker"
                            placeholder="Transaction Date" />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"Customer Fullname"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="otcName"
                            placeholder="Customer Fullname" />
                    </Col>
                </Row>
            </MyForm>
        </CModal>
    );
};

export default (AddOTC);
