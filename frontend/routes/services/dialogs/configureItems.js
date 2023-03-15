import React, { useState, useContext, useMemo } from "react";
import { AccountContext } from "../../../app/components/accessControl/AccountContext";
import { Col, Row, Button, Table, InputNumber, message, Input } from "antd";
import { DeleteFilled, BarcodeOutlined } from '@ant-design/icons';
import CModal from "../../../app/components/common/CModal";
import ColTitlePopUp from '../../../app/components/common/ColTitlePopUp';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { dialogHook } from "../../../util/customhooks";
import { gql } from "apollo-boost";
import numeral from "numeral";
import _ from "lodash";
import update from 'immutability-helper';
import InventoryByOfficeModal from "../../main/Inventorydialogs/inventory";



const GET_RECORDS = gql`
query($id: UUID, $filter: String){
    items: serviceItemByParent (id: $id, filter: $filter){
        id
        item {
            id
            descLong
        }
        unitMeasurement
        uou
        qty
        wcost
    }
}`;

const UPSERT_RECORD = gql`
 mutation($id: UUID, $items: [Map_String_ObjectScalar]) {
     upsert: upsertServiceItem(id: $id, items: $items) {
         id
	}
}`;

const DELETE_RECORD = gql`
 mutation($id:UUID) {
    removeServiceItem(id:$id){
        id
    }
  }
`;

const { Search } = Input;

const ConfigureItems = ({ visible, hide, ...props }) => {
    const account = useContext(AccountContext);
    {/* error = { errorTitle: "", errorMsg: ""}*/ }
    const [editable, setEditable] = useState({})
    const [items, setItems] = useState([])
    const [filter, setFilter] = useState("")

    const { loading, data, refetch } = useQuery(GET_RECORDS, {
        variables: {
            id: props?.id,
            filter: filter
        },
        fetchPolicy: 'network-only',
    });

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                if (props?.id) {
                    hide("Service Items Information Updated")
                } else {
                    hide("Service Items Information Added")
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

    const [modal, showModal] = dialogHook(InventoryByOfficeModal, (result) => { // item form
        if (!_.isEmpty(result)) { // validate here
            if (_.isEmpty(items)) {
                setItems(result)
            } else { //append
                setItems([...items, ...result])
            }
        }
    });


    //======================= =================== =================================================//

    const onSubmit = () => {
        upsertRecord({
            variables: {
                id: props?.id,
                items: items
            }
        })
    }

    const addItems = () => {
        showModal({ show: true, myProps: { items: items, type: "SERVICE" } })
    }

    const onChangeArray = (element, record, newValue) => {
        let payload = _.clone(items);
        let index = _.findIndex(payload, ['id', record?.id]);
        let data = update(payload, {
            [index]: {
                [element]: {
                    $set: parseInt(newValue) || 0,
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

    const columns = [{
        title: 'Item Description',
        dataIndex: 'item.descLong',
        key: 'item.descLong',
        render: (text, record) => (
            <span>{record.item?.descLong}</span>
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
                    if (props?.isApprove) {
                        message.error("This Service Items is already approved. Editing is disabled.")
                    } else {
                        setEditable({ ...editable, [e.id]: true })
                    }
                }, // double click row
            };
        },
        render: (text, record) => {
            return editable[record.id] ? (
                <InputNumber
                    defaultValue={record.qty}
                    autoFocus
                    onBlur={(e) => {
                        let newValue = e?.target?.value;
                        onChangeArray("qty", record, newValue);
                        setEditable({ ...editable, [record.id]: false })
                    }}
                    style={{ width: 150 }}
                />
            ) : (
                <span>{numeral(record.qty).format('0,0')}</span>
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
                disabled={props?.isApprove}
                icon={<DeleteFilled />}
            />
        ),
    }];

    //triggers
    useMemo(() => { //use memo to avoid memory leak
        if (props?.id) {
            setItems(_.get(data, "items", []));
        }
    }, [data])


    return (
        <CModal
            allowFullScreen={true}
            title={`Configure Items for [${props?.description}]`}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>,
                <Button key="submit" type="primary" loading={upsertLoading} onClick={onSubmit}>
                    Submit
                </Button>,
            ]}
        >
            <Row>
                <Col span={20}>
                    <Search placeholder="Search Items"
                        onSearch={(e) => setFilter(e)}
                        enterButton
                    />
                </Col>
                <Col span={4}>
                    <Button icon={<BarcodeOutlined />} type="primary"
                        onClick={addItems} block
                    >
                        Add Items
                    </Button>
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
            {modal}
        </CModal>
    );
};

export default (ConfigureItems);
