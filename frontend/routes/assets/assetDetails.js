import React from "react";
import { Card, Row, Col, Divider, Tabs, Spin } from "antd";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useLocalStorage } from "../../util/customhooks";
import _ from "lodash";
import { ASSET_STATUS } from "../../shared/constant";
import AssetJobOrders from "./details/assetJobOrder";
import AssetRepairHistory from "./details/repairHistory";

const { TabPane } = Tabs;
//graphQL Queries
const GET_RECORDS = gql`
  query ($id: UUID) {
    asset: assetById(id: $id) {
      id
      assetCode
      description
      brand
      model
      plateNo
      status
    }
  }
`;

const ProjectDetails = ({ account, id }) => {
  const [active, setActive] = useLocalStorage("assetTab", "cost");

  const { loading, data, refetch } = useQuery(GET_RECORDS, {
    variables: {
      id: id,
    },
  });

  const callback = (e) => {
    setActive(e);
  };

  return (
    <Card title="Asset Details" size="small">
      <Spin spinning={loading}>
        <Row>
          <Col span={24}>
            <div className="w-full">
              <ul className="w-full list-none">
                <li className="w-full flex">
                  <div className="font-bold w-35">Asset Code :</div>
                  <div>{data?.asset?.assetCode}</div>
                </li>
                <li className="w-full flex">
                  <div className="font-bold w-35">Asset Description :</div>
                  <div>{data?.asset?.description}</div>
                </li>
                <li className="w-full flex">
                  <div className="font-bold w-35">Model :</div>
                  <div>{data?.asset?.brand}</div>
                </li>
                <li className="w-full flex">
                  <div className="font-bold w-35">Brand :</div>
                  <div>{data?.asset?.model}</div>
                </li>
                <li className="w-full flex">
                  <div className="font-bold w-35">Plate No :</div>
                  <div>{data?.asset?.plateNo}</div>
                </li>
                <li className="w-full flex">
                  <div className="font-bold w-35">Status :</div>
                  <div>
                    {
                      _.find(ASSET_STATUS, ["value", data?.asset?.status])
                        ?.label
                    }
                  </div>
                </li>
              </ul>
            </div>
          </Col>

          <Col span={24}>
            <Divider>Asset Details</Divider>
            <Tabs
              onChange={callback}
              type="card"
              destroyInactiveTabPane={true}
              activeKey={active}
            >
              <TabPane tab="Job Orders" key="jobs">
                {active === "jobs" && <AssetJobOrders id={id} />}
              </TabPane>
              <TabPane tab="Gasoline Consumption" key="gasoline">
                {/* {active === "gasoline" && <AssetJobOrders id={id} />} */}
              </TabPane>
              <TabPane tab="Repair History" key="repair">
                {active === "repair" && <AssetRepairHistory id={id} />}
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};

export default ProjectDetails;
