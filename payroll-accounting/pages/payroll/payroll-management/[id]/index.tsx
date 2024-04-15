import AccessControl from "@/components/accessControl/AccessControl";
import AccessManager from "@/components/accessControl/AccessManager";
import CustomButton from "@/components/common/CustomButton";
import PayrollBreakdownModal from "@/components/payroll/PayrollBreakdownModal";
import { PayrollStatus } from "@/graphql/gql/graphql";
import useGetPayrollTotals from "@/hooks/payroll/useGetPayrollTotals";
import useHasRole from "@/hooks/useHasRole";
import { payrollStatusColorGenerator } from "@/utility/constant-formatters";
import { IPageProps } from "@/utility/interfaces";
import {
  EditOutlined,
  FieldTimeOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { PageHeader, ProCard } from "@ant-design/pro-components";
import { Card, Divider, Result, Space, Tag, Typography } from "antd";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const gridStyle: React.CSSProperties = {
  width: "33%",
  textAlign: "center",
  margin: 0,
  display: "inline-block",
};
const ViewPayroll = ({ account }: IPageProps) => {
  const router = useRouter();
  const [payroll, loadingPayroll] = useGetPayrollTotals();

  const menuItems = [
    {
      title: "Timekeeping",
      icon: <FieldTimeOutlined />,
      link: "/p-timekeeping",
      description: "Records employee work hours for wage calculations.",
      show: true,
      status: payroll?.timekeeping?.status,
    },
    {
      title: "Allowance",
      icon: <FieldTimeOutlined />,
      link: "/p-allowance",
      description: "Manages extra payments like bonuses and commissions.",
      show: true,
      status: payroll?.allowance?.status,
    },
    {
      title: "Contributions",
      icon: <FieldTimeOutlined />,
      link: "/p-contributions",
      description:
        "Handles mandatory deductions mandated by the government (SSS, HDMF, PHIC).",
      show: useHasRole(["PAYROLL_CONTRIBUTIONS_USER"]),
      status: payroll?.contribution?.status,
    },
    {
      title: "Loans",
      icon: <FieldTimeOutlined />,
      link: "/p-loans",
      description: "Tracks employee loans and repayment deductions.",
      show: true,
      status: payroll?.loan?.status,
    },
    {
      title: "Adjustments",
      icon: <FieldTimeOutlined />,
      link: "/p-adjustments",
      description:
        "Manages various deductions, such as healthcare premiums and union dues.",
      show: true,
      status: payroll?.adjustment?.status,
    },
    {
      title: "Other Deduction",
      icon: <FieldTimeOutlined />,
      link: "/p-other-deductions",
      description:
        "Manages various deductions, such as healthcare premiums and union dues.",
      show: true,
      status: payroll?.otherDeduction?.status,
    },
    {
      title: "Withholding Tax",
      icon: <FieldTimeOutlined />,
      link: "/p-withholding-tax",
      description:
        "Manages various deductions, such as healthcare premiums and union dues.",
      show: true,
      status:
        payroll?.timekeeping?.status === PayrollStatus.Finalized &&
        payroll?.contribution?.status === PayrollStatus.Finalized
          ? PayrollStatus.Finalized
          : PayrollStatus.Draft,
    },
    {
      title: "Payroll Payslip",
      icon: <FileOutlined />,
      link: "/p-payslip",
      description: "Manages employee salary and its payslip.",
      show: true,
      status: "FINALIZED",
    },
  ];

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
          }>
          <div className="gx-main-content-wrapper-full-width">
            <ProCard
              headStyle={{
                flexWrap: "wrap",
              }}>
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
                onBack={() => router.push("/payroll/payroll-management")}
                extra={
                  <Space>
                    <PayrollBreakdownModal />
                    {payroll?.status === PayrollStatus.Active && (
                      <CustomButton
                        type="primary"
                        onClick={() =>
                          router?.push(
                            `/payroll/payroll-management/${router?.query?.id}/edit`
                          )
                        }
                        icon={<EditOutlined />}
                        allowedPermissions={["edit_payroll"]}>
                        Edit Payroll
                      </CustomButton>
                    )}
                  </Space>
                }
              />
              <Typography.Title level={5}>
                {dayjs(payroll?.dateStart).format(" MMMM D, YYYY")} -
                {dayjs(payroll?.dateEnd).format(" MMMM D, YYYY")}
              </Typography.Title>
              {payroll?.description}
              <Divider />
              <Card styles={{ body: { padding: 0 } }} loading={loadingPayroll}>
                {menuItems.map(
                  (item, index) =>
                    item.show === true && (
                      <Link
                        href={`${router.asPath}${item.link}`}
                        passHref
                        legacyBehavior
                        key={index}
                        style={{ display: "inline" }}>
                        <a style={{ textDecoration: "none" }}>
                          <Card.Grid
                            style={{
                              ...gridStyle,
                              background:
                                item?.status === PayrollStatus.Finalized
                                  ? "#e1f8e0"
                                  : "#faeece",
                            }}
                            key={index}
                            onClick={() => {}}>
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
        </AccessControl>
      </AccessManager>
    </>
  );
};

export default ViewPayroll;
