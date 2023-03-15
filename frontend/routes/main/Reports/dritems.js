import React, { useState } from 'react';
import { Card, Row, Col, Table, Divider, DatePicker, Input, Button, message } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col2 } from '../../../shared/constant';
import { PrinterOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { getUrlPrefix, get } from '../../../shared/global'
import numeral from 'numeral';
import moment from 'moment';



//graphQL Queries
const SRR_REPORT_LIST = gql`
	query($start: Instant, $end: Instant, $filter: String) {
		getSrrItemByDateRange(start: $start, end: $end, filter: $filter) {
			id
			item {
				id
				descLong
				item_category {
					id
					categoryDescription
				}
			}
			receivingReport {
				id
				rrNo
				receiveDate
				userFullname
				receivedOffice {
					id
					officeDescription
				}
				purchaseOrder {
					id
					poNumber
				}
				supplier {
					id
					supplierFullname
				}
				receivedRefNo
				receivedRefDate
				paymentTerms {
					id
					paymentDesc
				}
			}
			receiveQty
			receiveUnitCost
			receiveDiscountCost
			expirationDate
			totalAmount
			inputTax
			netAmount
			isTax
		}
	}
`;



const { RangePicker } = DatePicker;
const { Search } = Input;
const dateFormat = 'YYYY-MM-DD';

const DReportItemContent = ({ account }) => {

    const [filter, setFilter] = useState('');
    const [state, setState] = useState({
        start: moment(new Date()).format('YYYY-MM-DD'),
        end: moment(new Date()).format('YYYY-MM-DD'),
        loading: false,
    })
    //query
    const { loading: srrLoading, data: srrData } = useQuery(SRR_REPORT_LIST, {
        variables: {
            start: state.start + 'T00:00:00Z',
            end: state.end + 'T23:00:00Z',
            filter: filter,
        },
        fetchPolicy: 'network-only',
    });


    const onChange = (date2, dateString) => {
        setState({
            ...state,
            start: dateString[0],
            end: dateString[1],
        });
    }

    const print = () => {
        window.open(`${getUrlPrefix()}/reports/inventory/print/srr_detail/${state.start + 'T00:00:00Z'}/${state.end + 'T23:00:00Z'}`)
    }

    const downloadCsv = () => {
        setState({ ...state, loading: true });
        get(`/api/srrItem/report`, {
            params: {
                start: state.start + 'T00:00:00Z',
                end: state.end + 'T23:00:00Z',
            },
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `dr-summary-item-report.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setState({ ...state, loading: false });
        }).catch(error => {
            console.log(error);
            message.error(`Error generating report: ${error?.message}`)
        });
    }


    const columns = [
        {
            title: 'SRR NO',
            dataIndex: 'receivingReport.rrNo',
            key: 'receivingReport.rrNo',
            render: (txt, record) => (
                <span>{record?.receivingReport?.rrNo}</span>
            ),
        },
        {
            title: 'Receiving Date',
            dataIndex: 'receivingReport.receiveDate',
            key: 'receivingReport.receiveDate',
            render: (receiveDate, record) => (
                <span key={receiveDate}>{moment(receiveDate).format('YYYY-MM-DD')}</span>
            ),
        },
        {
            title: 'Supplier',
            dataIndex: 'receivingReport.supplier.supplierFullname',
            key: 'receivingReport.supplier.supplierFullname',
            render: (txt, record) => (
                <span>{record?.receivingReport?.supplier?.supplierFullname}</span>
            ),
        },
        {
            title: 'Item',
            dataIndex: 'item.descLong',
            key: 'item.descLong',
            render: (txt, record) => (
                <span>{record?.item?.descLong}</span>
            ),
        },
        {
            title: 'Item Category',
            dataIndex: 'item.item_category.categoryDescription',
            key: 'item.item_category.categoryDescription',
            render: (txt, record) => (
                <span>{record?.item?.item_category?.categoryDescription}</span>
            ),
        },
        {
            title: 'Unit Cost',
            dataIndex: 'receiveUnitCost',
            key: 'receiveUnitCost',
            align: 'right',
            render: receiveUnitCost => <span>{numeral(receiveUnitCost).format('0,0.00')}</span>,
        },
        {
            title: 'Qty',
            dataIndex: 'receiveQty',
            key: 'receiveQty',
            align: 'right',
            render: receiveQty => <span>{numeral(receiveQty).format('0,0')}</span>,
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            align: 'right',
            render: totalAmount => <span>{numeral(totalAmount).format('0,0.00')}</span>,
        },
    ];



    return (
        <Card title="Delivery Receiving Report Items Sumarry" size="small" extra={
            <span>
                <Button size="small" type="primary" icon={<PrinterOutlined />} className="margin-0"
                    onClick={print}
                >
                    Print
                </Button>
                <Button size="small" type="primary" icon={<CloudDownloadOutlined />} className="margin-0"
                    onClick={downloadCsv}
                    loading={state.loading}
                >
                    Download CSV
                </Button>
            </span>
        }>
            <Row>
                <Col {...col2}>
                    <Search placeholder="Search Items"
                        onSearch={(e) => setFilter(e)}
                        enterButton
                    />
                </Col>
                <Col {...col2}>
                    <RangePicker
                        defaultValue={[moment(state.start, dateFormat), moment(state.end, dateFormat)]}
                        format={dateFormat}
                        onChange={onChange}
                        style={{ width: "100%" }}
                    />
                </Col>
                <Col span={24}>
                    <Divider />
                    <Table
                        loading={srrLoading}
                        className="gx-table-responsive"
                        columns={columns}
                        dataSource={_.get(srrData, "getSrrItemByDateRange", [])}
                        rowKey={row => row.id}
                        size={'small'}
                    />
                </Col>
            </Row>
        </Card>
    )
};

export default DReportItemContent;
