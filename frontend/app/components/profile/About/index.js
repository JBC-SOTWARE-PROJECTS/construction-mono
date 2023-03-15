import React from "react";
import { Col, Row, Tabs } from "antd";
import Widget from "../../../components/Widget";
import AboutItem from "./AboutItem";


const TabPane = Tabs.TabPane;

const About = ({ overview, work, others }) => {

  return (
    <Widget title="Employee Details" styleName="gx-card-tabs gx-card-profile">
      <Tabs className='gx-tabs-right' defaultActiveKey="1">
        <TabPane tab="Overview" key="1">
          <div className="gx-mb-2">
            <Row>
              {overview.map((ov, index) =>
                <Col key={index} {...ov.col}>
                  <AboutItem data={ov} />
                </Col>
              )}
            </Row>
          </div>
        </TabPane>
        <TabPane tab="Work" key="2">
          <div className="gx-mb-2">
            <Row>{work.map((wk, index) =>
              <Col key={index} {...wk.col}>
                <AboutItem data={wk} />
              </Col>
            )}
            </Row>
          </div>
        </TabPane>
        <TabPane tab="Others" key="3">
          <div className="gx-mb-2">
            <Row>
              {others.map((ot, index) =>
                <Col key={index} {...ot.col}>
                  <AboutItem data={ot} />
                </Col>
              )}
            </Row>
          </div>
        </TabPane>
      </Tabs>
    </Widget>
  );
}


export default About;
