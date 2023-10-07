import React, { useMemo, useState } from "react";

import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Button, Table, Input, message, Popconfirm } from "antd";

import AllowanceTypeModal from "./allowance-type-modal";
import {
  FETCH_ALLOWANCE_PAGEABLE,
  DELETE_ALLOWANCE,
} from "@/graphql/company/queries";
import { useMutation, useQuery } from "@apollo/client";
import _ from "lodash";
import type { ColumnsType } from "antd/es/table";

import UseDialog from "@/hooks/useDialog";

const { Search } = Input;

interface DataSourceProps {
  id: string;
  name: string;
  allowanceType: string;
  amount: number;
}

function AllowanceType() {
  const [, setIsModalOpen] = useState(false);
  const [selectedItem] = useState<DataSourceProps | null | string>();
  const [state, setState] = useState({
    filter: "",
    page: 0,
    pageSize: 50,
  });

  const allownceTypeModal = UseDialog(AllowanceTypeModal);

  const { data, loading, refetch } = useQuery(FETCH_ALLOWANCE_PAGEABLE, {
    variables: {
      filter: state.filter,
      page: state.page,
      pageSize: state.pageSize,
    },
  });

  const [deleteAllowance] = useMutation(DELETE_ALLOWANCE, {
    onCompleted: ({ data }) => {
      if (data?.success) {
        message.success(data?.message || "Delete Successfully");
        refetch();
      } else {
        message.error(data?.message || "Failed to Delete");
      }
    },
  });

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const allowanceData = useMemo(() => {
    return _.map(data?.data?.content, (item) => item);
  }, [data?.data?.content]);

  const handleDelete = (index: string) => {
    deleteAllowance({
      variables: { id: index },
    });
  };

  const closeCallBack = () => {
    refetch();
  };

  const columns: ColumnsType<DataSourceProps> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "150px",
    },
    {
      title: "Allowance Type",
      dataIndex: "allowanceType",
      key: "allowanceType",
      width: "150px",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: "150px",
    },
    {
      title: "Action",
      key: "id",
      width: "50px",
      render: (_, record) => {
        return (
          <div
            style={{
              width: "50px",
              justifyContent: "flex-start",
              display: "flex",
              gap: "15px",
            }}
          >
            <Button
              onClick={() => allownceTypeModal({ record }, closeCallBack)}
              type="primary"
              icon={<PlusCircleOutlined />}
            >
              Edit
            </Button>

            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => handleDelete(record?.id)}
              onCancel={onCancel}
              okText="Yes"
              cancelText="No"
            >
              <Button danger type="primary" icon={<CloseCircleOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageContainer title="Allowance Type Management">
        <ProCard
          headStyle={{
            flexWrap: "wrap",
          }}
          bordered
          headerBordered
          extra={
            <ProFormGroup>
              <Search
                allowClear
                size="middle"
                placeholder="Search here.."
                onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
                className="select-header-list"
              />
              <Button
                form="upsertForm"
                type="primary"
                onClick={() => {
                  allownceTypeModal({ selectedItem }, closeCallBack);
                }}
                icon={<PlusCircleOutlined />}
              >
                Add Allowance
              </Button>
            </ProFormGroup>
          }
        >
          <Table
            dataSource={allowanceData}
            columns={columns}
            loading={loading}
            size="small"
          />
        </ProCard>
      </PageContainer>
    </div>
  );
}

export default AllowanceType;
