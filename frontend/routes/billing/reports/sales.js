import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Input, Divider, Typography, DatePicker, message } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
    PrinterOutlined, CloudDownloadOutlined
} from '@ant-design/icons';
import { col2, col3 } from '../../../shared/constant';
import IconWithTextCard from "../../../app/components/dashboard/CRM/IconWithTextCard";
import { getUrlPrefix, get } from '../../../shared/global'
import moment from "moment";
import numeral from 'numeral';


const { Search } = Input;
const { RangePicker } = DatePicker;
const { Title } = Typography

//graphQL Queries
const QUERY = gql`
	query($start: String, $end: String, $filter: String){
        list: salesReport(start: $start, end: $end, filter: $filter) {
            id
            trans_type
            trans_date
            ornumber
            bill
            ref_no
            category
            description
            gross
            deductions
            disc_amount
            netsales
        }
        totalGross(start: $start, end: $end, filter: "")
        totalDeduction(start: $start, end: $end, filter: "")
        netSales(start: $start, end: $end, filter: "")
    }
`;

const SalesReportContent = ({ account }) => {
    const dateFormat = 'YYYY-MM-DD';
    const [state, setState] = useState({
        loading: false,
        start: moment().startOf('month').format('YYYY-MM-DD'),
        end: moment().endOf('month').format('YYYY-MM-DD'),
        filter: ''
    })
    //query
    const { loading, data, refetch } = useQuery(QUERY, {
        variables: {
            start: state.start,
            end: state.end,
            filter: state.filter
        },
        fetchPolicy: 'network-only'
    });


    //======================= =================== =================================================//
    const onChange = (date2, dateString) => {
        setState({
            ...state,
            start: dateString[0],
            end: dateString[1],
        });
        console.log("moment", date2);
    }

    const print = () => {
        window.open(`${getUrlPrefix()}/reports/billing/print/sales_print/${state.start}/${state.end}`)
    }

    const downloadCsv = () => {
        setState({ ...state, loading: true });
        get(`/reports/billing/print/sales_download`, {
            params: {
                start: state.start,
                end: state.end
            },
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `sales-report.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setState({ ...state, loading: false });
        }).catch(err => {
            message.error({
                title: 'Error generating report',
                content: err.message,
            });
            setState({ ...state, loading: false });
        });
    }

    const columns = [
        {
            title: 'Type',
            key: 'trans_type',
            dataIndex: 'trans_type',
        },
        {
            title: 'Date',
            dataIndex: 'trans_date',
            key: 'trans_date',
            render: (trans_date) => (
                <span>{trans_date && moment(trans_date).format("MM/DD/YYYY")}</span>
            )
        },
        {
            title: 'OR',
            key: 'ornumber',
            dataIndex: 'ornumber',
        },
        {
            title: 'Bill #',
            key: 'bill',
            dataIndex: 'bill',
        },
        {
            title: 'Ref No',
            key: 'ref_no',
            dataIndex: 'ref_no',
        },
        {
            title: 'Category',
            key: 'category',
            dataIndex: 'category',
        },
        {
            title: 'Description',
            key: 'description',
            dataIndex: 'description',
        },
        {
            title: 'Gross',
            key: 'gross',
            dataIndex: 'gross',
            render: (cost) => (
                <span>{numeral(cost).format('0,0.00')}</span>
            )
        },
        {
            title: 'Discount',
            key: 'deductions',
            dataIndex: 'deductions',
        },
        {
            title: 'Disc. Amount',
            key: 'disc_amount',
            dataIndex: 'disc_amount',
            render: (cost) => (
                <span>{numeral(cost).format('0,0.00')}</span>
            )
        },
        {
            title: 'Net Sales',
            key: 'netsales',
            dataIndex: 'netsales',
            render: (cost) => (
                <span>{numeral(cost).format('0,0.00')}</span>
            )
        },

    ];

    return (
        <Card title="Sales Report" size="small" extra={
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
                    <Search placeholder="Search"
                        onSearch={(e) => setState({ ...state, filter: e })}
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
                    <Row>
                        <Col {...col3}>
                            <IconWithTextCard cardColor="cyan" icon="diamond" title={numeral(_.get(data, "totalGross", 0)).format('0,0.00')} subTitle="Total Gross" />
                        </Col>
                        <Col {...col3}>
                            <IconWithTextCard cardColor="orange" icon="diamond" title={numeral(_.get(data, "totalDeduction", 0)).format('0,0.00')} subTitle="Total Discount" />
                        </Col>
                        <Col {...col3}>
                            <IconWithTextCard cardColor="teal" icon="diamond" title={numeral(_.get(data, "netSales", 0)).format('0,0.00')} subTitle="Net Sales" />
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Divider />
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
        </Card>
    )
};

export default SalesReportContent;
