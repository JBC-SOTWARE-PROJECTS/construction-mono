import React, { useState } from "react";

import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { PageContainer, ProCard } from "@ant-design/pro-components";

import PayslipSearchForm from "./p-form/payslip-search-form";
import { useQuery } from "@apollo/client";
import { GET_ALL_PAYROLL_EMPLOYEE } from "@/graphql/company/queries";
import useGetPayrollEmployeesPageable, {
  variables,
} from "@/hooks/payroll/useGetPayrollEmployeesPageable";

const initialState: variables = {
  filter: "",
  size: 25,
  page: 0,
  status: [],
};

function PayrollPayslip() {
  const router = useRouter();
  const [state, setState] = useState(initialState);

  const { data, loading, refetch } = useQuery(GET_ALL_PAYROLL_EMPLOYEE, {
    variables: {
      id: router?.query?.id,
    },
  });

  const [employees, loadingPayrollEmployees, totalElements] =
    useGetPayrollEmployeesPageable({ variables: state });

  return (
    <div>
      <PageContainer
        title={
          <>
            <Button
              size="middle"
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
            flexWrap: "wrap",
          }}
          bordered
          headerBordered
        >
          <PayslipSearchForm
            loading={loadingPayrollEmployees}
            data={employees || []}
            filter={state.filter}
            onSearch={(value) => setState({ ...state, filter: value })}
          />
        </ProCard>
      </PageContainer>
    </div>
  );
}

export default PayrollPayslip;
