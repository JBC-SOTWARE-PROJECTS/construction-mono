import React from "react";
import { Col, Divider, Row } from "antd";
import { ProjectUpdates } from "@/graphql/gql/graphql";
import ProjectAccomplishmentMaterialsTable from "./materialsTable";
import ProjectAccomplishmentWorkersTable from "./workersTable";

interface Iprops {
  record: ProjectUpdates;
}

export default function AccomplishmentDetails(props: Iprops) {
  const { record } = props;
  return (
    <div className="w-full">
      <div className="w-full">
        <p>
          <span className="font-bold">Weather:&nbsp;</span>
          <span>{record?.weather}</span>
        </p>
        <p>
          <span className="font-bold">Accomplishment</span>
          <br />
          <span className="w-full">{record?.accomplishment}</span>
        </p>
      </div>
      <Divider plain>Total Number of Workers</Divider>
      <Row>
        <Col span={24}>
          <ProjectAccomplishmentWorkersTable projectUpdateId={record.id} isLocked={record?.status !== "ACTIVE"} />
        </Col>
      </Row>
      <Divider plain>Materials Report</Divider>
      <Row>
        <Col span={24}>
          <ProjectAccomplishmentMaterialsTable projectUpdateId={record.id} isLocked={record?.status !== "ACTIVE"}  />
        </Col>
      </Row>
    </div>
  );
}
