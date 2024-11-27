import React, { ReactNode, useState } from 'react';

import { Card, Col, Collapse, CollapseProps, Row, Skeleton } from 'antd';
import { styled } from 'styled-components';
import PayslipSearchForm from './payslip-search-form';
import { useGetEmployeesByFilter } from '@/hooks/employee';
import { IState } from '../../employees';
import { isEmpty } from 'lodash';
import { grossName, payrollDeduction } from '@/utility/constant';
import { useQuery } from '@apollo/client';
import { GET_ALL_PAYROLL_EMPLOYEE } from '@/graphql/company/queries';
import { useRouter } from 'next/router';

const initialState: IState = {
  filter: '',
  status: true,
  page: 0,
  size: 10,
  office: null,
  position: null,
};

interface office {
  id: string;
  officeDescription: string;
}

interface pos {
  id: string;
  description: string;
}

function PayslipForm() {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [selectedEmp, setSelectedEmp] = useState<any[]>([]);
  const [viewEmp, setViewEmp] = useState<any>();

  const grossTitle = grossName.map((item, index) => (
    <div key={index}>
      <Row gutter={2}>
        <Col md={20}>{item.title}</Col>
        <Col md={4}>
          <span style={{ float: 'right' }}> {item.total} 1000</span>
        </Col>
      </Row>
    </div>
  ));

  const payrollTitle = payrollDeduction.map((item, index) => (
    <div key={index}>
      <Row gutter={2}>
        <Col md={20}>{item.title}</Col>
        <Col md={4}>
          <span style={{ float: 'right' }}> {item.total} 1000</span>
        </Col>
      </Row>
    </div>
  ));

  const { data, loading, refetch } = useQuery(GET_ALL_PAYROLL_EMPLOYEE, {
    variables: {
      id: router?.query?.id,
    },
  });

  const onChange = (key: string | string[]) => {};

  const text = `Adjustment Example`;

  const genExtra = (type: string): ReactNode => {
    if (type === 'gross') {
      return <div>Total : 14000 </div>;
    } else if (type === 'deduction') {
      return <div>Total : 800 </div>;
    } else if (type === 'adjustment') {
      return <div>Total : 200</div>;
    } else {
      return null;
    }
  };

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Gross',
      children: <p>{grossTitle}</p>,
      extra: genExtra('gross'),
    },
    {
      key: '2',
      label: 'Payroll Deduction',
      children: <p>{payrollTitle}</p>,
      extra: genExtra('deduction'),
    },
    {
      key: '3',
      label: 'Adjustment',
      children: <p>{text}</p>,
      extra: genExtra('adjustment'),
    },
  ];

  return (
    <div>
      <Row gutter={4}>
        {/* <Col md={14}>
          {!isEmpty(viewEmp) ? (
            <>
              <Card style={styles}>
                <Row gutter={2}>
                  <Col md={12}>
                    <Span> Employee ID : {viewEmp?.employee?.employeeNo}</Span>
                  </Col>
                  <Col md={12}>
                    <Span> Payroll Code:</Span>
                  </Col>
                  <Col md={12}>
                    <Span> Employee Name : {viewEmp?.employee?.fullName}</Span>
                  </Col>
                  <Col md={12}>
                    <Span> Pay Period :</Span>
                  </Col>
                  <Col md={12}>
                    <Span> Departement : {viewEmp?.company?.companyName}</Span>
                  </Col>
                  <Col md={12}>
                    <Span> Paycheck Date :</Span>
                  </Col>
                </Row>

                <Row style={{ marginTop: 20 }}>
                  <Col md={24}>
                    <Collapse
                      style={{
                        backgroundColor: '#399b53',
                        fontWeight: 'bold',
                      }}
                      defaultActiveKey={['1']}
                      onChange={onChange}
                      items={items}
                    />
                  </Col>
                </Row>
              </Card>
            </>
          ) : (
            <Skeleton active />
          )}
        </Col> */}
        <Col md={24}>
          <Card style={styles}>
            <div>
              <PayslipSearchForm
                setSelectedEmp={setSelectedEmp}
                viewEmp={setViewEmp}
                loading={loading}
                data={data}
                filter={state.filter}
                refetchEmployees={refetch}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const Span = styled.span`
  font-weight: bold;
`;

const styles = {
  backgroundColor: '#f0eded',
};

export default PayslipForm;
