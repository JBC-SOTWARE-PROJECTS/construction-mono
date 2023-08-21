import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import CircularProgress from "@/components/circularProgress";
import AccessManager from "@/components/accessControl/AccessManager";
import { IPageProps } from "@/utility/interfaces";

const EmpProfile = dynamic(
  () => import("@/routes/administrative/Employees/EmployeeDetails"),
  {
    loading: () => <CircularProgress />,
  }
);

const ViewEmployee = ({ account }: IPageProps) => {
  const router = useRouter();
  const empId = router.query.id;

  return (
    <React.Fragment>
      <Head>
        <title>View - Construction IMS Employee</title>
      </Head>
      <AccessManager roles={["ROLE_USER", "ROLE_ADMIN"]}>
        <div className="gx-main-content-wrapper-full-width">
          <EmpProfile account={account} id={empId} />
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default ViewEmployee;
