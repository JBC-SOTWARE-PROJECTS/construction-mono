import { ReloadOutlined } from "@ant-design/icons";

import { Switch, Tabs, Typography } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
// import { payrollHeaderBreadcrumbRenderer } from "./adjustments";
import { useState } from "react";
import NumeralFormatter from "@/utility/numeral-formatter";
import useGetPayrollContribution from "@/hooks/payroll/contributions/useGetPayrollContribution";
import useGetContributionEmployees from "@/hooks/payroll/contributions/useGetContributionEmployees";
import PayrollEmployeeStatusTag from "@/components/payroll/payroll-management/PayrollEmployeeStatusTag";
import PayrollModuleRecalculateEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateEmployeeAction";
import {
  PayrollContribution,
  PayrollEmployeeContributionDto,
  PayrollEmployeeStatus,
  PayrollModule,
} from "@/graphql/gql/graphql";
import { PageHeader } from "@ant-design/pro-components";
import TablePaginated from "@/components/common/TablePaginated";
import { ColumnsType } from "antd/es/table";
import { ButtonProps } from "antd/lib/button";
import { PayrollContributionFilter } from "@/components/payroll/payroll-management/contributions/PayrollContributionFilter";
import usePaginationState from "@/hooks/usePaginationState";
import useUpdateContributionTypeStatus from "@/hooks/payroll/contributions/useUpdateContributionTypeStatus";
import useHasPermission from "@/hooks/useHasPermission";
import ContributionStatusAction from "@/components/payroll/payroll-management/contributions/ContributionStatusAction";
import PayrollEmployeeStatusAction from "@/components/payroll/payroll-management/PayrollEmployeeStatusAction";
import useMemoizedPayrollHeaderBreadcrumb, {
  payrollHeaderBreadcrumbRenderer,
} from "@/hooks/payroll/useMemoizedPayrollHeadBreadcrumb";
import PayrollHeader from "@/components/payroll/PayrollHeader";
import PayrollModuleRecalculateAllEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateAllEmployeeAction";

const recalculateButton: ButtonProps = {
  shape: "circle",
  icon: <ReloadOutlined />,
  type: "primary",
  danger: true,
};
const { Text } = Typography;

const initialState: variables = {
  filter: "",
  size: 25,
  page: 0,
  status: [],
};
// const contributionStatusActionsPermissions = [
//   "enable_disable_employee_SSS_contribution_status",
//   "enable_disable_employee_PHIC_contribution_status",
//   "enable_disable_employee_HDMF_contribution_status",
// ];
const contributionStatusActionsPermissions = true;

const rowKey = (record: PayrollEmployeeContributionDto) => record?.employee?.id;

const headerMap: {
  [key: string]: string;
} = {
  ALL: "All Contributions",
  SSS: "Social Security System Contributions",
  PHIC: "Phil Health Contributions",
  HDMF: "Pag-Ibig Contributions",
};
interface params {
  active: boolean | null | undefined;
  text: string;
  type: string;
}

interface variables {
  page: number;
  size: number;
  filter: string;
  status: [PayrollEmployeeStatus] | [];
}

// TODO: Add Recalculate and Disable action in each tables in specific contribution tabs

function PayrollContributionsPage() {
  const router = useRouter();
  const [state, { onQueryChange }] = usePaginationState(initialState, 0, 25);
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const [contribution, loadingContribution, refetchContribution] =
    useGetPayrollContribution();
  const { data, loading, refetch } = useGetContributionEmployees({
    variables: state,
  });

  const [updateContributionStatus, loadingContributionStatus] =
    useUpdateContributionTypeStatus(() => refetchContribution());

  function NumeralDisabledComponent({ active, text, type }: params) {
    const key = `isActive${type}`;
    return active && contribution[key as keyof typeof contribution] ? (
      <NumeralFormatter value={text} format="0,0.00" />
    ) : (
      <Text type="secondary">Disabled</Text>
    );
  }

  const commonColumns: ColumnsType<PayrollEmployeeContributionDto> = [
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
    },
  ];

  let sssColumns: ColumnsType<PayrollEmployeeContributionDto> = [
    {
      title: "SSS EE",
      dataIndex: "sssEE",
      key: "sssEE",
      render: (text, { isActiveSSS }) => (
        <NumeralDisabledComponent active={isActiveSSS} type="SSS" text={text} />
      ),
    },
    {
      title: "SSS ER",
      dataIndex: "sssER",
      key: "sssER",
      render: (text, { isActiveSSS }) => (
        <NumeralDisabledComponent active={isActiveSSS} type="SSS" text={text} />
      ),
    },
    {
      title: "SSS WISP EE",
      dataIndex: "sssWispEE",
      key: "sssWispEE",
      render: (text, { isActiveSSS }) => (
        <NumeralDisabledComponent active={isActiveSSS} type="SSS" text={text} />
      ),
    },
    {
      title: "SSS WISP ER",
      dataIndex: "sssWispER",
      key: "sssWispER",
      render: (text, { isActiveSSS }) => (
        <NumeralDisabledComponent active={isActiveSSS} type="SSS" text={text} />
      ),
    },
  ];
  let sssTotalColumns: ColumnsType<PayrollEmployeeContributionDto> = [
    {
      title: "SSS WISP EE Total",
      dataIndex: "sssEETotal",
      key: "sssEETotal",
      render: (text, { isActiveSSS }) => (
        <NumeralDisabledComponent active={isActiveSSS} type="SSS" text={text} />
      ),
    },
    {
      title: "SSS WISP ER Total",
      dataIndex: "sssERTotal",
      key: "sssERTotal",
      render: (text, { isActiveSSS }) => (
        <NumeralDisabledComponent active={isActiveSSS} type="SSS" text={text} />
      ),
    },
  ];
  let phicColumns: ColumnsType<PayrollEmployeeContributionDto> = [
    {
      title: "PHIC EE",
      dataIndex: "phicEE",
      key: "phicEE",
      render: (text, { isActivePHIC }) => (
        <NumeralDisabledComponent
          active={isActivePHIC}
          type="PHIC"
          text={text}
        />
      ),
    },
    {
      title: "PHIC ER",
      dataIndex: "phicER",
      key: "phicER",
      render: (text, { isActivePHIC }) => (
        <NumeralDisabledComponent
          active={isActivePHIC}
          type="PHIC"
          text={text}
        />
      ),
    },
  ];
  let hdmfColumns: ColumnsType<PayrollEmployeeContributionDto> = [
    {
      title: "HDMF EE",
      dataIndex: "hdmfEE",
      key: "hdmfEE",
      render: (text, { isActiveHDMF }) => (
        <NumeralDisabledComponent
          active={isActiveHDMF}
          type="HDMF"
          text={text}
        />
      ),
    },
    {
      title: "HDMF ER",
      dataIndex: "hdmfER",
      key: "hdmfER",
      render: (text, { isActiveHDMF }) => (
        <NumeralDisabledComponent
          active={isActiveHDMF}
          type="HDMF"
          text={text}
        />
      ),
    },
  ];

  const actionsColumn: ColumnsType<PayrollEmployeeContributionDto> = [
    {
      title: "Action",
      key: "action",
      render: (_, { id, employee, ...record }) => (
        <>
          <PayrollModuleRecalculateEmployeeAction
            id={id}
            module={PayrollModule.Contribution}
            buttonProps={recalculateButton}
            refetch={refetch}
            allowedPermissions={["recalculate_one_contributions_employee"]}
          />
          <PayrollEmployeeStatusAction
            id={id}
            module={PayrollModule.Contribution}
            value={record?.status}
            refetch={refetch}
          />
          <ContributionStatusAction
            id={id}
            value={record?.status}
            refetch={refetch}
            record={record}
          />
        </>
      ),
    },
  ];

  const columns: ColumnsType<PayrollEmployeeContributionDto> = [
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text: number) => (
        <NumeralFormatter value={text} format="0,0.00" />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => <PayrollEmployeeStatusTag status={text} />,
    },
    ...(contributionStatusActionsPermissions ? actionsColumn : []),
  ];

  let finalColumns: ColumnsType<PayrollEmployeeContributionDto> = [];

  switch (activeTab) {
    case "ALL":
      finalColumns = [
        ...commonColumns,
        ...sssColumns,
        ...phicColumns,
        ...hdmfColumns,
        ...columns,
      ];
      break;
    case "SSS":
      finalColumns = [...commonColumns, ...sssTotalColumns, ...sssColumns];
      break;
    case "PHIC":
      finalColumns = [...commonColumns, ...phicColumns];
      break;
    case "HDMF":
      finalColumns = [...commonColumns, ...hdmfColumns];
      break;
    default:
      finalColumns = [];
      break;
  }

  // const routes = useMemoizedPayrollHeaderBreadcrumb(
  //   contribution?.payroll?.title,
  //   "Payroll Contribution"
  // );

  const onChange = (key: string) => {
    setActiveTab(key);
  };

  let tabContent = (
    <>
      <PageHeader title={headerMap[activeTab]} />
      <TablePaginated
        columns={finalColumns}
        loading={loading || loadingContribution || loadingContributionStatus}
        size={"small"}
        dataSource={data?.response?.content}
        total={data?.totalElements}
        pageSize={state.size}
        onChange={() => {}}
        current={state.page}
        rowKey={rowKey}
      />
    </>
  );

  return (
    <div>
      <Head>
        <title>View Payroll Contributions</title>
      </Head>

      <PayrollHeader
        module={PayrollModule.Contribution}
        extra={
          useHasPermission([
            "enable_or_disable_payroll_contribution_types",
          ]) && (
            <>
              <Switch
                checkedChildren="SSS Enabled"
                unCheckedChildren="SSS Disabled"
                checked={contribution?.isActiveSSS ? true : false}
                onChange={() => {
                  updateContributionStatus("SSS");
                }}
                loading={loadingContributionStatus}
              />
              <Switch
                checkedChildren="PHIC Enabled"
                unCheckedChildren="PHIC Disabled"
                checked={contribution?.isActivePHIC ? true : false}
                onChange={() => {
                  updateContributionStatus("PHIC");
                }}
                loading={loadingContributionStatus}
              />

              <Switch
                checkedChildren="HDMF Enabled"
                unCheckedChildren="HDMF Disabled"
                checked={contribution?.isActiveHDMF ? true : false}
                onChange={() => {
                  updateContributionStatus("HDMF");
                }}
                loading={loadingContributionStatus}
              />

              <PayrollModuleRecalculateAllEmployeeAction
                id={router?.query?.id as string}
                module={PayrollModule.Contribution}
                buttonProps={recalculateButton}
                tooltipProps={{ placement: "topRight" }}
                refetch={refetch}
                // allowedPermissions={["recalculate_all_contributions_employees"]}
              />
            </>
          )
        }
      />

      <PayrollContributionFilter onQueryChange={onQueryChange} />

      <Tabs
        defaultActiveKey="ALL"
        onChange={onChange}
        activeKey={activeTab}
        items={[
          {
            label: `All Contributions`,
            key: "ALL",
            children: tabContent,
          },
          ...(contribution?.isActiveSSS
            ? [
                {
                  label: `SSS Contributions`,
                  key: "SSS",
                  children: tabContent,
                },
              ]
            : []),
          ...(contribution?.isActivePHIC
            ? [
                {
                  label: `PHIC Contributions`,
                  key: "PHIC",
                  children: tabContent,
                },
              ]
            : []),
          ...(contribution?.isActiveHDMF
            ? [
                {
                  label: `HDMF Contributions`,
                  key: "HDMF",
                  children: tabContent,
                },
              ]
            : []),
        ]}
      />
    </div>
  );
}

export default PayrollContributionsPage;
