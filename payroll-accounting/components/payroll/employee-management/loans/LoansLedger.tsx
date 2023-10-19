import { EmployeeLoanLedgerDto } from "@/graphql/gql/graphql";
import useGetEmployeeLoansLedger from "@/hooks/employee-loans/useGetEmployeeLoansLedger";
import usePaginationState from "@/hooks/usePaginationState";
import NumeralFormatter from "@/utility/numeral-formatter";
import { Table, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
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
function LoansLedger() {
  const router = useRouter();
  const [state, { onNextPage }] = usePaginationState(initialState, 0, 25);

  const [data, loading, refetch] = useGetEmployeeLoansLedger(
    state,
    router?.query?.id as string
  );

  const columns: ColumnsType<EmployeeLoanLedgerDto> = [
    {
      title: "Date",
      dataIndex: "createdDate",
      render: (text) => {
        return <div>{dayjs(text).format("MMMM Do YYYY, h:mm a")}</div>;
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (value) => {
        return <Tag>{value.replace("_", " ")}</Tag>;
      },
    },
    {
      title: "Remarks",
      dataIndex: "description",
    },
    {
      title: "Debit",
      dataIndex: "debit",
      render: (value) => <NumeralFormatter format={"0,0.[00]"} value={value} />,
    },
    {
      title: "Credit",
      dataIndex: "credit",
      render: (value) => <NumeralFormatter format={"0,0.[00]"} value={value} />,
    },
    {
      title: "Balance",
      dataIndex: "runningBalance",
      render: (value) => <NumeralFormatter format={"0,0.[00]"} value={value} />,
    },
  ];
  return (
    <div>
      <Table
        size="small"
        columns={columns}
        dataSource={data?.content as EmployeeLoanLedgerDto[]}
        loading={loading}
        onChange={onNextPage}
      />
    </div>
  );
}

export default LoansLedger;
