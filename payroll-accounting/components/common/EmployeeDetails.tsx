import { Spin } from "antd";
import React from "react";

interface IParams {
  fullName: any;
  position: string;
  loading?: boolean;
}
function EmployeeDetails({ fullName, position, loading = false }: IParams) {
  return (
    <Spin spinning={loading}>
      <table>
        <tr>
          <td>Name:</td>
          <td style={{ paddingLeft: 10, fontWeight: "bold" }}>{fullName}</td>
        </tr>
        <tr>
          <td>Position:</td>
          <td style={{ paddingLeft: 10, fontWeight: "bold" }}>{position}</td>
        </tr>
      </table>
    </Spin>
  );
}

export default EmployeeDetails;
