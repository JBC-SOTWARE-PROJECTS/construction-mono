import React, { useState } from "react";
import { Col, Row, Button, message } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";


const UPSERT_RECORD = gql`
	mutation(
		$desc: String,
		$amount: BigDecimal,
        $qty: Int,
		$billing: UUID,
        $itemtype: String,
		$type: String
	) {
		upsert: addService(
			desc: $desc,
			amount: $amount,
            qty: $qty,
			billing: $billing,
            itemtype: $itemtype,
			type: $type
		) {
			id
		}
	}
`;

const AddServiceMiscForm = ({ visible, hide, ...props }) => {

    const [formError, setFormError] = useState({});
    {/* error = { errorTitle: "", errorMsg: ""}*/ }
    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                hide("Service Added")
            }
        }
    });
    //======================= =================== =================================================//

    const onSubmit = (data) => {
        if (data?.qty > 0 && data?.cost > 0) {
            upsertRecord({
                variables: {
                    desc: data?.descriptions,
                    amount: data?.cost,
                    qty: data?.qty,
                    billing: props?.id,
                    itemtype: props?.type,
                    type: props?.transType,
                }
            })
        } else {
            message.error("Quantity and Cost must be greater than zero.")
        }
    }

    return (
        <CModal
            width={"30%"}
            title={props?.type === "SERVICE" ? "ADD SERVICE" : "ADD MISC. SERVICE"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button form="miscForm" key="submit" htmlType="submit" type="primary" loading={upsertLoading}>
                    Push To Bill
                </Button>,
            ]}
        >
            <MyForm
                name="miscForm"
                id="miscForm"
                error={formError}
                onFinish={onSubmit}
                className="form-card"
            >
                <Row>
                    <Col span={24}>
                        <FormInput description={"Description"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="descriptions"
                            placeholder="Description" />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"Quantity"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            type="number"
                            name="qty"
                            placeholder="Quantity" />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"Cost"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            type="number"
                            name="cost"
                            placeholder="Cost" />
                    </Col>
                </Row>
            </MyForm>
        </CModal>
    );
};

export default (AddServiceMiscForm);
