import React, { useState } from 'react';
import { Card, Row, Col, Table, Divider, Button, message } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col4, col18 } from '../../../shared/constant';
import FilterSelect from '../../../util/customForms/filterSelect';
import { PrinterOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { getUrlPrefix, get } from '../../../shared/global'
import numeral from 'numeral';
import moment from 'moment';



//graphQL Queries
const GET_RECORDS = gql`
query($filter: String, $page: Int, $size: Int) {
    list: itemsByFilterOnly(filter: $filter, page: $page, size: $size) {
        content{
            value: id
			label: descLong
        }
        size
        totalElements
        number
    }
    offices: activeOffices
    {
        value: id
		label: officeDescription
    }

}`;

const STOCKCARD = gql`
	query($itemId: String, $office: String) {
		card: stockCard(itemId: $itemId, office: $office) {
			id
			source_officename
			destination_officename
			document_desc
			desc_long
			reference_no
			ledger_date
			ledger_qtyin
			ledger_qty_out
			adjustment
			unitcost
			runningqty
			wcost
			runningbalance
		}
	}
`;

const StockCardContent = ({ account }) => {

    const [office, setOffice] = useState(account?.office?.id)
    const [itemId, setItemId] = useState(null)
    const [state, setState] = useState({
        loading: false,
        filter: "",
        page: 0,
        size: 50,
    })
    //query
    const { loading, data, fetchMore } = useQuery(GET_RECORDS, {
        variables: {
            filter: state.filter,
            page: state.page,
            size: state.size,
        },
        fetchPolicy: 'network-only',
    });

    const { loading: stockCardLoading, data: stockCard } = useQuery(STOCKCARD, {
        variables: {
            itemId: itemId,
            office: office,
        },
        fetchPolicy: 'network-only',
    });


    const refreshfilter = _.debounce(
        (page, newFilter) => {
            fetchMore({
                variables: {
                    page,
                    filter: newFilter,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return fetchMoreResult;
                },
            });
        },
        300,
        {
            trailing: true,
        }
    );

    const print = () => {
        if (itemId && office) {
            window.open(`${getUrlPrefix()}/reports/inventory/print/stockcard_report/${itemId}/${office}`);
        } else {
            message.error("Please select item and office")
        }
    }

    const downloadCsv = () => {
        if (office && itemId) {
            setState({ ...state, loading: true });
            get(`/api/stockCard/report`, {
                params: {
                    itemId: itemId,
                    office: office,
                },
            }).then(response => {
                const url = window.URL.createObjectURL(new Blob([response]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `stock-card-report.csv`);
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
            title: 'Transaction',
            key: 'transaction',
            children: [
                {
                    title: 'Date',
                    dataIndex: 'ledger_date',
                    key: 'ledger_date',
                    render: x => <span>{moment(x).add(8, 'hours').format('MM/DD/YYYY HH:mm:ss')}</span>,
                },
                {
                    title: 'Reference. #',
                    dataIndex: 'reference_no',
                    key: 'reference_no',
                },
                {
                    title: 'Transc. Type',
                    dataIndex: 'document_desc',
                    key: 'document_desc',
                },
                {
                    title: 'Office',
                    dataIndex: 'source_officename',
                    key: 'source_officename',
                },
            ],
        },
        {
            title: 'Running Balance',
            key: 'running_balance',
            children: [
                {
                    title: 'Qty',
                    dataIndex: 'runningqty',
                    key: 'runningqty',
                },
                {
                    title: 'W. Cost',
                    dataIndex: 'wcost',
                    key: 'wcost',
                    render: x => <span>{numeral(x).format('0,0.00')}</span>,
                },
                {
                    title: 'Amount',
                    dataIndex: 'runningbalance',
                    key: 'runningbalance',
                    render: x => <span>{numeral(x).format('0,0.00')}</span>,
                },
            ],
        },
    ];

    const expandedRowRender = record => {
        const expandedCol = [
            {
                title: 'Qty In',
                dataIndex: 'ledger_qtyin',
                key: 'ledger_qtyin',
            },
            {
                title: 'Qty Out',
                dataIndex: 'ledger_qty_out',
                key: 'ledger_qty_out',
            },
            {
                title: 'Adjust',
                dataIndex: 'adjustment',
                key: 'adjustment',
            },
            {
                title: 'Unit Cost',
                dataIndex: 'unitcost',
                key: 'unitcost',
                render: x => <span>{numeral(x).format('0,0.00')}</span>,
            },
            {
                title: 'Amount',
                key: 'amount',
                render: (txt, record) => {
                    let x =
                        (record.ledger_qtyin + record.ledger_qty_out + record.adjustment) * record.unitcost;
                    return <span>{numeral(x).format('0,0.00')}</span>;
                },
            },
        ];
        return <Table columns={expandedCol} dataSource={[record]} pagination={false} size="small" />;
    };


    return (
        <Card title="Stock Card Report" size="small" extra={
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
                <Col {...col18}>
                    <FilterSelect
                        allowClear
                        loading={loading}
                        field="items"
                        placeholder="Select Items"
                        onSearch={(e) => {
                            refreshfilter(0, e)
                        }}
                        onChange={(e) => {
                            setItemId(e)
                        }}
                        list={_.get(data, 'list.content')}
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
                <Col span={24}>
                    <Divider />
                    <Table
                        loading={stockCardLoading}
                        className="gx-table-responsive"
                        columns={columns}
                        dataSource={_.get(stockCard, "card", [])}
                        rowKey={row => row.id}
                        size={'small'}
                        bordered
                        expandedRowRender={e => expandedRowRender(e)}
                    />
                </Col>
            </Row>
        </Card>
    )
};

export default StockCardContent;
