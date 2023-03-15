import React from "react";
import { Typography } from "antd";
import _ from "lodash";
import { MoneyCollectOutlined } from '@ant-design/icons';
import numeral from "numeral";

const { Title } = Typography

const WelComeCard = ({ account, gross, discount, net }) => {

  return (
    <div className="gx-wel-ema gx-pt-xl-2">
      <h1 className="gx-mb-3">{`Welcome ${_.startCase(_.toLower(account?.initialName))}`}</h1>
      <p className="gx-fs-sm gx-text-uppercase">You Have</p>
      <ul className="gx-list-group">
        <li>
          <MoneyCollectOutlined />
          <span><span style={{ color: "#038FDE" }}>{numeral(gross).format('0,0.00')}</span> Total Gross</span>
        </li>
        <li>
          <MoneyCollectOutlined />
          <span><span style={{ color: "#f44336" }}>{numeral(discount).format('0,0.00')}</span> Total Discount</span>
        </li>
        <li>
          <MoneyCollectOutlined />
          <span><span style={{ color: "#FE9E15" }}>{numeral(net).format('0,0.00')}</span> Net Sales</span>
        </li>
      </ul>
    </div>

  );
};

export default WelComeCard;
