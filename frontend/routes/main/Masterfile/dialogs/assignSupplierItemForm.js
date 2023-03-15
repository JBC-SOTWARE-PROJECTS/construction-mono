import React, { useState } from "react";
import { Col, Row, Button, Table, message, InputNumber, Modal } from "antd";
import MyForm from "../../../../util/customForms/myForm";
import FormSelect from "../../../../util/customForms/formSelect";
import FormInput from "../../../../util/customForms/formInput";
import CModal from "../../../../app/components/common/CModal";
import FormBtnSubmit from "../../../../util/customForms/formBtnSubmit";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import { col4, col2 } from "../../../../shared/constant";
import { DeleteFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import ColTitlePopUp from '../../../../app/components/common/ColTitlePopUp';
import numeral from "numeral";


const { confirm } = Modal;

const GET_RECORDS = gql`
query($id: UUID) {
    offices: supplierActive {
        value: id
        label: supplierFullname
    }
    list: allSupplierByItem (id: $id){
        id
        supplier {
            id
            supplierFullname
        }
        cost
    }
}`;

const UPSERT_RECORD = gql`
 mutation($fields : Map_String_ObjectScalar, $itemId : UUID, $supId : UUID, $id: UUID) {
     upsert: upsertSupplierItem(fields : $fields, itemId : $itemId, supId : $supId, id: $id) {
         id
	}
}`;

const DELETE_RECORD = gql`
 mutation($id:UUID) {
    removeItemSupplier(id:$id){
        id
    }
  }
`;

const AssignSupplierItemForm = ({ visible, hide, ...props }) => {

    const [formError, setFormError] = useState({});
    {/* error = { errorTitle: "", errorMsg: ""}*/ }
    const [editable, setEditable] = useState({})
    const [state, setState] = useState({ loading: false })

    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        variables: {
            id: props?.id,
        },
        fetchPolicy: 'network-only',
    });

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                message.success("Success");
                refetch({
                    id: props?.id,
                })
            }
            if (_.isEmpty(data?.upsert)) {
                message.error("Item is already assigned on this Supplier. Please try again.");
                refetch({
                    id: props?.id,
                })
            }
            setState({ ...state, loading: false })
        }
    });

    const [removeRecord, { loading: removeLoading }] = useMutation(DELETE_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data)) {
                message.success("Supplier Removed");
                refetch({
                    id: props?.id,
                })
            }
        }
    });

    //======================= =================== =================================================//

    const onSubmit = (data) => { // insert
        setState({ ...state, loading: true })
        let payload = _.clone(data);
        payload.supplier = { id: data?.supplier }
        payload.item = { id: props?.id }
        upsertRecord({
            variables: {
                fields: payload,
                itemId: props?.id,
                supId: data?.supplier,
                id: null,
            }
        })
    }

    const onChangeUnitCost = (record, newValue) => { // update
        let payload = _.clone(record);
        payload.supplier = { id: record?.supplier?.id }
        payload.item = { id: props?.id }
        payload.cost = newValue

        upsertRecord({
            variables: {
                fields: payload,
                itemId: props?.id,
                supId: record?.supplier?.id,
                id: record?.id,
            }
        })
    }

    const _delete = (id) => {
        confirm({
            title: 'Do you want to delete these supplier?',
            icon: <ExclamationCircleOutlined />,
            content: 'Please click ok to proceed.',
            onOk() {
                removeRecord({
                    variables: {
                        id: id,
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }


    const columns = [{
        title: 'Supplier',
        dataIndex: 'supplier.supplierFullname',
        key: 'supplier.supplierFullname',
        render: (text, record) => (
            <span>{record.supplier.supplierFullname}</span>
        )
    },
    {
        title: <ColTitlePopUp descripton="Unit Cost (UoU)" popup="Unit of Usage" editable="true" />,
        dataIndex: 'cost',
        key: 'cost',
        onCell: (e, colIndex) => {
            return {
                onDoubleClick: event => {
                    setEditable({ ...editable, [e.id]: true })
                }, // double click row
            };
        },
        render: (text, record) => {
            return editable[record.id] ? (
                <InputNumber
                    defaultValue={record.cost}
                    autoFocus
                    onBlur={(e) => {
                        let newValue = e?.target?.value;
                        onChangeUnitCost(record, newValue);
                        setEditable({ ...editable, [record.id]: false })
                    }}
                    style={{ width: 150 }}
                />
            ) : (
                <span>{numeral(record.cost).format('0,0.00') + ' per ' + props?.unit_of_usage?.unitDescription}</span>
            )

        }
    },
    {
        title: '#',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
            <Button
                type="danger"
                size="small"
                onClick={() => {
                    _delete(record?.id)
                }}
                icon={<DeleteFilled />}
            />
        )
    }];

    return (
        <CModal
            width={"70%"}
            title={"Assign Supplier to Item"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide("reload")} type="danger">
                    Return
                </Button>
            ]}
        >
            <MyForm
                name="assignSupplierItemForm"
                id="assignSupplierItemForm"
                error={formError}
                onFinish={onSubmit}
                className="form-card"
            >
                <Row>
                    <Col {...col2}>
                        <FormSelect
                            description={"Select Supplier to Assign"}
                            loading={loading}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="supplier"
                            field="supplier"
                            placeholder="Select Supplier to Assign"
                            list={_.get(data, "offices")}
                        />
                    </Col>
                    <Col {...col4}>
                        <FormInput description={"Unit Cost (UoU)"}
                            rules={[{ required: true, message: 'This Field is required' }]}
                            name="cost"
                            type="number"
                            placeholder="Unit Cost (UoU)" />
                    </Col>
                    <Col {...col4}>
                        <FormBtnSubmit
                            type="primary"
                            block loading={state.loading}
                            id="app.form.assign"
                            style={{ marginTop: 17 }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table
                            loading={loading || removeLoading || upsertLoading}
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

export default (AssignSupplierItemForm);
