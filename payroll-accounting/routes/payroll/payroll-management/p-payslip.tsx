import React, { useState } from 'react';

import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { PageContainer, ProCard } from '@ant-design/pro-components';

import PayslipSearchForm from './p-form/payslip-search-form';
import { useQuery } from '@apollo/client';
import { GET_ALL_PAYROLL_EMPLOYEE } from '@/graphql/company/queries';
import useGetPayrollEmployeesPageable, {
  variables,
} from '@/hooks/payroll/useGetPayrollEmployeesPageable';

// const initialState: IState = {
//   filter: '',
//   status: true,
//   page: 0,
//   size: 10,
//   office: null,
//   position: null,
// };

const initialState: variables = {
  filter: '',
  size: 500,
  page: 0,
  status: [],
};

function PayrollPayslip() {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [selectedEmp, setSelectedEmp] = useState<any[]>([]);
  const [viewEmp, setViewEmp] = useState<any>();
  console.log('router', router?.query?.id);

  const { data, loading, refetch } = useQuery(GET_ALL_PAYROLL_EMPLOYEE, {
    variables: {
      id: router?.query?.id,
    },
  });

  // const { data: payrollEmp } = useQuery(FETCH_PAYROLL_EMP, {
  //   variables: {
  //     filter: state.filter,
  //     page: state.page,
  //     pageSize: state.size,
  //     payrollId: router?.query?.id,
  //   },
  // });

  const [employees, loadingPayrollEmployees,refetchEmployees, totalElements, ] =
    useGetPayrollEmployeesPageable({ variables: state });

    const handleFilterChange = (value:any) => {
      setState({ ...state, filter: value });
      refetchEmployees();
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
          <PayslipSearchForm
            setSelectedEmp={setSelectedEmp}
            viewEmp={setViewEmp}
            loading={loadingPayrollEmployees}
            data={employees || []}
            filter={state.filter}
            refetchEmployees={handleFilterChange}
          />
        </ProCard>
      </PageContainer>
    </div>
  );
}

export default PayrollPayslip;
