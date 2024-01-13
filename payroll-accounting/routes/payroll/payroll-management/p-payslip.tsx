import React from 'react';

import { Button, Input, Tabs } from 'antd';
import { ArrowLeftOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from '@ant-design/pro-components';
import type { TabsProps } from 'antd';
import PayslipForm from './p-form/payslip-form';
import PayrollRegisterEmp from './p-form/payroll-register-emp';

const { Search } = Input;

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Payslip',
    children: <PayslipForm />,
  },
  {
    key: '2',
    label: 'Payroll Register per Employee',
    children: <PayrollRegisterEmp />,
  },
  {
    key: '3',
    label: 'Payroll Register per Project',
    children: 'Content of Tab Pane 3',
  },
];

function PayrollPayslip() {
  const router = useRouter();

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div>
      <PageContainer
        title={
          <>
            <Button
              size='middle'
              onClick={() => router.back()}
              icon={<ArrowLeftOutlined />}
            >
              Payslip Management
            </Button>
          </>
        }
      >
        <ProCard
          headStyle={{
            flexWrap: 'wrap',
          }}
          bordered
          headerBordered
        >
          <Tabs
            type='card'
            defaultActiveKey='1'
            items={items}
            onChange={onChange}
          />
        </ProCard>
      </PageContainer>
    </div>
  );
}

export default PayrollPayslip;
