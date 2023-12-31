import React, { useState } from 'react';

import { Card, Col, Divider, Row, Skeleton } from 'antd';
import { styled } from 'styled-components';
import PayslipSearchForm from './payslip-search-form';
import { useGetEmployeesByFilter } from '@/hooks/employee';
import { IState } from '../../employees';
import { Employee } from '@/graphql/gql/graphql';
import { isEmpty } from 'lodash';
import {
  grossName,
  headerConstant,
  payrollDeduction,
} from '@/utility/constant';

const { Meta } = Card;

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

interface Emp {
  id: string;
  employeeNo: string;
  fullName: string;
  position: pos;
  office: office;
  emailAddress: string;
  employeeCelNo: string;
  gender: string;
}

function PayslipForm() {
  const [state, setState] = useState(initialState);
  const [selectedEmp, setSelectedEmp] = useState<any[]>([]);
  const [viewEmp, setViewEmp] = useState<Emp>();
  const cardExtraContent = headerConstant.map((item, index) => (
    <Span key={index}>{item.title}</Span>
  ));

  const grossTitle = grossName.map((item, index) => (
    <div key={index}>{item.title}</div>
  ));

  const payrollTitle = payrollDeduction.map((item, index) => (
    <div key={index}>{item.title}</div>
  ));

  const [employees, loadingEmployees] = useGetEmployeesByFilter({
    variables: state,
    fetchPolicy: 'network-only',
  });

  return (
    <div>
      <Row gutter={4}>
        <Col md={14}>
          {!isEmpty(viewEmp) ? (
            <>
              <Card style={styles}>
                <Row gutter={2}>
                  <Col md={12}>
                    <Span> Employee ID :</Span>
                  </Col>
                  <Col md={12}>
                    <Span> Payroll Code:</Span>
                  </Col>
                  <Col md={12}>
                    <Span> Employee Name : {viewEmp.fullName}</Span>
                  </Col>
                  <Col md={12}>
                    <Span> Pay Period :</Span>
                  </Col>
                  <Col md={12}>
                    <Span>
                      {' '}
                      Departement : {viewEmp?.office?.officeDescription}
                    </Span>
                  </Col>
                  <Col md={12}>
                    <Span> Paycheck Date :</Span>
                  </Col>
                </Row>

                <Row gutter={2} style={{ marginTop: 20 }}>
                  <Col md={12}>
                    <Col md={24}>
                      <Card
                        title='Gross'
                        bordered={false}
                        style={{ width: '100%' }}
                        extra={
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'flex-end',
                              gap: '10px',
                            }}
                          >
                            {cardExtraContent}
                          </div>
                        }
                      >
                        {grossTitle}
                        <Divider />
                        <Meta title='Total Gross Pay = ' />
                      </Card>
                    </Col>
                  </Col>
                  <Col md={12}>
                    <Col md={24}>
                      <Card
                        title='Payroll Deduction'
                        bordered={false}
                        style={{ width: '100%' }}
                        extra={
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                            }}
                          >
                            {cardExtraContent}
                          </div>
                        }
                      >
                        {payrollTitle}
                        <Divider />
                        <Meta title='Total Payroll Deduction = ' />
                      </Card>
                    </Col>
                  </Col>

                  <Col md={24} style={{ marginTop: 20 }}>
                    <Card
                      title='Adjustment'
                      bordered={false}
                      style={{ width: '100%' }}
                      extra={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                          }}
                        >
                          {cardExtraContent}
                        </div>
                      }
                    >
                      example 1
                      <Divider />
                      <Meta title='Total Adjustment = ' />
                      <Divider />
                      <Meta title='NET PAY = ' />
                    </Card>
                  </Col>
                </Row>
              </Card>
            </>
          ) : (
            <Skeleton active />
          )}
        </Col>
        <Col md={10}>
          <Card style={styles}>
            <div>
              <PayslipSearchForm
                setSelectedEmp={setSelectedEmp}
                viewEmp={setViewEmp}
                loading={loadingEmployees}
                dataSource={employees}
                filter={state.filter}
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
