import React, { useState } from 'react';
import { Card, Row, Col, Table, Divider, DatePicker, Input, Button, message } from 'antd';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { col4, col2 } from '../../../shared/constant';
import FilterSelect from '../../../util/customForms/filterSelect';
import { get } from '../../../shared/global'
import { CloudDownloadOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import moment from 'moment';



//graphQL Queries
const EXPENSE = gql`
	query($start: Instant, $end: Instant, $filter: String, $expenseFrom: UUID) {
		ItemExpense(start: $start, end: $end, filter: $filter, expenseFrom: $expenseFrom) {
			id
			issueQty
			unitCost
			item {
				id
				descLong
				unit_of_purchase {
					id
					unitDescription
				}
				item_category {
					id
					categoryDescription
				}
			}
			stockIssue {
				issueDate
				issueNo
				issued_by {
					id
					fullName
				}
				issueTo {
					id
					officeName : officeDescription
				}
			}
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


const { RangePicker } = DatePicker;
const { Search } = Input;
const dateFormat = 'YYYY-MM-DD';

const ExpenseContent = ({ account }) => {

    const [office, setOffice] = useState(account?.office?.id)
    const [filter, setFilter] = useState('');
    const [state, setState] = useState({
        start: moment(new Date()).format('YYYY-MM-DD'),
        end: moment(new Date()).format('YYYY-MM-DD'),
        loading: false,
    })
    //query
    const { loading: onHandLoading, data: expenseData } = useQuery(EXPENSE, {
        variables: {
            start: state.start + 'T00:00:00Z',
            end: state.end + 'T23:00:00Z',
            filter: filter,
            expenseFrom: office,
        },
        fetchPolicy: 'network-only',
    });

    const { loading, data } = useQuery(GET_RECORDS, {
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
        get(`/api/expense/report`, {
            params: {
                start: state.start + 'T00:00:00Z',
                end: state.end + 'T23:00:00Z',
                expenseFrom: office,
            },
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `expense-report.csv`);
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
            title: 'Date',
            dataIndex: 'stockIssue.issueDate',
            key: 'date',
            render: (txt, record) => <span key={txt}>{moment(record?.issueDate).format('YYYY-MM-DD')}</span>,
        },
        {
            title: 'EXPENSE NO',
            dataIndex: 'stockIssue.issueNo',
            key: 'expenseNo',
            render: (text, record) => (
                <span>{record.stockIssue?.issueNo}</span>
            )
        },
        {
            title: 'ITEM',
            dataIndex: 'item.descLong',
            key: 'item',
            render: (text, record) => (
                <span>{record.item?.descLong}</span>
            )
        },
        {
            title: 'ITEM CATEGORY',
            dataIndex: 'item.item_category.categoryDescription',
            key: 'item_category',
            render: (text, record) => (
                <span>{record.item?.item_category?.categoryDescription}</span>
            )
        },
        {
            title: 'QTY',
            dataIndex: 'issueQty',
            key: 'qty',
            align: 'right',
        },
        {
            title: 'UNIT',
            dataIndex: 'item.unit_of_purchase.unitDescription',
            key: 'unit',
            render: (text, record) => (
                <span>{record.item?.unit_of_purchase?.unitDescription}</span>
            )
        },
        {
            title: 'UNIT COST',
            dataIndex: 'unitCost',
            key: 'unitCost',
            align: 'right',
            render: unitCost => <span>{numeral(unitCost).format('0,0.00')}</span>,
        },
        {
            title: 'TOTAL',
            dataIndex: 'issueQty',
            key: 'total',
            align: 'right',
            render: (txt, record) => (
                <span key={txt}>{numeral(record.unitCost * record.issueQty).format('0,0.00')}</span>
            ),
        },

    ];


    return (
        <Card title="Expense Report" size="small" extra={
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
                    <RangePicker
                        defaultValue={[moment(state.start, dateFormat), moment(state.end, dateFormat)]}
                        format={dateFormat}
                        onChange={onChange}
                    />
                </Col>
                <Col span={24}>
                    <Divider />
                    <Table
                        loading={onHandLoading}
                        className="gx-table-responsive"
                        columns={columns}
                        dataSource={_.get(expenseData, "ItemExpense", [])}
                        rowKey={row => row.id}
                        size={'small'}
                        expandedRowRender={record => (
                            <div>
                                <p style={{ margin: 0 }}>{`Office: ${record.stockIssue?.issueTo?.officeName}`}</p>
                                <p style={{ margin: 0 }}>{`Expense By: ${record.stockIssue?.issued_by?.fullName}`}</p>
                            </div>
                        )}
                    />
                </Col>
            </Row>
        </Card>
    )
};

export default ExpenseContent;
