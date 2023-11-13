import { Assets } from "@/graphql/gql/graphql";
import { Spin } from "antd";
import React from "react";

interface IParams {
  asset: Assets;
  loading: boolean;
  
}
function AssetDetails({ asset, loading}: IParams) {
  return (
    <Spin spinning={loading}>
      <table>
        <tr>
          <td>Asset:</td>
          <td style={{ paddingLeft: 10, fontWeight: "bold" }}>{asset?.item?.descLong}</td>
        </tr>
        <tr>
          <td>Code:</td>
          <td style={{ paddingLeft: 10, fontWeight: "bold" }}>{asset?.assetCode}</td>
        </tr>
        <tr>
          <td>Model:</td>
          <td style={{ paddingLeft: 10, fontWeight: "bold" }}>{asset?.model}</td>
        </tr>
      </table>
    </Spin>
  );
}

export default AssetDetails;
