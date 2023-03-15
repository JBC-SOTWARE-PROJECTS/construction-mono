import React, { useState } from "react";
import { Col, Row, Button, Divider, Form, Skeleton } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import FormSelect from "../../../util/customForms/formSelect";
import CModal from "../../../app/components/common/CModal";
import FormCheckbox from "../../../util/customForms/formCheckbox";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col2, SERVICE_TYPE } from "../../../shared/constant";
import _ from "lodash";



const UPSERT_RECORD = gql`
 mutation($id: UUID, $fields: Map_String_ObjectScalar) {
     upsert: upsertService(id: $id, fields: $fields) {
         id
	}
}`;

const GET_RECORDS = gql`{
    offices: activeOffices
    {
        value: id
		label: officeDescription
    }

}`;

const ServiceForm = ({ visible, hide, ...props }) => {

    const [formError, setFormError] = useState({});
    {/* error = { errorTitle: "", errorMsg: ""}*/ }
    const { loading, data } = useQuery(GET_RECORDS, {
        fetchPolicy: 'network-only',
    });

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                if (props?.id) {
                    hide("Service Information Updated")
                } else {
                    hide("Service Information Added")
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
            width={"60%"}
            title={"Service Information"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button form="serviceCode" key="submit" htmlType="submit" type="primary" loading={upsertLoading}>
                    Submit
                </Button>,
            ]}
        >
            <MyForm
                name="serviceCode"
                id="serviceCode"
                error={formError}
                onFinish={onSubmit}
                className="form-card"
            >
                <Row>
                    <Col {...col2}>
                        <FormInput description={"Service Code"}
                            name="code"
                            initialValue={props?.code}
                            placeholder="Service Code" disabled />
                    </Col>
                    <Col {...col2}>
                        <FormSelect
                            description={"Service Type"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            initialValue={props?.type}
                            name="type"
                            field="type"
                            placeholder="Service Type"
                            list={SERVICE_TYPE}
                        />
                    </Col>
                    {/*  */}
                    <Col {...col2}>
                        <FormInput description={"Description"}
                            name="description"
                            rules={[{ required: true, message: 'This Field is required' }]}
                            initialValue={_.toUpper(props?.description)}
                            placeholder="Description" />
                    </Col>
                    <Col {...col2}>
                        <FormSelect
                            description={"Office"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            initialValue={props?.office?.id}
                            loading={loading}
                            name="office"
                            field="office"
                            placeholder="Office"
                            list={_.get(data, "offices")}
                        />
                    </Col>
                    {/*  */}
                    <Col span={24}>
                        <Divider>Cost / Price Config</Divider>
                    </Col>
                    <Col {...col2}>

                        <FormInput description={"Price"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            type="number"
                            name="cost"
                            formatter={value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            initialValue={props?.cost}
                            placeholder="Price" />
                    </Col>
                    <Col {...col2}>
                        <FormInput description={"Governtment Price"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            type="number"
                            name="govCost"
                            formatter={value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            initialValue={props?.govCost}
                            placeholder="Governtment Price" />
                    </Col>
                    <Col span={24}>
                        <FormCheckbox description={"Available"}
                            name="available"
                            valuePropName="checked"
                            initialValue={props?.available}
                            field="available" />
                    </Col>
                </Row>
            </MyForm>
        </CModal>
    );
};

export default (ServiceForm);
