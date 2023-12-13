import React, { useState } from 'react';
import { Button, Col, Input, Row, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined } from '@ant-design/icons';
import { getUrlPrefix } from '@/utility/graphql-client';

const { Search } = Input;

interface DataType {
  id: string;
  key: React.Key;
  name: string;
}

interface FormProps {
  dataSource: any;
  filter: string;
  loading: boolean;
  viewEmp: any;
  setSelectedEmp: any;
}

function PayslipSearchForm({
  dataSource,
  filter,
  loading,
  viewEmp,
  setSelectedEmp,
}: FormProps) {
  const [state, setState] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);

  const handleSearch = (value: any) => {
    setState(value);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRows(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: onSelectChange,
  };

  const onView = (record: any, index: any) => {
    viewEmp(record);
  };

  console.log('data', selectedRows);

  const columns: ColumnsType<DataType> = [
    {
      key: 'id',
      title: 'Employee',
      dataIndex: 'fullName',
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      render: (_, record, index) => {
        let item = record;
        return (
          <Button
            type='primary'
            onClick={() => onView(item, index)}
            size='small'
            icon={<EyeOutlined />}
          />
        );
      },
    },
  ];

  return (
    <div>
      <Row gutter={4}>
        <Col md={18}>
          <Search
            allowClear
            style={{ width: '100%', marginBottom: 10 }}
            size='middle'
            placeholder='Search here..'
            className='select-header-list'
            // onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
          />
        </Col>
        <Col md={4}>
          <Button
            type='primary'
            onClick={() =>
              window.open(
                `${getUrlPrefix()}/reports/payroll/print/payslipPayroll/${selectedRows}`
              )
            }
          >
            DownLoad Payslip
          </Button>
        </Col>
      </Row>
      <Row>
        <div
          style={{
            width: '100%',
            height: '100%',
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          <Table
            loading={loading}
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            rowKey='id'
            columns={columns}
            dataSource={dataSource}
          />
        </div>
      </Row>
    </div>
  );
}

export default PayslipSearchForm;
