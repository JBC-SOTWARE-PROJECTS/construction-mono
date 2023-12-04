import CustomButton from "@/components/common/CustomButton";
import TablePaginated from "@/components/common/TablePaginated";
import PayrollHeader from "@/components/payroll/PayrollHeader";
import { PayrollEmployeeFilter } from "@/components/payroll/payroll-management/PayrollEmployeeFilter";
import PayrollEmployeeStatusAction from "@/components/payroll/payroll-management/PayrollEmployeeStatusAction";
import PayrollModuleRecalculateAllEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateAllEmployeeAction";
import PayrollModuleRecalculateEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateEmployeeAction";
import AddPayrollAllowanceItemModal from "@/components/payroll/payroll-management/allowance/AddPayrollAllowanceItemModal";
import {
  PayrollAllowanceItem,
  PayrollEmployeeAllowanceDto,
  PayrollEmployeeStatus,
  PayrollModule,
} from "@/graphql/gql/graphql";
import { variables } from "@/hooks/payroll/adjustments/useGetPayrollEmployeeAdjustment";
import useDeletePayrollAllowanceItem from "@/hooks/payroll/allowance/useDeletePayrollAllowanceItem";
import useGetPayrollAllowance from "@/hooks/payroll/allowance/useGetPayrollAllowance";
import useGetPayrollEmployeeAllowance from "@/hooks/payroll/allowance/useGetPayrollEmployeeAllowance";
import useUpdateAllowanceItemAmount from "@/hooks/payroll/allowance/useUpdateAllowanceItemAmount";
import useUpdatePayrollAllowanceStatus from "@/hooks/payroll/allowance/useUpdatePayrollAllowanceStatus";
import { PayrollStatus } from "@/hooks/payroll/useUpdatePayrollStatus";
import useLoadingState from "@/hooks/useLoadingState";
import usePaginationState from "@/hooks/usePaginationState";
import { statusMap } from "@/utility/constant";
import { getStatusColor } from "@/utility/helper";
import { IPageProps } from "@/utility/interfaces";
import NumeralFormatter from "@/utility/numeral-formatter";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { InputNumber, Modal, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { recalculateButton } from "./p-contributions";

const initialState: variables = {
  filter: "",
  size: 25,
  page: 0,
  status: [],
};
function PayrollAllowance({ account }: IPageProps) {
  const router = useRouter();
  const [state, { onQueryChange }] = usePaginationState(initialState, 0, 25);
  const [editingKey, setEditingKey] = useState<string | undefined>();

  const [employees, loadingEmployees, refetchEmployees, totalElements] =
    useGetPayrollEmployeeAllowance({
      variables: { ...state, withItems: false },
      onCompleted: () => {},
    });

  const [updateAmount, loadingUpdateAmount] = useUpdateAllowanceItemAmount(
    () => {
      refetchEmployees();
    }
  );
  const [updateStatus, loadingUpdateStatus] = useUpdatePayrollAllowanceStatus(
    () => {
      refetchEmployees();
      refetchAllowance();
    }
  );

  const [deleteItem, loadingDeletItem] = useDeletePayrollAllowanceItem(() => {
    refetchEmployees();
  });
  const [allowance, loadingAllowance, refetchAllowance] =
    useGetPayrollAllowance();

  const amountRef = useRef<any>(null);

  const editAmount = () => {
    const amount = amountRef?.current?.value;
    setEditingKey(undefined);
    if (amount === "" || !amount) return;
    updateAmount({ amount, id: editingKey });
  };

  const confirmDelete = (id: string) => {
    Modal.confirm({
      content: "Are you sure you want to delete this item?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteItem(id);
      },
      onCancel() {},
    });
  };

  const handleClickFinalize = () => {
    let countDraft = 0;
    employees.forEach((item: any) => {
      if (item.status === PayrollEmployeeStatus.Draft) countDraft++;
    });
    if (countDraft > 0 && allowance.status === "DRAFT") {
      message.error(
        "There are still some DRAFT employees. Please finalize all employees first"
      );
    } else {
      updateStatus({
        payrollId: router?.query?.id as string,
        status: statusMap[allowance?.status],
      });
    }
  };

  const action: ColumnsType<PayrollEmployeeAllowanceDto> = [
    {
      title: "Action",
      dataIndex: "id",
      render: (value, { status }) => {
        return (
          <>
            <PayrollModuleRecalculateEmployeeAction
              id={value}
              module={PayrollModule.Allowance}
              buttonProps={recalculateButton}
              refetch={refetchEmployees}
            />
            <PayrollEmployeeStatusAction
              id={value}
              module={PayrollModule.Allowance}
              value={status}
              refetch={refetchEmployees}
            />
          </>
        );
      },
    },
  ];
  const columns: ColumnsType<PayrollEmployeeAllowanceDto> = [
    {
      title: "Name",
      dataIndex: "employeeName",
    },
    {
      title: "Position",
      dataIndex: "position",
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (value) => <NumeralFormatter value={value} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => <Tag color={getStatusColor(value)}>{value}</Tag>,
    },
    ...(allowance?.status === PayrollStatus.DRAFT ? action : []),
  ];

  let expandedRowColumns: ColumnsType<PayrollAllowanceItem> = [
    {
      title: "Name",
      dataIndex: "name",
      sortOrder: "ascend",
      // sorter: (a, b) =>
      //   (a?.category?.length as number) - (b?.category?.length as number),
      render: (value?) => capitalize(value?.replace("_", " ")),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value, { id }) =>
        editingKey === id ? (
          <InputNumber
            size="small"
            id="editable-amount"
            autoFocus
            onBlur={editAmount}
            defaultValue={value}
            ref={amountRef}
          />
        ) : (
          <div
            onClick={() => {
              setEditingKey(id);
            }}
          >
            <NumeralFormatter value={value} /> <EditOutlined />
          </div>
        ),
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (value) => {
        return (
          <>
            <CustomButton
              id={value}
              icon={<DeleteOutlined />}
              danger
              type="primary"
              shape="circle"
              onClick={() => {
                confirmDelete(value);
              }}
            />
          </>
        );
      },
    },
  ];

  const loading = useLoadingState(
    loadingEmployees ||
      loadingUpdateAmount ||
      loadingDeletItem ||
      loadingAllowance
  );
  return (
    <>
      <PayrollHeader
        module={PayrollModule.Allowance}
        extra={
          <>
            {allowance?.status === PayrollStatus.DRAFT && (
              <PayrollModuleRecalculateAllEmployeeAction
                id={router?.query?.id as string}
                module={PayrollModule.Allowance}
                buttonProps={recalculateButton}
                tooltipProps={{ placement: "topRight" }}
                refetch={refetchEmployees}
              >
                Recalculate All Employee Allowance
              </PayrollModuleRecalculateAllEmployeeAction>
            )}

            <CustomButton
              type="primary"
              icon={
                allowance?.status === "FINALIZED" ? (
                  <EditOutlined />
                ) : (
                  <CheckOutlined />
                )
              }
              onClick={handleClickFinalize}
              loading={loading}
            >
              Set as {statusMap[allowance?.status]}
            </CustomButton>
          </>
        }
      />
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          width: "100%",
        }}
      >
        <div style={{ width: "80%", marginRight: 10 }}>
          <PayrollEmployeeFilter onQueryChange={onQueryChange} />
        </div>

        {allowance?.status === PayrollStatus.DRAFT && (
          <AddPayrollAllowanceItemModal
            refetch={refetchEmployees}
            employees={employees as PayrollEmployeeAllowanceDto[]}
          />
        )}
      </div>
      <TablePaginated
        columns={columns}
        loading={loading}
        size={"small"}
        dataSource={employees}
        expandable={{
          expandedRowRender: (record) => {
            console.log(record);
            return (
              <Table
                pagination={false}
                dataSource={record?.employee?.allowanceItems}
                columns={expandedRowColumns}
              />
            );
          },
          rowExpandable: (record) =>
            record?.employee?.allowanceItems.length > 0,
        }}
        total={totalElements}
        pageSize={state.size}
        onChange={onQueryChange}
        current={state.page}
        rowKey={(record: any) => record?.employee?.id}
      />
    </>
  );
}

export default PayrollAllowance;
