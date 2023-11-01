import CustomButton from "@/components/common/CustomButton";
import TablePaginated from "@/components/common/TablePaginated";
import PayrollHeader from "@/components/payroll/PayrollHeader";
import { PayrollEmployeeFilter } from "@/components/payroll/payroll-management/PayrollEmployeeFilter";
import PayrollEmployeeStatusAction from "@/components/payroll/payroll-management/PayrollEmployeeStatusAction";
import PayrollModuleRecalculateAllEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateAllEmployeeAction";
import PayrollModuleRecalculateEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateEmployeeAction";
import AddAdjustmentItemsModal from "@/components/payroll/payroll-management/adjustments/AddAdjustmentItemsModal";
import {
  AdjustmentCategory,
  AdjustmentOperation,
  PayrollAdjustmentItem,
  PayrollEmployeeAdjustmentDto,
  PayrollEmployeeLoanDto,
  PayrollModule,
  PayrollStatus,
} from "@/graphql/gql/graphql";
import useGetPayrollEmployeeAdjustment from "@/hooks/payroll/adjustments/useGetPayrollEmployeeAdjustment";
import useUpsertAdjustmentItem from "@/hooks/payroll/adjustments/useUpsertAdjustmentItem";
import { variables } from "@/hooks/payroll/contributions/useGetContributionEmployees";
import useGetPayrollLoan from "@/hooks/payroll/loans/useGetPayrollLoan";
import useUpdatePayrollLoanStatus from "@/hooks/payroll/loans/useUpdatePayrollLoanStatus";
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
import { InputNumber, Modal, Select, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { recalculateButton } from "./p-contributions";
import useGetAdjustmentCategories from "@/hooks/adjustment-category/useGetAdjustmentCategories";
import useDeleteAdjustmentItem from "@/hooks/payroll/adjustments/useDeleteAdjustmentItem";

const initialState: variables = {
  filter: "",
  size: 25,
  page: 0,
  status: [],
};
function PayrollLoans({ account }: IPageProps) {
  const router = useRouter();
  const [state, { onQueryChange }] = usePaginationState(initialState, 0, 25);
  const [editing, setEditing] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<String>("");
  const amountRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);
  const [categories, loadingCategories] = useGetAdjustmentCategories("");
  const [loan, loadingLoan, refetchLoan] = useGetPayrollLoan();
  const { data, loading, refetch, dataList } = useGetPayrollEmployeeAdjustment({
    variables: state,
  });

  const [upsert, loadingUpsert] = useUpsertAdjustmentItem(() => {
    refetch();
  });

  const [deleteItem, loadingDelete] = useDeleteAdjustmentItem(() => {
    refetch();
  });

  const [updateStatus, loadingUpdateStatus] = useUpdatePayrollLoanStatus(() => {
    refetchLoan();
    refetch();
  });

  const columns: ColumnsType<PayrollEmployeeAdjustmentDto> = [
    { title: "Name", dataIndex: "employeeName" },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => <Tag color={getStatusColor(value)}>{value}</Tag>,
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (value, record) => {
        let total = 0;
        console.log(record.employee?.adjustmentItems);
        record.employee?.adjustmentItems?.forEach((item) => {
          if (item?.operation === AdjustmentOperation.Addition) {
            total = total + item.amount;
          } else if (item?.operation === AdjustmentOperation.Subtraction) {
            total = total - item.amount;
          }
        });
        return <NumeralFormatter value={total} />;
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (value, { status }) => {
        return (
          <>
            <PayrollModuleRecalculateEmployeeAction
              id={value}
              module={PayrollModule.Adjustment}
              buttonProps={recalculateButton}
              refetch={refetch}
              // allowedPermissions={[]}
            />
            <PayrollEmployeeStatusAction
              id={value}
              module={PayrollModule.Adjustment}
              value={status}
              refetch={refetch}
            />
          </>
        );
      },
    },
  ];

  let expandedRowColumns: ColumnsType<PayrollAdjustmentItem> = [
    {
      title: "Adjustment Category",
      dataIndex: "name",
      render: (value, record) =>
        editing === record.id && editingField === "CATEGORY" ? (
          <Select
            size="small"
            id="editable-amount"
            autoFocus
            onSelect={(value) => {
              editCategory(value, record);
            }}
            defaultOpen
            style={{ width: "100%" }}
            options={categories?.map((item: AdjustmentCategory) => ({
              value: item.id,
              label: (
                <>
                  {item.name}{" "}
                  <Tag color={item.operation === "ADDITION" ? "green" : "red"}>
                    {item.operation}
                  </Tag>
                </>
              ),
            }))}
          />
        ) : (
          <div
            onClick={() => {
              setEditing(record.id as string);
              setEditingField("CATEGORY");
            }}
          >
            {value} <EditOutlined />
          </div>
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (value, record) =>
        editing === record.id && editingField === "DESCRIPTION" ? (
          <InputNumber
            size="small"
            id="editable-amount"
            autoFocus
            onBlur={() => {
              editDescription(record);
            }}
            ref={descriptionRef}
            defaultValue={value}
          />
        ) : (
          <div
            onClick={() => {
              setEditing(record.id as string);
              setEditingField("DESCRIPTION");
            }}
          >
            {value} <EditOutlined />
          </div>
        ),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (value, record) => (
        <Tag color={value === "ADDITION" ? "green" : "red"}>{value}</Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value, record) =>
        editing === record.id && editingField === "AMOUNT" ? (
          <InputNumber
            size="small"
            id="editable-amount"
            autoFocus
            onBlur={() => {
              editAmount(record);
            }}
            ref={amountRef}
            defaultValue={value}
          />
        ) : (
          <div
            onClick={() => {
              setEditing(record.id as string);
              setEditingField("AMOUNT");
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
              onClick={() => {
                confirmDelete(value);
              }}
            />
          </>
        );
      },
    },
  ];

  const editAmount = (record: PayrollAdjustmentItem) => {
    const amount = amountRef?.current?.value;
    upsert({
      id: record?.id,
      amount: amount,
      description: record.description,
    } as any);

    setEditing(null);
    setEditingField("");
  };

  const editCategory = (value: string, record: PayrollAdjustmentItem) => {
    upsert({
      id: record?.id,
      category: value,
      description: record.description,
    } as any);

    setEditing(null);
    setEditingField("");
  };

  const editDescription = (record: PayrollAdjustmentItem) => {
    const description = descriptionRef?.current?.value;
    upsert({
      id: record?.id,
      description: description,
    } as any);

    setEditing(null);
    setEditingField("");
  };

  const handleClickFinalize = () => {
    updateStatus({
      payrollId: router?.query?.id as string,
      status: statusMap[loan?.status],
    });
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

  return (
    <>
      <PayrollHeader
        module={PayrollModule.Adjustment}
        status={loan?.status}
        showTitle
        extra={
          <>
            {loan?.status === PayrollStatus.Draft && (
              <PayrollModuleRecalculateAllEmployeeAction
                id={router?.query?.id as string}
                module={PayrollModule.Adjustment}
                buttonProps={recalculateButton}
                tooltipProps={{ placement: "topRight" }}
                refetch={refetch}
              >
                Recalculate All Employee Loan
              </PayrollModuleRecalculateAllEmployeeAction>
            )}

            <CustomButton
              type="primary"
              icon={
                loan?.status === "FINALIZED" ? (
                  <EditOutlined />
                ) : (
                  <CheckOutlined />
                )
              }
              onClick={handleClickFinalize}
            >
              Set as {statusMap[loan?.status]}
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

        <AddAdjustmentItemsModal refetch={refetch} employeeList={dataList} />
      </div>

      <TablePaginated
        columns={columns}
        loading={loading || loadingUpsert || loadingLoan}
        size={"small"}
        dataSource={data?.content}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <Table
                pagination={false}
                dataSource={record?.employee?.adjustmentItems}
                columns={expandedRowColumns}
              />
            );
          },
          rowExpandable: (record) =>
            record?.employee?.adjustmentItems.length > 0,
        }}
        total={data?.totalElements}
        pageSize={state.size}
        onChange={onQueryChange}
        current={state.page}
        rowKey={(record: any) => {
          return record?.id;
        }}
      />
    </>
  );
}

export default PayrollLoans;
