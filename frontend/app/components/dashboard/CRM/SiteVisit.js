import _ from "lodash";
import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";


const SiteVisit = ({ gross, discount, net }) => {

  const dateCharts = [
    { name: 'JAN', Gross: _.get(gross, "jan", 0), Discount: _.get(discount, "jan", 0), NetSales: _.get(net, "jan", 0) },
    { name: 'FEB', Gross: _.get(gross, "feb", 0), Discount: _.get(discount, "feb", 0), NetSales: _.get(net, "feb", 0) },
    { name: 'MAR', Gross: _.get(gross, "mar", 0), Discount: _.get(discount, "mar", 0), NetSales: _.get(net, "mar", 0) },
    { name: 'APR', Gross: _.get(gross, "apr", 0), Discount: _.get(discount, "apr", 0), NetSales: _.get(net, "apr", 0) },
    { name: 'MAY', Gross: _.get(gross, "may", 0), Discount: _.get(discount, "may", 0), NetSales: _.get(net, "may", 0) },
    { name: 'JUN', Gross: _.get(gross, "jun", 0), Discount: _.get(discount, "jun", 0), NetSales: _.get(net, "jun", 0) },
    { name: 'JUL', Gross: _.get(gross, "jul", 0), Discount: _.get(discount, "jul", 0), NetSales: _.get(net, "jul", 0) },
    { name: 'AUG', Gross: _.get(gross, "aug", 0), Discount: _.get(discount, "aug", 0), NetSales: _.get(net, "aug", 0) },
    { name: 'SEP', Gross: _.get(gross, "sep", 0), Discount: _.get(discount, "sep", 0), NetSales: _.get(net, "sep", 0) },
    { name: 'OCT', Gross: _.get(gross, "oct", 0), Discount: _.get(discount, "oct", 0), NetSales: _.get(net, "oct", 0) },
    { name: 'NOV', Gross: _.get(gross, "nov", 0), Discount: _.get(discount, "nov", 0), NetSales: _.get(net, "nov", 0) },
    { name: 'DEC', Gross: _.get(gross, "dec", 0), Discount: _.get(discount, "dec", 0), NetSales: _.get(net, "dec", 0) },
  ];


  return (
    <div className="gx-site-dash gx-pr-xl-5 gx-pt-3 gx-pt-xl-0 gx-pt-xl-2">
      <h6 className="gx-text-uppercase gx-mb-2 gx-mb-xl-4">Sales Report</h6>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={dateCharts}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" scale="point" padding={{ left: 5, right: 5 }} />
          <Tooltip />
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <Area type='monotone' dataKey='Gross' fillOpacity={1} stroke='#038FDE' fill='#038FDE' />
          <Area type='monotone' dataKey='Discount' fillOpacity={1} stroke='#FE9E15' fill='#f44336' />
          <Area type='monotone' dataKey='NetSales' fillOpacity={1} stroke='#FE9E15' fill='#FE9E15' />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SiteVisit;

