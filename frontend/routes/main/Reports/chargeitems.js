import React, { useState } from 'react';
import { Card, Row, Col, Table, Divider, DatePicker, Input, Button, message } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col2 } from '../../../shared/constant';
import { get } from '../../../shared/global'
import { CloudDownloadOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import moment from 'moment';



//graphQL Queries
const GET_ITEMS = gql`
	query($start: String, $end: String, $filter: String) {
		items: chargedItems(start: $start, end: $end, filter: $filter) {
			 id
			 transDate
			 refNo
			 description
			 transType
			 qty
			 unitCost
			 totalAmount
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
    const { loading: chargeLoading, data: chargeData } = useQuery(GET_ITEMS, {
        variables: {
            start: state.start,
            end: state.end,
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

    const downloadCsv = () => {
        setState({ ...state, loading: true });
        get(`/api/charged/report`, {
            params: {
                start: state.start,
                end: state.end,
                filter: filter,
            },
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `charged-items-report.csv`);
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
            title: 'Transaction Date',
            dataIndex: 'transDate',
            key: 'transDate',
            render: (transDate, record) => (
                <span key={transDate}>{moment(transDate).format('YYYY-MM-DD h:mm:ss A')}</span>
            ),
        },
        {
            title: 'Reference No',
            dataIndex: 'refNo',
            key: 'refNo',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Transaction Type',
            dataIndex: 'transType',
            key: 'transType',
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            key: 'qty',
            render: qty => <span>{numeral(qty).format('0,0')}</span>,
        },
        {
            title: 'Unit Cost',
            dataIndex: 'unitCost',
            key: 'unitCost',
            render: amount => <span>{numeral(amount).format('0,0.00')}</span>,
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            align: 'right',
            render: amount => <span>{numeral(amount).format('0,0.00')}</span>,
        },
    ];



    return (
        <Card title="Charged Items Report" size="small" extra={
            <span>
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
                        loading={chargeLoading}
                        className="gx-table-responsive"
                        columns={columns}
                        dataSource={_.get(chargeData, "items", [])}
                        rowKey={row => row.id}
                        size={'small'}
                    />
                </Col>
            </Row>
        </Card>
    )
};

export default DReportItemContent;
