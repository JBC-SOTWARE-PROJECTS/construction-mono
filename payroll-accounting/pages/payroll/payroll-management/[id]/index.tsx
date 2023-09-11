import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import AccessManager from "@/components/accessControl/AccessManager";
import CircularProgress from "@/components/circularProgress";
import { IPageProps } from "@/utility/interfaces";
import { PageHeader, ProCard } from "@ant-design/pro-components";
import {
  Avatar,
  Card,
  Divider,
  List,
  Result,
  Space,
  Tag,
  Typography,
} from "antd";
import { EditOutlined, FieldTimeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { PayrollFormUsage } from "@/components/payroll/PayrollForm";
import useGetOnePayroll from "@/hooks/payroll/useGetOnePayroll";
import dayjs from "dayjs";
import CustomButton from "@/components/common/CustomButton";
import { payrollStatusColorGenerator } from "@/utility/constant-formatters";
import AccessControl from "@/components/accessControl/AccessControl";

const menuItems = [
  {
    title: "Timekeeping",
    icon: <FieldTimeOutlined />,
    link: "/p-timekeeping",
    description: "Records employee work hours for wage calculations.",
  },
  {
    title: "Allowance",
    icon: <FieldTimeOutlined />,
    link: "/p-allowance",
    description: "Manages extra payments like bonuses and commissions.",
  },
  {
    title: "Contributions",
    icon: <FieldTimeOutlined />,
    link: "/p-contributions",
    description:
      "Handles mandatory deductions mandated by the government (SSS, Pag-ibig, PhilHealth).",
  },
  {
    title: "Loans",
    icon: <FieldTimeOutlined />,
    link: "/p-loans",
    description: "Tracks employee loans and repayment deductions.",
  },
  {
    title: "Other Deduction",
    icon: <FieldTimeOutlined />,
    link: "/p-other-deductions",
    description:
      "Manages various deductions, such as healthcare premiums and union dues.",
  },
];
const gridStyle: React.CSSProperties = {
  width: "33%",
  textAlign: "center",
  margin: 0,
  display: "inline-block",
};
const ViewPayroll = ({ account }: IPageProps) => {
  const router = useRouter();

  const [payroll, loadingPayroll] = useGetOnePayroll();
  return (
    <>
      <Head>
        <title>Payroll Management</title>
      </Head>
      <AccessManager roles={["ROLE_ADMIN", "PAYROLL_MANAGER"]}>
        <AccessControl
          allowedPermissions={["view_payroll"]}
          renderNoAccess={
            <Result title="You are not authorized to view this page" />
          }
        >
          <div className="gx-main-content-wrapper-full-width">
            <ProCard
              headStyle={{
                flexWrap: "wrap",
              }}
            >
              <PageHeader
                title={
                  <>
                    {" "}
                    {payroll?.title}{" "}
                    <Tag color={payrollStatusColorGenerator(payroll?.status)}>
                      {payroll?.status}
                    </Tag>
                  </>
                }
                onBack={() => router.back()}
                extra={
                  <Space>
                    <CustomButton
                      type="primary"
                      onClick={() =>
                        router?.push(
                          `/payroll/payroll-management/${router?.query?.id}/edit`
                        )
                      }
                      icon={<EditOutlined />}
                      allowedPermissions={["edit_payroll"]}
                    >
                      Edit Payroll
                    </CustomButton>
                  </Space>
                }
              />
              <Typography.Title level={5}>
                {dayjs(payroll?.dateStart).format(" MMMM D, YYYY")} -
                {dayjs(payroll?.dateEnd).format(" MMMM D, YYYY")}
              </Typography.Title>
              {payroll?.description}
              <Divider />
              <Card bodyStyle={{ padding: 0 }}>
                {menuItems.map((item, index) => (
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
                ))}
              </Card>
            </ProCard>
          </div>
        </AccessControl>
      </AccessManager>
    </>
  );
};

export default ViewPayroll;
