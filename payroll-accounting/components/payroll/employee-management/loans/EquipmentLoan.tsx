import { EmployeeLoan, EmployeeLoanCategory } from "@/graphql/gql/graphql";
import useGetEmployeeLoans from "@/hooks/employee-loans/useGetEmployeeLoans";
import usePaginationState from "@/hooks/usePaginationState";
import NumeralFormatter from "@/utility/numeral-formatter";
import { ColumnsType } from "antd/es/table";
import { Table } from "antd/lib";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";
interface variables {
  page: number;
  size: number;
}

const initialState: variables = {
  size: 25,
  page: 0,
};
function EquipmentLoan() {
  const router = useRouter();
  const [state, { onNextPage }] = usePaginationState(initialState, 0, 25);
  const [data, loading, refetch] = useGetEmployeeLoans(
    state,
    EmployeeLoanCategory.EquipmentLoan,
    router?.query?.id as string
  );
  const columns: ColumnsType<EmployeeLoan> = [
    {
      title: "Date",
      dataIndex: "createdDate",
      render: (text) => {
        return <div>{dayjs(text).format("MMMM Do YYYY, h:mm a")}</div>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value) => <NumeralFormatter format={"0,0.[00]"} value={value} />,
    },
    {
      title: "Remarks",
      dataIndex: "description",
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data?.content as EmployeeLoan[]}
      loading={loading}
      onChange={onNextPage}
    />
  );
}

export default EquipmentLoan;
