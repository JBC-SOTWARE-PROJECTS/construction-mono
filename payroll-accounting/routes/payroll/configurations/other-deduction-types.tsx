import UpsertAdjustmentCategoryModal from "@/components/payroll/configurations/UpsertAdjustmentCategoryModal";
import { AdjustmentCategory } from "@/graphql/gql/graphql";
import useGetAdjustmentCategories from "@/hooks/adjustment-category/useGetAdjustmentCategories";
import useGetOtherDeductionPageable from "@/hooks/other-deduction-types/useGetOtherDeductionPageable";
import usePaginationState from "@/hooks/usePaginationState";
import { Input, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
const { Search } = Input;

interface variables {
  page: number;
  size: number;
  filter: string;
}
const initialState: variables = {
  size: 25,
  page: 0,
  filter: "",
};
function AdjustmentCategory() {
  const [state, { onNextPage, onQueryChange }] = usePaginationState(
    initialState,
    0,
    25
  );
  const [data, loading, refetch] = useGetOtherDeductionPageable(
    state,
    () => {}
  );

  const columns: ColumnsType<AdjustmentCategory> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <Tag color={value ? "green" : "orange"}>
          {value ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (value, { isDefault, ...record }) =>
        !isDefault && (
          <UpsertAdjustmentCategoryModal refetch={refetch} record={record} />
        ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 15,
        }}
      >
        <Space>
          <Search
            onSearch={(val) => {
              onQueryChange("filter");
            }}
            allowClear
            style={{ width: "350px" }}
            placeholder="Search"
          />
          <UpsertAdjustmentCategoryModal refetch={refetch} />
        </Space>
      </div>

      <Table columns={columns} dataSource={data} loading={loading} />
    </>
  );
}

export default AdjustmentCategory;
