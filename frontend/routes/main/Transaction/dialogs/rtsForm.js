import React, { useState, useContext, useMemo } from "react";
import { AccountContext } from "../../../../app/components/accessControl/AccountContext";
import { Col, Row, Button, Divider, Table, InputNumber, Form, message, Input, Skeleton } from "antd";
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
import InventoryBySupplierModal from "../../Inventorydialogs/supplierInventory";



const GET_RECORDS = gql`
query($id: UUID){
    offices: activeOffices {
        value: id
		label: officeDescription
    }
    supplier: supplierActive {
        value: id
		label: supplierFullname
    }
    srr: srrList {
        value: rrNo
		label: rrNo
    }
    items: rtsItemByParent (id: $id){
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
        returnQty
        returnUnitCost
        return_remarks
        isPosted
    }
}`;

const UPSERT_RECORD = gql`
 mutation($fields: Map_String_ObjectScalar, $items: [Map_String_ObjectScalar], $id: UUID) {
     upsert: upsertRTS(fields: $fields, items: $items, id: $id) {
         id
	}
}`;

const DELETE_RECORD = gql`
 mutation($id:UUID) {
    removeRtsItem(id:$id){
        id
    }
  }
`;

const RTSForm = ({ visible, hide, ...props }) => {
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
                    hide("Return Supplier Information Updated")
                } else {
                    hide("Return Supplier Information Added")
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

    const [modal, showModal] = dialogHook(InventoryBySupplierModal, (result) => { // item form
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
        payload.supplier = { id: data?.supplier }
        if (_.isEmpty(props?.id)) {
            payload.returnUser = account?.id
            payload.returnBy = account?.fullName
        }
        console.log(payload)
        console.log("items", items)
        upsertRecord({
            variables: {
                fields: payload,
                items: items,
                id: props?.id
            }
        })
    }

    const returnItems = () => {
        const { getFieldValue } = form
        let supplier = getFieldValue('supplier');
        if (supplier) { //show items with supplier
            showModal({ show: true, myProps: { items: items, type: "RTS", supplier: supplier } })
        } else {
            message.info("Please Select Supplier")
        }
    }

    const onChangeArray = (element, record, newValue) => {
        let payload = _.clone(items);
        let index = _.findIndex(payload, ['id', record?.id]);
        let data = update(payload, {
            [index]: {
                [element]: {
                    $set: element === "return_remarks" ? newValue : newValue || 0,
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
        if (el === "return_remarks") {
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
            title: <ColTitlePopUp descripton="Receiving Unit (UoU)" popup="Unit of Usage" />,
            dataIndex: 'uou',
            key: 'uou',
        },
        {
            title: <ColTitlePopUp descripton="Qty (UoU)" popup="Unit of Usage" editable={true} />,
            dataIndex: 'returnQty',
            key: 'returnQty',
            onCell: (e) => {
                return {
                    onDoubleClick: () => {
                        if (props?.isPosted || props?.isVoid) {
                            message.error("This Return Supplier is already posted/voided. Editing is disabled.")
                        } else {
                            setEditable({ ...editable, [e.id + "returnQty"]: true })
                        }
                    }, // double click row
                };
            },
            render: (text, record) => {
                return editable[record.id + "returnQty"] ? (
                    colInput(record, "returnQty")
                ) : (
                    <span key={text}>{numeral(record.returnQty).format('0,0')}</span>
                )

            }
        },
        {
            title: <ColTitlePopUp descripton="Unit Cost (UoU)" popup="Unit of Usage" editable={true} />,
            dataIndex: 'returnUnitCost',
            key: 'returnUnitCost',
            onCell: (e) => {
                return {
                    onDoubleClick: () => {
                        if (props?.isPosted || props?.isVoid) {
                            message.error("This Return Supplier is already posted/voided. Editing is disabled.")
                        } else {
                            setEditable({ ...editable, [e.id + "returnUnitCost"]: true })
                        }
                    }, // double click row
                };
            },
            render: (text, record) => {
                return editable[record.id + "returnUnitCost"] ? (
                    colInput(record, "returnUnitCost")
                ) : (
                    <span key={text}>{numeral(record.returnUnitCost).format('0,0.00')}</span>
                )

            }
        },
        {
            title: <ColTitlePopUp descripton="Remarks/Notes" editable={true} />,
            dataIndex: 'return_remarks',
            key: 'return_remarks',
            onCell: (e) => {
                return {
                    onDoubleClick: () => {
                        if (props?.isPosted || props?.isVoid) {
                            message.error("This Return Supplier is already posted/voided. Editing is disabled.")
                        } else {
                            setEditable({ ...editable, [e.id + "return_remarks"]: true })
                        }
                    }, // double click row
                };
            },
            render: (text, record) => {
                return editable[record.id + "return_remarks"] ? (
                    colInput(record, "return_remarks")
                ) : (
                    <span key={text}>{record?.return_remarks || 'N/A'}</span>
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
            title={"Returns Supplier Information"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button form="rtsForm" key="submit" htmlType="submit" type="primary" loading={upsertLoading}
                    disabled={_.isEmpty(items) || props?.isPosted || props?.isVoid}>
                    Submit
                </Button>,
            ]}
        >
            {loading ? (<Skeleton active />) : (
                <>
                    <MyForm
                        form={form}
                        name="rtsForm"
                        id="rtsForm"
                        error={formError}
                        onFinish={onSubmit}
                        className="form-card"
                    >
                        <Row>
                            <Col span={3}>
                                <FormInput description={"Return Supplier #"}
                                    name="rtsNo"
                                    initialValue={props?.rtsNo}
                                    placeholder="Auto Generated" disabled />
                            </Col>
                            <Col {...col4}>
                                <FormInput description={"Return Date"}
                                    rules={[{ required: true, message: 'This Field is required' }]}
                                    initialValue={moment(props?.returnDate)}
                                    name="returnDate"
                                    type="datepicker"
                                    placeholder="Return Date"
                                    disabled={props?.isPosted || props?.isVoid} />
                            </Col>
                            <Col {...col4}>
                                <FormSelect
                                    loading={loading}
                                    description={"Reference SRR Number"}
                                    initialValue={props?.refSrr}
                                    name="refSrr"
                                    field="refSrr"
                                    placeholder="Reference SRR Number"
                                    list={_.get(data, "srr")}
                                    disabled={props?.isPosted || props?.isVoid}
                                />
                            </Col>
                            <Col span={5}>
                                <FormInput description={"Reference SI/DR Number"}
                                    name="receivedRefNo"
                                    initialValue={props?.receivedRefNo}
                                    placeholder="Reference SI/DR Number"
                                    disabled={props?.isPosted || props?.isVoid}
                                />
                            </Col>
                            <Col span={4}>
                                <FormInput description={"Reference SI/DR Date"}
                                    rules={[{ required: true, message: 'This Field is required' }]}
                                    initialValue={moment(props?.receivedRefDate)}
                                    name="receivedRefDate"
                                    type="datepicker"
                                    placeholder="Reference SI/DR Date"
                                    disabled={props?.isPosted || props?.isVoid} />
                            </Col>
                            {/*  */}
                            <Col {...col4}>
                                <FormSelect
                                    loading={loading}
                                    description={"Returning Office"}
                                    rules={[{ required: true, message: 'This Field is required' }]}
                                    initialValue={props?.office?.id}
                                    name="office"
                                    field="office"
                                    placeholder="Returning Office"
                                    list={_.get(data, "offices")}
                                    disabled={props?.isPosted || props?.isVoid}
                                />
                            </Col>
                            <Col {...col4}>
                                <FormSelect
                                    loading={loading}
                                    description={"Supplier"}
                                    rules={[{ required: true, message: 'This Field is required' }]}
                                    initialValue={props?.supplier?.id}
                                    name="supplier"
                                    field="supplier"
                                    placeholder="Supplier"
                                    list={_.get(data, "supplier")}
                                    disabled={props?.isPosted || props?.isVoid}
                                />
                            </Col>
                            <Col {...col4}>
                                <FormInput description={"Received By"}
                                    name="received_by"
                                    initialValue={props?.received_by}
                                    placeholder="Requested By"
                                    disabled={props?.isPosted || props?.isVoid}
                                />
                            </Col>
                            <Col {...col4}>
                                <FormInput description={"Return By"}
                                    name="returnBy"
                                    initialValue={props?.id ? props?.returnBy : account?.fullName}
                                    placeholder="Return By" disabled />
                            </Col>
                        </Row>
                    </MyForm>
                    <Row>
                        <Col span={24}>
                            <Divider>Transaction Details</Divider>
                            <div className="float-right">
                                <Button icon={<BarcodeOutlined />} type="primary" size="small"
                                    onClick={returnItems} disabled={props?.isPosted || props?.isVoid}
                                >
                                    Return Items
                                </Button>
                            </div>
                        </Col>
                        <Col span={24}>
                            <Table
                                loading={loading || removeLoading}
                                className="gx-table-responsive"
                                columns={columns}
                                dataSource={items}
                                rowKey={record => record.id}
                                size="small"
                                pagination={{
                                    pageSize: 5
                                }}
                            />
                        </Col>
                    </Row>
                </>
            )}
            {modal}
        </CModal>
    );
};

export default (RTSForm);
