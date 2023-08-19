import React from "react";
import asyncComponent from "@/utility/asyncComponent";

const CompanyComponent = asyncComponent(
  () => import("@/routes/administrative/companies")
);

const CompanyPage = () => {
  return <CompanyComponent />;
};

export default CompanyPage;
