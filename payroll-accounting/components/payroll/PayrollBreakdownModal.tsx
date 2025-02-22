import CustomButton from "@/components/common/CustomButton";
import { PayrollEmployeeStatus, PayrollStatus } from "@/graphql/gql/graphql";
import useGetPayrollTotals from "@/hooks/payroll/useGetPayrollTotals";
import ConfirmationPasswordHook from "@/hooks/promptPassword";
import { getStatusColor } from "@/utility/helper";
import {
  CheckOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Collapse, Empty, Modal, Spin, Table, Tag } from "antd";
import { useState } from "react";
import PayrollSubmoduleTotalsTable from "./PayrollSubmoduleTotalsTable";
import ProjectBreakdownTable from "./ProjectBreakdownTable";
import useUpdatePayrollStatus from "@/hooks/payroll/useUpdatePayrollStatus";
import NumeralFormatter from "@/utility/numeral-formatter";

function PayrollBreakdownModal() {
  const [open, setOpen] = useState(false);
  const [payroll, loadingPayroll, refetch] = useGetPayrollTotals();
  const [updateStatus, loadingUpdateStatus] = useUpdatePayrollStatus(() => {
    refetch();
  });

  const withholdingTaxStatus =
    payroll?.payrollEmployees &&
    payroll?.payrollEmployees.filter(
      (item: any) => (item.status as string) === "DRAFT"
    ).length > 0
      ? "DRAFT"
      : "FINALIZED";
  const items: any = [
    {
      label: "Timekeeping",
      status: payroll?.timekeeping?.status,
      dataSource: payroll?.timekeeping?.salaryBreakdown,
      children:
        payroll?.timekeeping?.status === PayrollStatus.Finalized ? (
          <ProjectBreakdownTable
            dataSource={payroll?.timekeeping?.salaryBreakdown}
            toggleValue={"salary"}
            size="small"
          />
        ) : (
          <Empty description="Status is DRAFT. Please set to FINALIZED first." />
        ),
    },
    {
      label: "Allowance",
      dataSource: payroll?.allowance?.totalsBreakdown,
      status: payroll?.allowance?.status,
    },
    {
      label: "Contributions",
      dataSource: payroll?.contribution?.totalsBreakdown,
      status: payroll?.contribution?.status,
    },
    {
      label: "Loans",
      dataSource: payroll?.loan?.totalsBreakdown,
      status: payroll?.loan?.status,
    },
    {
      label: "Adjustments",
      dataSource: payroll?.adjustment?.totalsBreakdown,
      status: payroll?.adjustment?.status,
    },
    {
      label: "Other Deductions",
      dataSource: payroll?.otherDeduction?.totalsBreakdown,
      status: payroll?.allowance?.status,
    },
    {
      label: "Withholding Tax",
      dataSource: payroll?.otherDeduction?.totalsBreakdown,
      status: withholdingTaxStatus,
      children:
        withholdingTaxStatus === "DRAFT" ? (
          <Empty description="Finalized all employee withholding tax first." />
        ) : (
          <Table
            columns={[
              {
                title: "Description",
                dataIndex: "description",
                width: 800,
              },
              {
                title: "Amount",
                render: () => {
                  let total = 0;
                  payroll?.payrollEmployees?.map((item) => {
                    total += item?.withholdingTax;
                  });

                  return <NumeralFormatter value={total} />;
                },
              },
            ]}
            dataSource={[{ description: "Total Withholding Tax" }]}
          />
        ),
    },
  ];

  const [showPasswordConfirmation] = ConfirmationPasswordHook();
  const confirmFinalize = () => {
    Modal.confirm({
      title: (
        <>
          Are you sure you want to <b>FINALIZE</b> this payroll?
        </>
      ),
      content: (
        <>
          This operation will finalize ledger entries and record them in the
          transaction journal. This action is <b>NOT REVERSIBLE.</b> Are you
          sure you want to proceed?
        </>
      ),
      okText: "Confirm",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        showPasswordConfirmation(() => {
          updateStatus("FINALIZED");
        });
      },
      onCancel() {},
    });
  };

  const statusArr = [
    payroll?.timekeeping?.status,
    payroll?.allowance?.status,
    payroll?.contribution?.status,
    payroll?.loan?.status,
    payroll?.adjustment?.status,
    payroll?.allowance?.status,
    withholdingTaxStatus,
  ];
  return (
    <>
      <CustomButton
        onClick={() => setOpen(true)}
        icon={<EyeOutlined />}
        type="primary"
      >
        View Payroll Totals
      </CustomButton>
      <Spin spinning={loadingPayroll || loadingUpdateStatus}>
        <Modal
          title={`Payroll - ${payroll?.title}`}
          onCancel={() => setOpen(false)}
          open={open}
          footer={null}
          width={"100%"}
        >
          {payroll?.status === PayrollStatus.Active && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 20,
              }}
            >
              <CustomButton
                icon={<CheckOutlined />}
                onClick={() => {
                  confirmFinalize();
                }}
                disabled={statusArr.includes(PayrollStatus.Draft)}
                type="primary"
                tooltip={
                  statusArr.includes(PayrollStatus.Draft)
                    ? "All payroll submodules must be FINALIZED first."
                    : undefined
                }
              >
                Finalize Payroll
              </CustomButton>
            </div>
          )}

          <Collapse
            items={items.map(({ label, dataSource, status, children }: any) => {
              return {
                key: label,
                label: (
                  <h4>
                    {label}{" "}
                    <Tag color={getStatusColor(status as string)}>
                      {status as string}
                    </Tag>
                    {payroll?.status === PayrollStatus.Finalized && (
                      <Tag color="green">POSTED</Tag>
                    )}
                  </h4>
                ),
                children: children || (
                  <PayrollSubmoduleTotalsTable
                    dataSource={dataSource}
                    status={status}
                    isAdjustment={label === "Adjustments"}
                  />
                ),
              };
            })}
            bordered={false}
          />
        </Modal>
      </Spin>
    </>
  );
}

export default PayrollBreakdownModal;
