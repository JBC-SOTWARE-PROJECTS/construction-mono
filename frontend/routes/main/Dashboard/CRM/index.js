import React, { useContext, useState } from "react";
import { Alert, Col, Row } from "antd";
import SiteVisit from "../../../../app/components/dashboard/CRM/SiteVisit";
import WelComeCard from "../../../../app/components/dashboard/CRM/WelComeCard";
import SiteAudience from "../../../../app/components/dashboard/CRM/SiteAudience";
import { AccountContext } from "../../../../app/components/accessControl/AccountContext";
import TotalRevenueCard from "../../../../app/components/dashboard/CRM/TotalRevenueCard";
import IconWithTextCard from "../../../../app/components/dashboard/CRM/IconWithTextCard";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";
import numeral from "numeral";
import moment from "moment";


const GET_RECORDS = gql`
query($start: String, $end: String, $date: String){
    ongoing: jobCountStatus(status: "ONGOING")
    completed: jobCountStatus(status: "COMPLETED")
    pending: jobCountStatus(status: "PENDING")
    revenue: totalRevenue(start: $start, end: $end)
    expense: totalExpense(start: $start, end: $end)
    cashBalance: totalCashBalance(start: $start, end: $end)
    gross: totalGross(start: $start, end: $end, filter: "")
    deduction: totalDeduction(start: $start, end: $end, filter: "")
    net: netSales(start: $start, end: $end, filter: "")
    chartGross: salesChartsGross(date: $date) {
      jan
      feb
      mar
      apr
      may
      jun
      jul
      aug
      sep
      oct
      nov
      dec: dece
    }
    chartDeduct: salesChartsDeduct(date: $date) {
      jan
      feb
      mar
      apr
      may
      jun
      jul
      aug
      sep
      oct
      nov
      dec: dece
    }
    chartNet: salesChartsNet(date: $date) {
      jan
      feb
      mar
      apr
      may
      jun
      jul
      aug
      sep
      oct
      nov
      dec: dece
    }
    chartRevenue: salesChartsRevenue(date: $date) {
      jan
      feb
      mar
      apr
      may
      jun
      jul
      aug
      sep
      oct
      nov
      dec: dece
    }
    chartExpense: salesChartsExpense(date: $date) {
      jan
      feb
      mar
      apr
      may
      jun
      jul
      aug
      sep
      oct
      nov
      dec: dece
    }
    chartProfit : salesChartsProfit(date: $date) {
      jan
      feb
      mar
      apr
      may
      jun
      jul
      aug
      sep
      oct
      nov
      dec: dece
    }
}`;

const CRM = () => {
  const account = useContext(AccountContext);
  const [state, setState] = useState({
    start: moment().startOf('month').format('YYYY-MM-DD'),
    end: moment().endOf('month').format('YYYY-MM-DD')
  })

  const { loading, data } = useQuery(GET_RECORDS, {
    variables: {
      start: state.start,
      end: state.end,
      date: moment().format('YYYY') + '-01-01'
    },
    fetchPolicy: 'network-only',
  });


  return (
    <React.Fragment>
      <Row>
        <Col span={24}>
          <Alert
            description={`Showing Reports from ${moment(state.start).format('MM/DD/YYYY')} to ${moment(state.end).format('MM/DD/YYYY')}`}
            type="info"
            showIcon
          />
        </Col>
        <Col span={24}>
          <div className="gx-card">
            <div className="gx-card-body">
              <Row>
                <Col xl={6} lg={12} md={12} sm={12} xs={24}>
                  <WelComeCard account={account} gross={_.get(data, "gross", 0)} discount={_.get(data, "deduction", 0)} net={_.get(data, "net", 0)} />
                </Col>
                <Col xl={18} lg={24} md={24} sm={24} xs={24} className="gx-visit-col">
                  <SiteVisit gross={_.get(data, "chartGross")} discount={_.get(data, "chartDeduct")} net={_.get(data, "chartNet")} />
                </Col>
              </Row>
            </div>
          </div>
        </Col>
        <Col xl={8} lg={24} md={8} sm={24} xs={24}>
          <TotalRevenueCard Title={"TOTAL REVENUE"} subTitle={"Revenue (Php)"} numbers={_.get(data, "revenue", 0)} dataKey="revenue" loading={loading} data={_.get(data, "chartRevenue")} />
        </Col>
        <Col xl={8} lg={12} md={8} sm={24} xs={24}>
          <TotalRevenueCard Title={"TOTAL EXPENSES"} subTitle={"Expenses (Php)"} numbers={_.get(data, "expense", 0)} dataKey="expense" loading={loading} data={_.get(data, "chartExpense")} />
        </Col>
        <Col xl={8} lg={12} md={8} sm={24} xs={24}>
          <TotalRevenueCard Title={"CASH BALANCE"} subTitle={"Cash Balance (Php)"} numbers={_.get(data, "cashBalance", 0)} dataKey="profit" loading={loading} data={_.get(data, "chartProfit")} />
        </Col>


        <Col xl={24} lg={24} md={24} sm={24} xs={24} className="gx-order-sm-1">
          <Row>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <IconWithTextCard cardColor="blue" icon="tasks" loading={loading} title={numeral(_.get(data, "ongoing")).format('0,0')} subTitle="Ongoing Projects" />
            </Col>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <IconWithTextCard cardColor="green" icon="select" loading={loading} title={numeral(_.get(data, "completed")).format('0,0')} subTitle="Completed Projects" />
            </Col>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <IconWithTextCard cardColor="red" icon="spam" loading={loading} title={numeral(_.get(data, "pending")).format('0,0')} subTitle="Pending Projects" />
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default CRM;
