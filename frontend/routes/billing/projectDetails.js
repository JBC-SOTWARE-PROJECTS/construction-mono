import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Divider,
  Skeleton,
  Typography,
  Tabs,
  Spin,
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useLocalStorage } from "../../util/customhooks";
import { col2 } from "../../shared/constant";
import moment from "moment";
import numeral from "numeral";
import _ from "lodash";
import ProjectCost from "./details/projectCost";
import ProjectUpdates from "./details/projectUpdates";
import ProjectMaterials from "./details/projectMaterials";

const { Text } = Typography;
const { TabPane } = Tabs;
//graphQL Queries
const GET_RECORDS = gql`
  query ($id: UUID) {
    project: projectById(id: $id) {
      id
      projectCode
      description
      projectStarted
      projectEnded
      customer {
        id
        customerType
        address
        fullName
      }
      location {
        id
        officeDescription
        fullAddress
      }
      remarks
      totals
      status
    }
  }
`;

const ProjectDetails = ({ account, id }) => {
  const [active, setActive] = useLocalStorage("projectsTab", "cost");

  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: id,
    },
  });

  const callback = (e) => {
    setActive(e);
  };

  return (
    <Card title="Projects Details" size="small">
      <Spin spinning={loading}>
        <Row>
          <Col {...col2}>
            <div className="w-full">
              <ul className="w-full list-none">
                <li className="w-full flex">
                  <div className="font-bold w-35">Customer :</div>
                  <div>{data?.project?.customer?.fullName}</div>
                </li>
                <li className="w-full flex">
                  <div className="font-bold w-35">Customer Address :</div>
                  <div>{data?.project?.customer?.address}</div>
                </li>
                <li className="w-full flex">
                  <div className="font-bold w-35">Project Number :</div>
                  <div>{data?.project?.projectCode}</div>
                </li>
                <li className="w-full flex">
                  <div className="font-bold w-35">Project Started :</div>
                  <div>
                    {moment(data?.project?.projectStarted).format(
                      "MMMM DD, YYYY"
                    )}
                  </div>
                </li>
                <li className="w-full flex">
                  <div className="font-bold w-35">Estimate Project End :</div>
                  <div>
                    {moment(data?.project?.projectEnded).format(
                      "MMMM DD, YYYY"
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </Col>
          <Col {...col2}>
            <div className="w-full">
              <ul className="w-full list-none">
                <li className="w-full flex">
                  <div className="font-bold w-35">Project Description:</div>
                  <div>{data?.project?.description}</div>
                </li>
                <li className="w-full flex">
                  <div className="font-bold w-35">Project Location :</div>
                  <div>{data?.project?.location?.fullAddress}</div>
                </li>
                <li className="w-full flex">
                  <div className="font-bold w-35">Remarks/Notes :</div>
                  <div>{data?.project?.remarks}</div>
                </li>
                <li className="w-full flex">
                  <div className="font-bold w-35">Total Cost :</div>
                  <Text type="success">
                    {numeral(data?.project?.totals).format("0,0.00")}
                  </Text>
                </li>
              </ul>
            </div>
          </Col>
          <Col span={24}>
            <Divider>Projects Details</Divider>
            <Tabs
              onChange={callback}
              type="card"
              destroyInactiveTabPane={true}
              activeKey={active}
            >
              <TabPane tab="Project Cost Details" key="cost">
                <ProjectCost id={id} parentRef={() => refetch()} />
              </TabPane>
              <TabPane tab="Project Updates" key="updates">
                <ProjectUpdates id={id} />
              </TabPane>
              <TabPane tab="Project Materials Used" key="materials">
                <ProjectMaterials id={id} />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};

export default ProjectDetails;
