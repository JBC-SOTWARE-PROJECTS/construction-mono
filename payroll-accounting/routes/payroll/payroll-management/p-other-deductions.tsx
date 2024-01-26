import CustomButton from "@/components/common/CustomButton";
import TablePaginated from "@/components/common/TablePaginated";
import PayrollHeader from "@/components/payroll/PayrollHeader";
import { PayrollEmployeeFilter } from "@/components/payroll/payroll-management/PayrollEmployeeFilter";
import PayrollEmployeeStatusAction from "@/components/payroll/payroll-management/PayrollEmployeeStatusAction";
import PayrollModuleRecalculateAllEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateAllEmployeeAction";
import PayrollModuleRecalculateEmployeeAction from "@/components/payroll/payroll-management/PayrollModuleRecalculateEmployeeAction";
import AddOtherDeductionItemsModal from "@/components/payroll/payroll-management/other-deductions/AddOtherDeductionItemsModal";
import {
  PayrollEmployeeOtherDeductionDto,
  PayrollEmployeeStatus,
  PayrollModule,
  PayrollOtherDeductionItem,
} from "@/graphql/gql/graphql";
import { variables } from "@/hooks/payroll/contributions/useGetContributionEmployees";
import useDeleteOtherDeductionItem from "@/hooks/payroll/other-deductions/useDeleteOtherDeductionItem";
import useGetPayrollEmployeeOtherDeduction from "@/hooks/payroll/other-deductions/useGetPayrollEmployeeOtherDeduction";
import useGetPayrollOtherDeduction from "@/hooks/payroll/other-deductions/useGetPayrollOtherDeduction";
import useUpdatePayrollOtherDeductionStatus from "@/hooks/payroll/other-deductions/useUpdatePayrollOtherDeductionStatus";
import useUpsertOtherDeductionItem from "@/hooks/payroll/other-deductions/useUpsertOtherDeductionItem";
import { PayrollStatus } from "@/hooks/payroll/useUpdatePayrollStatus";
import usePaginationState from "@/hooks/usePaginationState";
import { statusMap } from "@/utility/constant";
import { getStatusColor } from "@/utility/helper";
import { IPageProps } from "@/utility/interfaces";
import NumeralFormatter from "@/utility/numeral-formatter";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { InputNumber, Modal, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { Table } from "antd/lib";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { recalculateButton } from "./p-contributions";
const initialState: variables = {
  filter: "",
  size: 25,
  page: 0,
  status: [],
};
function OtherDeductions({ account }: IPageProps) {
  const router = useRouter();
  const [state, { onQueryChange, onNextPage }] = usePaginationState(
    initialState,
    0,
    25
  );
  const [editing, setEditing] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<String>("");
  const amountRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);

  const { data, loading, refetch, dataList } =
    useGetPayrollEmployeeOtherDeduction({
      variables: state,
    });

  const [otherDeduction, loadingOtherDeduction, refetchOtherDeduction] =
    useGetPayrollOtherDeduction();

  const [upsert, loadingUpsert] = useUpsertOtherDeductionItem(() => {
    refetch();
  });

  const [deleteItem, loadingDelete] = useDeleteOtherDeductionItem(() => {
    refetch();
  });

  const [updateStatus, loadingUpdateStatus] =
    useUpdatePayrollOtherDeductionStatus(() => {
      refetchOtherDeduction();
      refetch();
    });

  const editAmount = (record: PayrollOtherDeductionItem) => {
    const amount = amountRef?.current?.value;
    upsert({
      id: record?.id,
      amount: amount,
      description: record.description,
    } as any);

    setEditing(null);
    setEditingField("");
  };
  const editDescription = (record: PayrollOtherDeductionItem) => {
    const description = descriptionRef?.current?.value;
    upsert({
      id: record?.id,
      description: description,
    } as any);

    setEditing(null);
    setEditingField("");
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
    if (otherDeduction.status == PayrollStatus.DRAFT) {
      data?.content?.forEach((item: PayrollEmployeeOtherDeductionDto) => {
        if (item.status === PayrollEmployeeStatus.Draft) countDraft++;
      });
    }
    if (countDraft > 0 && otherDeduction.status === "DRAFT") {
      message.error(
        "There are still some DRAFT employees. Please finalize all employees first"
      );
    } else {
      updateStatus({
        payrollId: router?.query?.id as string,
        status: statusMap[otherDeduction?.status],
      });
    }
  };

  const actionColumn: ColumnsType<PayrollEmployeeOtherDeductionDto> = [
    {
      title: "Action",
      dataIndex: "id",
      render: (value, { status }) => {
        return (
          <>
            <PayrollModuleRecalculateEmployeeAction
              id={value}
              module={PayrollModule.OtherDeduction}
              buttonProps={recalculateButton}
              refetch={refetch}
              // allowedPermissions={[]}
            />
            <PayrollEmployeeStatusAction
              id={value}
              module={PayrollModule.OtherDeduction}
              value={status}
              refetch={refetch}
            />
          </>
        );
      },
    },
  ];

  const columns: ColumnsType<PayrollEmployeeOtherDeductionDto> = [
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
        console.log(record.employee?.deductionItems);
        record.employee?.deductionItems?.forEach((item) => {
          total = total + item?.amount;
        });
        return <NumeralFormatter value={total} />;
      },
    },
    ...(otherDeduction?.status === PayrollStatus.DRAFT ? actionColumn : []),
  ];
  const expandedColumnsAction: ColumnsType<PayrollOtherDeductionItem> = [
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

  let expandedRowColumns: ColumnsType<PayrollOtherDeductionItem> = [
    { title: "Name", dataIndex: "name" },
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
              if (otherDeduction?.status === PayrollStatus.DRAFT) {
                setEditing(record.id as string);
                setEditingField("DESCRIPTION");
              }
            }}
          >
            {value}{" "}
            {otherDeduction?.status === PayrollStatus.DRAFT && <EditOutlined />}
          </div>
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
              if (otherDeduction?.status === PayrollStatus.DRAFT) {
                setEditing(record.id as string);
                setEditingField("AMOUNT");
              }
            }}
          >
            <NumeralFormatter value={value} />{" "}
            {otherDeduction?.status === PayrollStatus.DRAFT && <EditOutlined />}
          </div>
        ),
    },
    ...(otherDeduction?.status === PayrollStatus.DRAFT
      ? expandedColumnsAction
      : []),
  ];
  return (
    <>
      <PayrollHeader
        module={PayrollModule.OtherDeduction}
        status={otherDeduction?.status}
        showTitle
        handleClickFinalize={handleClickFinalize}
        loading={loadingUpdateStatus}
        extra={
          <>
            {otherDeduction?.status === PayrollStatus.DRAFT && (
              <PayrollModuleRecalculateAllEmployeeAction
                id={router?.query?.id as string}
                module={PayrollModule.OtherDeduction}
                buttonProps={recalculateButton}
                tooltipProps={{ placement: "topRight" }}
                refetch={refetch}
              >
                Recalculate All Employee Other Deduction
              </PayrollModuleRecalculateAllEmployeeAction>
            )}
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

        {otherDeduction?.status === PayrollStatus.DRAFT && (
          <AddOtherDeductionItemsModal
            refetch={refetch}
            employeeList={dataList}
          />
        )}
      </div>

      <TablePaginated
        columns={columns}
        loading={
          loading || loadingOtherDeduction || loadingUpsert || loadingDelete
        }
        size={"small"}
        dataSource={data?.content}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <Table
                pagination={false}
                dataSource={record?.employee?.deductionItems}
                columns={expandedRowColumns}
              />
            );
          },
          rowExpandable: (record) =>
            record?.employee?.deductionItems.length > 0,
        }}
        total={data?.totalElements}
        pageSize={state.size}
        onChangePagination={onNextPage}
        current={state.page}
        rowKey={(record: any) => {
          return record?.id;
        }}
      />
    </>
  );
}

export default OtherDeductions;
