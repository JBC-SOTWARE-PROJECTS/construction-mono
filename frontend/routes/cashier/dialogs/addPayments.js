import React, { useState } from "react";
import { Col, Row, Button, message, Alert, Skeleton, Card, Table, Typography, Form, Tag } from "antd";
import MyForm from "../../../util/customForms/myForm";
import FormInput from "../../../util/customForms/formInput";
import CModal from "../../../app/components/common/CModal";
import FormBtnSubmit from "../../../util/customForms/formBtnSubmit";
import { PrinterOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import numeral from "numeral";
import moment from "moment";
import { dialogHook } from "../../../util/customhooks";
import Payments from "./payments";
import { getUrlPrefix } from "../../../shared/global";



const UPSERT_RECORD = gql`
 mutation{
     upsert: addShift {
         id
	}
}`;


const ACTIVESHIFT = gql`
	{
		activeShift {
			id
			terminal{
				id
				terminal_no
			}
			shiftNo
		}
	}
`;


const PAYMENTS = gql`
	query($id: UUID){
		payment: paymentByBillingId(id: $id) {
			id
			totalPayments
			orNumber
			description
			voided
			createdDate
		}
		bill: billingById(id: $id){
			id
			balance
		}
	}
`;

const { Text } = Typography

const AddPaymentForm = ({ visible, hide, ...props }) => {

    const [formError, setFormError] = useState({});
    const [form] = Form.useForm();
    const { loading, data, refetch } = useQuery(ACTIVESHIFT, {
        fetchPolicy: 'network-only'
    });

    const { loading: paymentLoading, data: paymentData, refetch: paymentRefetch } = useQuery(PAYMENTS, {
        variables: {
            id: props?.id
        },
        fetchPolicy: 'network-only'
    });
    {/* error = { errorTitle: "", errorMsg: ""}*/ }

    const [upsertRecord, { loading: upsertLoading }] = useMutation(UPSERT_RECORD, {
        ignoreResults: false,
        onCompleted: (data) => {
            if (!_.isEmpty(data?.upsert?.id)) {
                refetch()
            }
        },
        onError: (data) => {
            if (data) {
                message.error("No Terminal Assign in this account")
            }
        }
    });

    const [modal, showModal] = dialogHook(Payments, (result) => {
        if (result) {
            message.success(result);
            refetch()
            paymentRefetch()
            form.setFieldsValue({
                ['amount']: 0
            })
        }
    });

    //======================= =================== =================================================//
    const clickBalance = () => {
        // setState({ ...state, amountToPay: _.get(paymentData, "bill.balance", 0) })
        const { setFieldsValue } = form
        setFieldsValue({
            ['amount']: _.get(paymentData, "bill.balance", 0)
        })
    }

    const createShift = () => {
        upsertRecord()
    }

    const onSubmit = (value) => {
        let shiftId = _.get(data, "activeShift.id")
        if (value?.amount > 0 && _.get(paymentData, "bill.balance") >= value?.amount) {
            let obj = {
                amount: value?.amount,
                bill_id: props?.id,
                shift_id: shiftId,
                type: props?.otcName ? "OTC" : "JOB",
            }
            showModal({ show: true, myProps: obj })
        } else {
            message.error("Please Enter Amount to Pay Greater than Zero and Not Greater than the Balance")
        }

    }

    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (createdDate, record) => (
                <Text type={record.voided && 'danger'} delete={record.voided && true}>{moment(createdDate).format("MM/DD/YYYY h:mm:ss A")}</Text>
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (description, record) => (
                <Text type={record.voided && 'danger'} delete={record.voided && true}>{description}</Text>
            )
        },
        {
            title: 'OR #',
            dataIndex: 'orNumber',
            key: 'orNumber',
            render: (orNumber, record) => (
                <Text type={record.voided && 'danger'} delete={record.voided && true}>{orNumber}</Text>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'totalPayments',
            key: 'totalPayments',
            render: (totalPayments, record) => (
                <Text type={record.voided && 'danger'} delete={record.voided && true}>{numeral(totalPayments).format('0,0.00')}</Text>
            )
        },
        {
            title: 'Status',
            dataIndex: 'voided',
            key: 'voided',
            render: (voided) => (
                <Tag color={voided ? "red" : "green"}>{voided ? "Voided" : "Active"}</Tag>
            )
        },
        {
            title: '#',
            key: 'print',
            render: (txt, record) => (
                <Button
                    icon={<PrinterOutlined />}
                    onClick={() => window.open(`${getUrlPrefix()}/reports/billing/print/receipt/${record.id}`)}
                    type='danger'
                    size='small'
                />
            )
        },
    ]

    console.log(_.get(data, "activeShift"))

    return (
        <CModal
            width={"70%"}
            title={"Payment Records"}
            visible={visible}
            footer={[
                <Button key="back" onClick={() => hide()} type="danger">
                    Return
                </Button>
            ]}
        >
            {loading || paymentLoading ? (
                <Skeleton active />
            ) : (
                <div>
                    {_.isEmpty(_.get(data, "activeShift")) ? (
                        <Row gutter={[4, 4]}>
                            <Col span={24}>
                                <Alert
                                    message="Error"
                                    description="No Active Shift Found. Start Shift to Procceed"
                                    type="error"
                                    showIcon
                                />
                            </Col>
                            <Col span={24}>
                                <Button type='primary' loading={upsertLoading} onClick={createShift}>Create Shift</Button>
                            </Col>
                        </Row>
                    ) : (
                        <>
                            <Row>
                                <Col span={24}>
                                    <MyForm
                                        form={form}
                                        name="pettyCashForm"
                                        id="pettyCashForm"
                                        error={formError}
                                        onFinish={onSubmit}
                                        className="form-card"
                                    >
                                        <Row>
                                            <Col span={6}>
                                                <label style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>Total Payable</label><br />
                                                <a style={{ fontSize: 30 }} onClick={clickBalance}>{numeral(_.get(paymentData, "bill.balance", 0)).format("0,0.00")}</a>
                                            </Col>
                                            <Col span={12}>
                                                <FormInput description={"Amount To Pay"}
                                                    rules={[{ required: true, message: 'This Field is required' }]}
                                                    type="number"
                                                    name="amount"
                                                    formatter={value => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                    initialValue={0.00}
                                                    placeholder="Amount"
                                                    disabled={props?.isPosted || props?.isVoid}
                                                />
                                            </Col>
                                            <Col span={6}>
                                                <FormBtnSubmit type="primary"
                                                    block id="app.form.addPayment" style={{ marginTop: 17 }} />
                                            </Col>

                                        </Row>
                                    </MyForm >
                                </Col>
                                <Col span={24}>
                                    <Card title={`Payments History of ${props?.customer?.fullName ? props?.customer?.fullName : props?.otcName}`}
                                        size='small' extra={<a>{`Billing No: ${props?.billNo}`}</a>}>
                                        <Table
                                            size='small'
                                            columns={columns}
                                            loading={paymentLoading}
                                            dataSource={_.get(paymentData, "payment")}
                                            rowKey={row => row.id}
                                        />
                                    </Card>
                                </Col>
                                <Col span={24}>
                                    <Alert
                                        message={`${_.get(data, "activeShift.terminal.terminal_no")} | ${_.get(data, "activeShift.shiftNo")} | ${moment(new Date()).format("MM/DD/YYYY h:mm:ss A")}`}
                                        type="warning" />
                                </Col>
                            </Row>

                        </>
                    )}
                </div >

            )}
            {modal}
        </CModal >
    );
};

export default (AddPaymentForm);
