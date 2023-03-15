import React, { useState, useContext, useMemo } from "react";
import { AccountContext } from "../../../../app/components/accessControl/AccountContext";
import { Col, Row, Button, Divider, Table, InputNumber, Form, message, Input, Skeleton, Card } from "antd";
import { DeleteFilled, BarcodeOutlined } from '@ant-design/icons';
import MyForm from "../../../../util/customForms/myForm";
import FormInput from "../../../../util/customForms/formInput";
import FormSelect from "../../../../util/customForms/formSelect";
import CModal from "../../../../app/components/common/CModal";
import ColTitlePopUp from '../../../../app/components/common/ColTitlePopUp';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { dialogHook } from "../../../../util/customhooks";
import { gql } from "apollo-boost";
import { col4 } from "../../../../shared/constant";
import numeral from "numeral";
import _ from "lodash";
import moment from "moment";
import update from 'immutability-helper';
import MaterialItems from "../../Inventorydialogs/material";



const GET_RECORDS = gql`
query($id: UUID){
    offices: activeOffices {
        value: id
		label: officeDescription
    }
    items: mpItemByParent(id: $id){
        id
        item {
            id
            descLong
            item_conversion
            vatable
            unit_of_usage{
				id
				unitDescription
			}
        }
        uou
        qty
        unitCost
        type
        isPosted
    }
}`;

const UPSERT_RECORD = gql`
 mutation($fields: Map_String_ObjectScalar, $items: [Map_String_ObjectScalar], $id: UUID) {
     upsert: upsertMP(fields: $fields, items: $items, id: $id) {
         id
	}
}`;

const DELETE_RECORD = gql`
 mutation($id:UUID) {
    removeMpItem(id:$id){
        id
    }
  }
`;

const MPForm = ({ visible, hide, ...props }) => {
    const account = useContext(AccountContext);
    const [formError, setFormError] = useState({});
    {/* error = { errorTitle: "", errorMsg: ""}*/ }
    const [editable, setEditable] = useState({})
    const [items, setItems] = useState([])
    const [form] = Form.useForm();

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
                if (props?.id) {
                    hide("Material Production Information Updated")
                } else {
                    hide("Material Production Information Added")
                }
            }
        }
    });

    const [removeRecord, { loading: removeLoading }] = useMutation(DELETE_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data)) {
                message.success("Item removed");
                refetch({
                    id: props?.id,
                })
            }
        }
    });

    const [modal, showModal] = dialogHook(MaterialItems, (result) => { // item form
        if (!_.isEmpty(result)) { // validate here
            if (_.isEmpty(items)) {
                setItems(result)
            } else { //append
                setItems([...items, ...result])
            }
        }
    });

    //======================= =================== =================================================//

    const onSubmit = (data) => {
        let payload = _.clone(data)
        payload.office = { id: data?.office }
        if (_.isEmpty(props?.id)) {
            payload.producedBy = account
        }
        upsertRecord({
            variables: {
                fields: payload,
                items: items,
                id: props?.id
            }
        })
    }

    const mpItems = (type) => {
        showModal({ show: true, myProps: { items: items, type: type } })
    }

    const onChangeArray = (element, record, newValue) => {
        let payload = _.clone(items);
        let index = _.findIndex(payload, ['id', record?.id]);
        let data = update(payload, {
            [index]: {
                [element]: {
                    $set: element === "remarks" ? newValue : newValue || 0,
                }
            },
        });
        setItems(data);
    }

    const _delete = (record) => {
        let payload = _.clone(items);
        if (record.isNew) { //delete in array 
            _.remove(payload, function (n) {
                return n.id === record.id;
            });
            setItems(payload);
            message.success("Item removed");
        } else { //delete in database
            removeRecord({
                variables: {
                    id: record.id,
                }
            })
        }
    }

    const colInput = (record, el) => {
        if (el === "remarks") {
            return (
                <Input
                    defaultValue={record[el]}
                    // size="small"
                    autoFocus
                    onBlur={(e) => {
                        let newValue = e?.target?.value;
                        onChangeArray(el, record, newValue, 0);
                        setEditable({ ...editable, [record.id + el]: false })
                    }}
                    style={{ width: 150 }}
                />
            )
        } else {
            return (
                <InputNumber
                    defaultValue={record[el]}
                    // size="small"
                    autoFocus
                    onBlur={(e) => {
                        let newValue = e?.target?.value;
                        onChangeArray(el, record, newValue, 0);
                        setEditable({ ...editable, [record.id + el]: false })
                    }}
                    style={{ width: 150 }}
                />
            )
        }

    }

    const columns = [
        {
            title: 'Item Description',
            dataIndex: 'item.descLong',
            key: 'item.descLong',
            render: (text, record) => (
                <span key={text}>{record.item?.descLong}</span>
            )
        },
        {
            title: <ColTitlePopUp descripton="Unit (UoU)" popup="Unit of Usage" />,
            dataIndex: 'uou',
            key: 'uou',
        },
        {
            title: <ColTitlePopUp descripton="Qty (UoU)" popup="Unit of Usage" editable={true} />,
            dataIndex: 'qty',
            key: 'qty',
            onCell: (e) => {
                return {
                    onDoubleClick: () => {
                        if (props?.isPosted || props?.isVoid) {
                            message.error("This Material Production is already posted/voided. Editing is disabled.")
                        } else {
                            setEditable({ ...editable, [e.id + "qty"]: true })
                        }
                    }, // double click row
                };
            },
            render: (text, record) => {
                return editable[record.id + "qty"] ? (
                    colInput(record, "qty")
                ) : (
                    <span key={text}>{numeral(record.qty).format('0,0')}</span>
                )

            }
        },
        {
            title: <ColTitlePopUp descripton="Unit Cost (UoU)" popup="Unit of Usage" editable={true} />,
            dataIndex: 'unitCost',
            key: 'unitCost',
            onCell: (e) => {
                return {
                    onDoubleClick: () => {
                        if (props?.isPosted || props?.isVoid) {
                            message.error("This Material Production is already posted/voided. Editing is disabled.")
                        } else {
                            setEditable({ ...editable, [e.id + "unitCost"]: true })
                        }
                    }, // double click row
                };
            },
            render: (text, record) => {
                return editable[record.id + "unitCost"] ? (
                    colInput(record, "unitCost")
                ) : (
                    <span key={text}>{numeral(record.unitCost).format('0,0.00')}</span>
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
                        _delete(record)
                    }}
                    disabled={props?.isPosted || props?.isVoid}
                    icon={<DeleteFilled />}
                />
            ),
        }
    ];

    //triggers
    useMemo(() => { //use memo to avoid memory leak
        if (props?.id) {
            setItems(_.get(data, "items", []));
        }
    }, [data])


    return (
        <CModal
            allowFullScreen={true}
            title={"Material Production Information"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button form="mpForm" key="submit" htmlType="submit" type="primary" loading={upsertLoading}
                    disabled={_.isEmpty(items) || props?.isPosted || props?.isVoid}>
                    Submit
                </Button>,
            ]}
        >
            {loading ? (<Skeleton active />) : (
                <>
                    <MyForm
                        form={form}
                        name="mpForm"
                        id="mpForm"
                        error={formError}
                        onFinish={onSubmit}
                        className="form-card"
                    >
                        <Row>
                            <Col {...col4}>
                                <FormInput description={"Transaction #"}
                                    name="mpNo"
                                    initialValue={props?.mpNo}
                                    placeholder="Auto Generated" disabled />
                            </Col>
                            <Col {...col4}>
                                <FormInput description={"Date"}
                                    rules={[{ required: true, message: 'This Field is required' }]}
                                    initialValue={moment(props?.dateTransaction)}
                                    name="dateTransaction"
                                    type="datepicker"
                                    placeholder="Date"
                                    disabled={props?.isPosted || props?.isVoid} />
                            </Col>
                            <Col {...col4}>
                                <FormSelect
                                    loading={loading}
                                    description={"Office"}
                                    rules={[{ required: true, message: 'This Field is required' }]}
                                    initialValue={props?.office?.id}
                                    name="office"
                                    field="office"
                                    placeholder="Office"
                                    list={_.get(data, "offices")}
                                    disabled={props?.isPosted || props?.isVoid}
                                />
                            </Col>
                            <Col {...col4}>
                                <FormInput description={"Description"}
                                    rules={[{ required: true, message: 'This Field is required' }]}
                                    name="description"
                                    initialValue={props?.description}
                                    placeholder="Description"
                                    disabled={props?.isPosted || props?.isVoid} />
                            </Col>

                        </Row>
                    </MyForm>
                    <Row>
                        <Col span={24}>
                            <Divider>Transaction Details</Divider>
                        </Col>
                        <Col span={12}>
                            <Card title="Output Product" size="small"
                                extra={
                                    <span>
                                        <Button icon={<BarcodeOutlined />} type="primary" size="small" className="margin-0"
                                            onClick={() => mpItems("output")} disabled={props?.isPosted || props?.isVoid}
                                        >
                                            Add Items
                                        </Button>
                                    </span>
                                }>
                                <Table
                                    loading={loading || removeLoading}
                                    className="gx-table-responsive"
                                    columns={columns}
                                    dataSource={_.filter(items, { 'type': 'output' })}
                                    rowKey={record => record.id}
                                    size="small"
                                    pagination={{
                                        pageSize: 5
                                    }}
                                />
                            </Card>

                        </Col>
                        <Col span={12}>
                            <Card title="Source Items" size="small"
                                extra={
                                    <span>
                                        <Button icon={<BarcodeOutlined />} type="primary" size="small" className="margin-0"
                                            onClick={() => mpItems("source")} disabled={props?.isPosted || props?.isVoid}
                                        >
                                            Add Items
                                        </Button>
                                    </span>
                                }>
                                <Table
                                    loading={loading || removeLoading}
                                    className="gx-table-responsive"
                                    columns={columns}
                                    dataSource={_.filter(items, { 'type': 'source' })}
                                    rowKey={record => record.id}
                                    size="small"
                                    pagination={{
                                        pageSize: 5
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
            {modal}
        </CModal>
    );
};

export default (MPForm);
