import React from "react";

import EmployeeCell from "./EmployeeCell/index";

const EmployeeList = ({ emplist, onUpdateStatus }) => {
  return (
    <div className="gx-contact-main-content">
      {(emplist || []).map((data, index) =>
        <EmployeeCell key={index} employee={data} onUpdateStatus={onUpdateStatus} />
      )}

    </div>
  )
};

export default EmployeeList;
