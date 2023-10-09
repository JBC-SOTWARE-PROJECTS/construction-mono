import React from "react";

interface IParams {
  fullName: any;
  position: string;
}
function EmployeeDetails({ fullName, position }: IParams) {
  return (
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
  );
}

export default EmployeeDetails;
