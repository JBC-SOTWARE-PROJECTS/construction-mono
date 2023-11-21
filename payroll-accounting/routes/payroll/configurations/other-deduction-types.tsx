import UpsertOtherDeductionTypeModal from "@/components/payroll/configurations/UpsertOtherDeductionTypeModal";
import { AdjustmentCategory } from "@/graphql/gql/graphql";
import useGetOtherDeductionPageable from "@/hooks/other-deduction-types/useGetOtherDeductionPageable";
import usePaginationState from "@/hooks/usePaginationState";
import { Input, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
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
function OtherDeductionTypes() {
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
          <UpsertOtherDeductionTypeModal refetch={refetch} record={record} />
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
              onQueryChange("filter", val);
            }}
            allowClear
            style={{ width: "350px" }}
            placeholder="Search"
          />
          <UpsertOtherDeductionTypeModal refetch={refetch} />
        </Space>
      </div>

      <Table columns={columns} dataSource={data} loading={loading} />
    </>
  );
}

export default OtherDeductionTypes;
