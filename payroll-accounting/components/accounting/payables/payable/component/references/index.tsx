import React from "react";
import ReceivingItemsTable from "./receivingTable";
import { Empty } from "antd";

interface IProps {
  recId?: string;
}

export default function APReferencesTable(props: IProps) {
  return (
    <div className="w-full">
      {props?.recId && <ReceivingItemsTable recId={props?.recId} />}
      {!props?.recId && <Empty description="No References" />}
    </div>
  );
}
