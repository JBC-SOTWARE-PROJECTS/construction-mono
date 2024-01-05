import React from "react";
import { Divider } from "antd";
import { ProjectUpdates } from "@/graphql/gql/graphql";

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
      <Divider plain>Materials Report</Divider>
    </div>
  );
}
