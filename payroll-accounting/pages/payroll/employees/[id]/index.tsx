import AccessManager from "@/components/accessControl/AccessManager";
import EmployeeManagementHeader from "@/components/administrative/employees/EmployeeManagementHeader";
import EmployeeDetails from "@/components/common/EmployeeDetails";
import { useGetEmployeeById } from "@/hooks/employee";
import { IPageProps } from "@/utility/interfaces";
import { EditOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Button, Card, Divider, Typography } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const { Meta } = Card;
import React from "react";

const gridStyle: React.CSSProperties = {
  width: "33%",
  textAlign: "center",
  margin: 0,
  display: "inline-block",
};
const menuItems = [
  {
    title: "Attendance",
    icon: <FieldTimeOutlined />,
    link: "/attendance",
    description: "Records employee work hours for wage calculations.",
    show: true,
  },
  {
    title: "Allowance",
    icon: <FieldTimeOutlined />,
    link: "/allowance",
    description: "Manages extra payments like bonuses and commissions.",
    show: true,
  },
  {
    title: "Loans",
    icon: <FieldTimeOutlined />,
    link: "/loans",
    description: "Tracks employee loans and repayment deductions.",
    show: true,
  },
  {
    title: "Leave",
    icon: <FieldTimeOutlined />,
    link: "/leave",
    description: "Tracks and manages employee leave requests .",
    show: true,
  },
  // {
  //   title: "Other Deduction",
  //   icon: <FieldTimeOutlined />,
  //   link: "/p-other-deductions",
  //   description:
  //     "Manages various deductions, such as healthcare premiums and union dues.",
  //   show: true,
  // },
];

const ViewEmployee = ({ account }: IPageProps) => {
  const router = useRouter();
  const [employee, loadingEmployee] = useGetEmployeeById(router?.query?.id);

  return (
    <React.Fragment>
      <Head>
        <title>View - Construction IMS Employee</title>
      </Head>
      <AccessManager roles={["ROLE_USER", "ROLE_ADMIN"]}>
        <div className="gx-main-content-wrapper-full-width">
          <ProCard
            headStyle={{
              flexWrap: "wrap",
            }}
          >
            <EmployeeManagementHeader title="Employee Management">
            <Card
              hoverable
              style={{ width: 240, marginBottom: 20 }}
              cover={<img alt="example" height={200} style={{objectFit: 'cover'}} src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=1380&t=st=1707239619~exp=1707240219~hmac=a39f2138ffae5270dd2812f14625ba8cd87ba5782043aba7c2ddc05afb7ec94d" />}
            >
              <Meta title={employee?.fullName} description={employee?.position?.description} />
            </Card>
              {/* <EmployeeDetails
                loading={loadingEmployee}
                fullName={employee?.fullName}
                position={employee?.position?.description}
              /> */}
              <Button
                icon={<EditOutlined />}
                type="default"
                onClick={() => {
                  router.push(`/payroll/employees/${router?.query?.id}/edit`);
                }}
              >
                Edit Employee Information
              </Button>
            </EmployeeManagementHeader>

            <Divider />
            <Card bodyStyle={{ padding: 0 }}>
              {menuItems.map(
                (item, index) =>
                  item.show === true && (
                    <Link
                      href={`${router.asPath}${item.link}`}
                      passHref
                      legacyBehavior
                      key={index}
                      style={{ display: "inline" }}
                    >
                      <a style={{ textDecoration: "none" }}>
                        <Card.Grid
                          style={gridStyle}
                          key={index}
                          onClick={() => {}}
                        >
                          <Typography.Title level={4}>
                            {item.title}
                          </Typography.Title>
                          {item.description}
                        </Card.Grid>
                      </a>
                    </Link>
                  )
              )}
            </Card>
          </ProCard>
        </div>
      </AccessManager>
    </React.Fragment>
  );
};

export default ViewEmployee;
