import React from "react";
import { Row, Col, List } from "antd";
import Widget from "../../../components/Widget";
import { col2 } from "../../../../shared/constant";


const Biography = ({ data }) => {
  console.log(data)
  return (
    <Widget styleName="gx-card-profile">
      <div className="ant-card-head">
        <span className="ant-card-head-title gx-mb-2">{`User Information & Permissions`}</span>
        <p className="gx-text-grey gx-fs-sm gx-mb-0">Username: {data?.login}</p>
      </div>
      <Row>
        <Col {...col2}>
          <List
            size="small"
            header={<div style={{ fontWeight: 'bold' }}>Roles</div>}
            bordered
            dataSource={data?.roles}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </Col>
        <Col {...col2}>
          <List
            size="small"
            header={<div style={{ fontWeight: 'bold' }}>Permissions</div>}
            bordered
            dataSource={data?.accessNames}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </Col>
      </Row>

    </Widget>
  )
}


export default Biography;
