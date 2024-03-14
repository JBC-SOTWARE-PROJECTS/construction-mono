import React, { useState } from 'react';
import { Button, Divider, Input, Row, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowDownOutlined, PrinterOutlined } from '@ant-design/icons';
import { getUrlPrefix } from '@/utility/graphql-client';
import { useRouter } from 'next/router';

const { Search } = Input;

interface DataType {
  id: string;
  key: React.Key;
  name: string;
}

interface FormProps {
  data: any;
  filter: '' | any;
  loading: boolean;
  viewEmp: any;
  setSelectedEmp: any;
}

function PayslipSearchForm({ data, filter, loading, viewEmp }: FormProps) {
  const [state, setState] = useState<String>(filter);
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const router = useRouter();

  // const handleSearch = (value: any) => {
  //   setState(value);
  // };

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

  const columns: ColumnsType<DataType> = [
    {
      key: 'employee',
      title: 'Employee',
      dataIndex: 'fullName',
    },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'right',
          gap: 5,
          marginBottom: 10,
        }}
      >
        <Search
          allowClear
          style={{ width: '100%', marginBottom: 10 }}
          size='middle'
          placeholder='Search emplyee here...'
          className='select-header-list'
          onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
        />

        <Button
          type='primary'
          icon={<ArrowDownOutlined />}
          onClick={() =>
            window.open(
              `${getUrlPrefix()}/reports/payroll/print/payslipPayroll/${selectedRows}`
            )
          }
        >
          DownLoad Payslip
        </Button>
        <Divider type='vertical' />
        <Button
          type='primary'
          icon={<PrinterOutlined />}
          size='middle'
          onClick={() =>
            window.open(
              getUrlPrefix() +
                '/reports/payroll/print/payrollLedgerDownload?id=' +
                router?.query?.id
            )
          }
        >
          DownLoad Payroll Per Register
        </Button>
      </div>

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
            dataSource={data || []}
          />
        </div>
      </Row>
    </div>
  );
}

export default PayslipSearchForm;
