import React, { useState } from 'react';
import { Card, Row, Col, Skeleton, message } from 'antd';
import MyForm from '../../../util/customForms/myForm';
import FormInput from '../../../util/customForms/formInput';
import FormBtnSubmit from "../../../util/customForms/formBtnSubmit";
import { col3 } from '../../../shared/constant';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";


//graphQL Queries
const GET_RECORDS = gql`{
    com: comById {
        id
        companyName
        vatRate
        markup
        govMarkup
    }
}`;

const UPSERT_RECORD = gql`
 mutation($fields: Map_String_ObjectScalar) {
     upsert: upsertCompany(fields: $fields) {
         id
	}
}`;


const CompanyContent = ({ account }) => {

    const [formError, setFormError] = useState({});
    {/* error = { errorTitle: "", errorMsg: ""}*/ }

    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        fetchPolicy: 'network-only',
    });

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                message.success("Company Settings Updated")
                refetch()
            }
        }
    });
    //======================= =================== =================================================//

    const onSubmit = (data) => {
        console.log("company data => ", data)
        upsertRecord({
            variables: {
                fields: data
            }
        })
    }

    return (
        <Card title="Company Settings" size="small">
            {loading ? (<Skeleton active />) : (
                <MyForm
                    name="companyForm"
                    id="companyForm"
                    error={formError}
                    onFinish={onSubmit}
                >
                    <Row className="pd-10">
                        <Col span={24}>
                            <FormInput description={"Company Name"}
                                rules={[{ required: true, message: 'This Field is required' }]}
                                name="companyName"
                                initialValue={_.get(data, "com.companyName")}
                                placeholder="Company Name" />
                        </Col>
                        <Col {...col3}>
                            <FormInput description={"Vat Rate (%)"}
                                rules={[{ required: true, message: 'This Field is required' }]}
                                name="vatRate"
                                type="number"
                                initialValue={_.get(data, "com.vatRate")}
                                placeholder="Vat Rate (%)" />
                        </Col>
                        <Col {...col3}>
                            <FormInput description={"Normal Markup (%)"}
                                rules={[{ required: true, message: 'This Field is required' }]}
                                name="markup"
                                type="number"
                                initialValue={_.get(data, "com.markup")}
                                placeholder="Normal Markup (%)" />
                        </Col>
                        <Col {...col3}>
                            <FormInput description={"Government Markup (%)"}
                                rules={[{ required: true, message: 'This Field is required' }]}
                                name="govMarkup"
                                type="number"
                                initialValue={_.get(data, "com.govMarkup")}
                                placeholder="Government Markup (%)" />
                        </Col>
                        <Col span={24}>
                            <FormBtnSubmit type="primary"
                                block loading={upsertLoading}
                                id="app.form.saveComSettings" />
                        </Col>
                    </Row>
                </MyForm>
            )}
        </Card>
    )
};

export default CompanyContent;
