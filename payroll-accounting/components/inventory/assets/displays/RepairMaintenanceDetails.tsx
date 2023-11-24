import { AssetRepairMaintenance, Assets } from "@/graphql/gql/graphql";
import { Spin, Tag } from "antd";
import moment from "moment";
import React from "react";

interface IParams {
  data: AssetRepairMaintenance | null | undefined;
  loading: boolean;
}
function RepairMaintenanceDetails({ data, loading }: IParams) {
  return (
    <Spin spinning={loading}>
      <div className="dev-right">
        <Tag>{data?.serviceClassification?.replace(/_/g, " ")}</Tag>
        <Tag>{data?.serviceType?.replace(/_/g, " ")}</Tag>
        <Tag>{data?.status?.replace(/_/g, " ")}</Tag>
      </div>
      <table>
        <tr>
          <td>Asset:</td>
          <td style={{ paddingLeft: 10, fontWeight: "bold" }}>
            {data?.asset?.item?.descLong}
          </td>
        </tr>
        <tr>
          <td>Description:</td>
          <td style={{ paddingLeft: 10, fontWeight: "bold" }}>
            {data?.workDescription}
          </td>
        </tr>
        <tr>
          <td>Date Started:</td>
          <td style={{ paddingLeft: 10, fontWeight: "bold" }}>
            {moment(data?.serviceDatetimeStart).format("LL")}
          </td>
        </tr>
        <tr>
          <td>Date Finished:</td>
          <td style={{ paddingLeft: 10, fontWeight: "bold" }}>
            {moment(data?.serviceDatetimeFinished).format("LL") }
          </td>
        </tr>
      </table>
    </Spin>
  );
}

export default RepairMaintenanceDetails;
