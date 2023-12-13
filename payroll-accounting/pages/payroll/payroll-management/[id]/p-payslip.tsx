import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import CircularProgress from '@/components/circularProgress';

const Component = dynamic(
  () => import('@/routes/payroll/payroll-management/p-payslip'),
  {
    loading: () => <CircularProgress />,
  }
);

const PayrollPayslip = () => (
  <React.Fragment>
    <Head>
      <title>Payroll Management</title>
    </Head>
    <div className='gx-main-content-wrapper-full-width'>
      <Component />
    </div>
  </React.Fragment>
);

export default PayrollPayslip;
