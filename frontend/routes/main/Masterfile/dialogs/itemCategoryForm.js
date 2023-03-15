import React, { useState } from "react";
import { Col, Row, Button } from "antd";
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import FormSelect from "../../../../util/customForms/formSelect";
import CModal from "../../../../app/components/common/CModal";
import FormCheckbox from "../../../../util/customForms/formCheckbox";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";


const GET_RECORDS = gql`
{
    list: itemGroupActive {
        value: id
        label: itemDescription
    }
}`;

const UPSERT_RECORD = gql`
 mutation($id: UUID, $fields: Map_String_ObjectScalar) {
     upsert: upsertItemCategory(id: $id, fields: $fields) {
         id
	}
}`;

const ItemCategoryForm = ({ visible, hide, ...props }) => {

    const [formError, setFormError] = useState({});
    {/* error = { errorTitle: "", errorMsg: ""}*/ }

    const { loading, data } = useQuery(GET_RECORDS);

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                if (props?.id) {
                    hide("Item Category Information Updated")
                } else {
                    hide("Item Category Information Added")
                }
            }
        }
    });

    //======================= =================== =================================================//

    const onSubmit = (data) => {
        let payload = _.clone(data)
        payload.itemGroup = { id: data.itemGroup }
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
            title={"Item Category Information"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button form="itemcategoryForm" key="submit" htmlType="submit" type="primary" loading={upsertLoading}>
                    Submit
                </Button>,
            ]}
        >
            <MyForm
                name="itemcategoryForm"
                id="itemcategoryForm"
                error={formError}
                onFinish={onSubmit}
                className="form-card"
            >
                <Row>
                    <Col span={24}>
                        <FormInput description={"Item Category Code"}
                            name="categoryCode"
                            initialValue={props?.categoryCode}
                            placeholder="Item Category Code" disabled />
                    </Col>
                    <Col span={24}>
                        <FormInput description={"Item Category Description"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="categoryDescription"
                            initialValue={props?.categoryDescription}
                            placeholder="Item Category Description" />
                    </Col>
                    <Col span={24}>
                        <FormSelect
                            description={"Item Group"}
                            loading={loading}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            initialValue={props?.itemGroup?.id}
                            name="itemGroup"
                            field="itemGroup"
                            placeholder="Item Group"
                            list={_.get(data, "list")}
                        />
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

export default (ItemCategoryForm);
