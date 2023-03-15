import React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Col, Row } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import Metrics from "../../../components/Metrics";
import { connect } from "react-redux";
import numeral from "numeral";



const TotalRevenueCard = ({ width, Title, subTitle, numbers, dataKey, loading, data }) => {

  const rev = [
    { name: 'JAN', revenue: _.get(data, "jan") },
    { name: 'FEB', revenue: _.get(data, "feb") },
    { name: 'MAR', revenue: _.get(data, "mar") },
    { name: 'APR', revenue: _.get(data, "apr") },
    { name: 'MAY', revenue: _.get(data, "may") },
    { name: 'JUN', revenue: _.get(data, "jun") },
    { name: 'JUL', revenue: _.get(data, "jul") },
    { name: 'AUG', revenue: _.get(data, "aug") },
    { name: 'SEP', revenue: _.get(data, "sep") },
    { name: 'OCT', revenue: _.get(data, "oct") },
    { name: 'NOV', revenue: _.get(data, "nov") },
    { name: 'DEC', revenue: _.get(data, "dec") },
  ];

  const ex = [
    { name: 'JAN', expense: _.get(data, "jan") },
    { name: 'FEB', expense: _.get(data, "feb") },
    { name: 'MAR', expense: _.get(data, "mar") },
    { name: 'APR', expense: _.get(data, "apr") },
    { name: 'MAY', expense: _.get(data, "may") },
    { name: 'JUN', expense: _.get(data, "jun") },
    { name: 'JUL', expense: _.get(data, "jul") },
    { name: 'AUG', expense: _.get(data, "aug") },
    { name: 'SEP', expense: _.get(data, "sep") },
    { name: 'OCT', expense: _.get(data, "oct") },
    { name: 'NOV', expense: _.get(data, "nov") },
    { name: 'DEC', expense: _.get(data, "dec") },
  ];

  const profit = [
    { name: 'JAN', profit: _.get(data, "jan") },
    { name: 'FEB', profit: _.get(data, "feb") },
    { name: 'MAR', profit: _.get(data, "mar") },
    { name: 'APR', profit: _.get(data, "apr") },
    { name: 'MAY', profit: _.get(data, "may") },
    { name: 'JUN', profit: _.get(data, "jun") },
    { name: 'JUL', profit: _.get(data, "jul") },
    { name: 'AUG', profit: _.get(data, "aug") },
    { name: 'SEP', profit: _.get(data, "sep") },
    { name: 'OCT', profit: _.get(data, "oct") },
    { name: 'NOV', profit: _.get(data, "nov") },
    { name: 'DEC', profit: _.get(data, "dec") },
  ];


  return (
    <Metrics title={Title}>
      <Row>
        <Col xl={11} lg={12} md={24} sm={12} xs={12}>
          <h1 className="gx-mb-1 gx-revenue-title">{loading ? <LoadingOutlined /> : numeral(numbers).format('0,0.00')}</h1>
          <p className="gx-mb-md-0 gx-text-light">{subTitle}</p>
        </Col>
        <Col xl={13} lg={12} md={24} sm={12} xs={12}>

          <ResponsiveContainer className="gx-barchart" width="100%" height={70}>
            <BarChart data={dataKey === "revenue" ? rev : dataKey === "expense" ? ex : profit}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" scale="point" padding={{ left: 5, right: 5 }} />
              <Tooltip />
              <Bar dataKey={dataKey} fill="#FE9E15" barSize={width <= 575 ? 6 : 12} />
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </Metrics>
  );
};


const mapStateToProps = ({ settings }) => {
  const { width } = settings;
  return { width }
};
export default connect(mapStateToProps)(TotalRevenueCard);
