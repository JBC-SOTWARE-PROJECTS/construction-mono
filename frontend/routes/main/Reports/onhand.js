import React, { useState } from 'react';
import { Card, Row, Col, Table, Divider, DatePicker, Input, Button, message } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col4, col2 } from '../../../shared/constant';
import FilterSelect from '../../../util/customForms/filterSelect';
import { getUrlPrefix, get } from '../../../shared/global'
import { PrinterOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import moment from 'moment';



//graphQL Queries
const ONHAND = gql`
	query($office: UUID, $date: String, $filter: String) {
		onHandReport(office: $office, date: $date, filter: $filter) {
			id
			item
			desc_long
			unit_of_purchase
			unit_of_usage
			category_description
			department
			department_name
			expiration_date
			onhand
			last_unit_cost
			last_wcost
		}
	}
`;

//graphQL Queries
const GET_RECORDS = gql`{
    offices: activeOffices
    {
        value: id
		label: officeDescription
    }

}`;


const { Search } = Input;

const OnHandContent = ({ account }) => {

    const [office, setOffice] = useState(account?.office?.id)
    const [now, setNow] = useState(moment(new Date()));
    const [filter, setFilter] = useState('');
    const [state, setState] = useState({
        loading: false,
    });
    // const [loadingCsvButton, setLoadingCsvButton] = useState(false);
    const [formatDate, setFormatDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

    //query
    const { loading: onHandLoading, data: onHandData } = useQuery(ONHAND, {
        variables: {
            office: office,
            date: formatDate,
            filter: filter,
        },
        fetchPolicy: 'network-only',
    });

    const { loading, data } = useQuery(GET_RECORDS, {
        fetchPolicy: 'network-only',
    });



    function onChangeDate(e) {
        setNow(e);
        setFormatDate(moment(e).format('YYYY-MM-DD'));
    }

    const print = () => {
        if (office && formatDate) {
            window.open(`${getUrlPrefix()}/reports/inventory/print/onhand_report/${office}/${formatDate}`);
        } else {
            message.error("Please select item and office")
        }
    }

    const downloadCsv = () => {
        if (office && formatDate) {
            setState({ ...state, loading: true });
            get(`/api/onhand/report`, {
                params: {
                    office: office,
                    date: formatDate,
                },
            }).then(response => {
                const url = window.URL.createObjectURL(new Blob([response]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `onhand-report.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setState({ ...state, loading: false });
            }).catch(error => {
                console.log(error);
                message.error(`Error generating report: ${error?.message}`)
            });
        } else {
            message.error("Please select item and office")
        }
    }


    const columns = [
        {
            title: 'Item Description',
            dataIndex: 'desc_long',
            key: 'desc_long',
        },
        {
            title: 'Unit of Purchase',
            dataIndex: 'unit_of_purchase',
            key: 'unit_of_purchase',
        },
        {
            title: 'Unit of Usage',
            dataIndex: 'unit_of_usage',
            key: 'unit_of_usage',
        },
        {
            title: 'Item Category',
            dataIndex: 'category_description',
            key: 'category_description',
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expiration_date',
            key: 'expiration_date',
        },
        {
            title: 'On Hand Qty',
            dataIndex: 'onhand',
            key: 'onhand',
        },
        {
            title: 'Unit Cost',
            dataIndex: 'last_unit_cost',
            key: 'last_unit_cost',
            render: unitCost => <span>{numeral(unitCost).format('0,0.00')}</span>,
        },
        {
            title: 'Total Cost',
            key: 'totalCost',
            render: (txt, record) => (
                <span key={txt}>{numeral(record.last_unit_cost * record.onhand).format('0,0.00')}</span>
            ),
        },
    ];


    return (
        <Card title="On Hand Report" size="small" extra={
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
                <Col {...col4}>
                    <FilterSelect
                        allowClear
                        defaultValue={account?.office?.id}
                        loading={loading}
                        field="office"
                        placeholder="Filter By Office"
                        onChange={(e) => {
                            setOffice(e)
                        }}
                        list={_.get(data, "offices")}
                    />
                </Col>
                <Col {...col4}>
                    <DatePicker style={{ width: '100%' }} defaultValue={now} onChange={onChangeDate} />
                </Col>
                <Col span={24}>
                    <Divider />
                    <Table
                        loading={onHandLoading}
                        className="gx-table-responsive"
                        columns={columns}
                        dataSource={_.get(onHandData, "onHandReport", [])}
                        rowKey={row => row.id}
                        size={'small'}
                    />
                </Col>
            </Row>
        </Card>
    )
};

export default OnHandContent;
