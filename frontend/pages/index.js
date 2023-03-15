import React from 'react';
import AccessManager from "../app/components/accessControl/AccessManager";
import CrmDashboard from "./main/dashboard/crm";

const homePage = (props) => {

  return (
    <AccessManager roles={['ROLE_USER', 'ROLE_ADMIN']}>
      <CrmDashboard />
    </AccessManager>
  )
}

export default homePage;
