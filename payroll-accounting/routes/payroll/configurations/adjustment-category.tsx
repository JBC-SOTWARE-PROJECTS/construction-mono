import UpsertAdjustmentCategoryModal from "@/components/payroll/configurations/UpsertAdjustmentCategoryModal";
import { AdjustmentCategory } from "@/graphql/gql/graphql";
import useGetAdjustmentCategories from "@/hooks/adjustment-category/useGetAdjustmentCategories";
import useGetChartOfAccounts from "@/hooks/useGetChartOfAccounts";
import { Input, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
const { Search } = Input;
function AdjustmentCategory() {
  const [filter, setFilter] = useState<String>("");
  const [data, loading, refetch] = useGetAdjustmentCategories(filter);
  const [coa, loadingCoa] = useGetChartOfAccounts();

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
      title: "Sub-account",
      dataIndex: "subaccountCode",
      render: (code) => {
        return (
          coa?.filter((item: any) => item.code === code)[0]?.accountName || ""
        );
      },
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (value) => (
        <Tag color={value === "ADDITION" ? "green" : "red"}>{value}</Tag>
      ),
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
      title: "Editable",
      dataIndex: "isDefault",
      render: (value) => (
        <Tag color={value ? "orange" : "green"}>{!value ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (value, { isDefault, ...record }) => (
        <UpsertAdjustmentCategoryModal
          isDefault={isDefault}
          coa={coa}
          refetch={refetch}
          record={record}
        />
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
              setFilter(val);
            }}
            allowClear
            style={{ width: "350px" }}
            placeholder="Search"
          />
          <UpsertAdjustmentCategoryModal coa={coa} refetch={refetch} />
        </Space>
      </div>

      <Table columns={columns} dataSource={data} loading={loading} />
    </>
  );
}

export default AdjustmentCategory;
