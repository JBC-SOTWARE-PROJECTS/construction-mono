import React, { useState } from "react";
import { Col, Row, Button, Table, message, Checkbox } from "antd";
import MyForm from "../../../../util/customForms/myForm";
import FormSelect from "../../../../util/customForms/formSelect";
import CModal from "../../../../app/components/common/CModal";
import FormBtnSubmit from "../../../../util/customForms/formBtnSubmit";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import { col4, col18 } from "../../../../shared/constant";


const GET_RECORDS = gql`
query($id: UUID) {
    offices: activeOffices {
        value: id
        label: officeDescription
    }
    list: officeListByItem (id: $id){
        id
        office{
            id
            officeDescription
        }
        allow_trade
        is_assign
    }
}`;

const UPSERT_RECORD = gql`
 mutation($depId : UUID, $itemId : UUID, $trade : Boolean, $assign : Boolean, $id: UUID) {
     upsert: upsertOfficeItem(depId : $depId, itemId : $itemId, trade : $trade, assign : $assign, id: $id) {
         id
	}
}`;

const AssignItemForm = ({ visible, hide, ...props }) => {

    const [formError, setFormError] = useState({});
    {/* error = { errorTitle: "", errorMsg: ""}*/ }

    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        variables: {
            id: props?.id,
        },
        fetchPolicy: 'network-only',
    });

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            console.log("submit => ", data)
            if (!_.isEmpty(data?.upsert?.id)) {
                message.success("Success");
                refetch({
                    id: props?.id,
                })
            }
            if (_.isEmpty(data?.upsert)) {
                message.error("Item is already assigned on this office. Please try again.");
                refetch({
                    id: props?.id,
                })
            }
        }
    });

    //======================= =================== =================================================//

    const onSubmit = (data) => { // insert
        upsertRecord({
            variables: {
                depId: data.office,
                itemId: props?.id,
                trade: true,
                assign: true,
                id: null,
            }
        })
    }

    const updateTradeAssign = (record, trade, assign) => { // update
        console.log(record)
        upsertRecord({
            variables: {
                depId: record?.office?.id,
                itemId: props?.id,
                trade: trade,
                assign: assign,
                id: record?.id,
            }
        })
    }


    const columns = [{
        title: 'Office',
        dataIndex: 'office.officeDescription',
        key: 'office.officeDescription',
        render: (text, record) => (
            <span>{record.office.officeDescription}</span>
        )
    },
    {
        title: 'Tradable',
        dataIndex: 'allow_trade',
        key: 'allow_trade',
        render: (text, record) => (
            <Checkbox
                key={record?.id + "allow_trade"}
                defaultChecked={record.allow_trade}
                onChange={(e) => {
                    updateTradeAssign(record, e?.target?.checked, record.is_assign)
                }}
            />
        )
    },
    {
        title: 'Assigned',
        dataIndex: 'is_assign',
        key: 'is_assign',
        render: (text, record) => (
            <Checkbox
                key={record?.id + "is_assign"}
                defaultChecked={record.is_assign}
                onChange={(e) => {
                    updateTradeAssign(record, record.allow_trade, e?.target?.checked)
                }}
            />
        )
    }];

    return (
        <CModal
            width={"50%"}
            title={"Assign Item to Offices"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide("reload")} type="danger">
                    Return
                </Button>
            ]}
        >
            <MyForm
                name="assignItemForm"
                id="assignItemForm"
                error={formError}
                onFinish={onSubmit}
                className="form-card"
            >
                <Row>
                    <Col {...col18}>
                        <FormSelect
                            description={"Select Office to Assign"}
                            loading={loading}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="office"
                            field="office"
                            placeholder="Select Office to Assign"
                            list={_.get(data, "offices")}
                        />
                    </Col>
                    <Col {...col4}>
                        <FormBtnSubmit
                            type="primary"
                            block loading={upsertLoading}
                            id="app.form.assign"
                            style={{ marginTop: 17 }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table
                            loading={loading}
                            className="gx-table-responsive"
                            columns={columns}
                            dataSource={_.get(data, "list", [])}
                            rowKey={record => record.id}
                            size="small"
                        />
                    </Col>
                </Row>
            </MyForm>
        </CModal>
    );
};

export default (AssignItemForm);
