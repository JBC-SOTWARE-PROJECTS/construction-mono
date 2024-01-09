import React from 'react';

import { Button, Card, Col, Divider, Row, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { EditOutlined, PrinterOutlined } from '@ant-design/icons';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  account: number;
  totalGrossPay: number;
  subTotal: number;
  netPay: number;
}

const tableHeader = [
  {
    title: 'Company Name :',
  },
  {
    title: 'Payroll Code :',
  },
  {
    title: 'Pay Period from :',
  },
  {
    title: 'Check Date :',
  },
];

const data: DataType[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
    account: 2323423,
    totalGrossPay: 1000,
    subTotal: 1000,
    netPay: 12000,
  });
}

function PayrollRegisterEmp() {
  const columns: ColumnsType<DataType> = [
    {
      title: 'Account No.',
      dataIndex: 'account',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Days',
      dataIndex: 'days',
      width: 150,
    },
    {
      title: 'Regular Pay',
      dataIndex: 'regularPay',
      width: 150,
    },
    {
      title: 'UnderTime Pay',
      dataIndex: 'overtime',
      width: 150,
    },
    {
      title: 'Overtime Pay',
      dataIndex: 'overtime',
      width: 150,
    },
    {
      title: 'Holiday',
      dataIndex: 'holiday',
      width: 150,
    },
    {
      title: 'Vacation Leave',
      dataIndex: 'vacationleave',
      width: 150,
    },
    {
      title: 'Sick Leave',
      dataIndex: 'sickLeave',
      width: 150,
    },
    { title: 'Allowance', dataIndex: 'allowance', key: '8', width: 150 },
    {
      title: 'Total Gross Pay',
      width: 150,
      render: (record) => (
        <div style={{ color: 'blue', fontWeight: 'bold' }}>
          {record?.totalGrossPay}
        </div>
      ),
    },
    {
      title: 'With holding Tax',
      dataIndex: 'withholdingtax',
      width: 150,
    },
    {
      title: 'SSS',
      dataIndex: 'withholdingtax',
      width: 150,
    },
    {
      title: 'HDMF',
      dataIndex: 'withholdingtax',
      width: 150,
    },
    {
      title: 'PHIC',
      dataIndex: 'phic',
      width: 150,
    },
    {
      title: 'Insurance',
      dataIndex: 'insurance',
      width: 150,
    },
    {
      title: 'Salary Loan',
      dataIndex: 'salaryLoan',
      width: 150,
    },
    {
      title: 'Other Deductions',
      dataIndex: 'otherDeductions',
      width: 150,
    },
    {
      title: 'Total Payroll Deductions',
      dataIndex: 'otherDeductions',
      width: 150,
    },
    {
      title: 'SubTotal',
      width: 150,
      render: (record) => (
        <span style={{ color: '#ff9966', fontWeight: 'bold' }}>
          {record?.subTotal}
        </span>
      ),
    },
    {
      title: 'Adjustment',
      dataIndex: 'adjustment',
      width: 150,
    },
    {
      title: 'Net Pay',
      width: 150,
      render: (record) => (
        <span style={{ color: 'blue', fontWeight: 'bold' }}>
          {record?.netPay}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: () => (
        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          {/* <Button type='primary' icon={<EditOutlined />} size='middle' /> */}
          <Button type='primary' icon={<PrinterOutlined />} size='middle' />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <>
          {tableHeader.map((item: any) => (
            <div key={item.key} style={{ fontWeight: 'bold' }}>
              {item.title}
            </div>
          ))}
          <Divider />
          <Row>
            <Table
              size='small'
              columns={columns}
              dataSource={data}
              scroll={{ x: 500, y: 500 }}
            />
          </Row>
        </>
      </Card>
    </div>
  );
}

export default PayrollRegisterEmp;
