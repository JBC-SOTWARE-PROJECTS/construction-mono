import React from "react";
import { Col, Divider, Row } from "antd";
import { ProjectProgress } from "@/graphql/gql/graphql";
import ProjectProgressImagesLists from "./progressImages";

interface Iprops {
  record: ProjectProgress;
}

export default function ProgressDetails(props: Iprops) {
  const { record } = props;
  return (
    <div className="w-full">
      <div className="w-full">
        <p>
          <span className="font-bold">Progress Report</span>
          <br />
          <span className="w-full">{record?.progress}</span>
        </p>
      </div>
      <Divider plain>Project Images Updates</Divider>
      <Row>
        <Col span={24}>
          <ProjectProgressImagesLists projectProgressId={record?.id} isLocked={record?.status !== "ACTIVE"} />
        </Col>
      </Row>
    </div>
  );
}
