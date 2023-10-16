import React, { useMemo, useState } from "react";

import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import { Button, Input, message, Popconfirm, Table, Typography } from "antd";

import { useRouter } from "next/router";
import UseDialog from "@/hooks/useDialog";
import AllowancePackageModal from "./allowance-package-modal";
import { useMutation, useQuery } from "@apollo/client";
import {
  DELETE_ALLOWANCE_PACKAGE,
  FETCH_ALLOWANCE_PACKAGE_PAGEABLE,
} from "@/graphql/company/queries";
import _ from "lodash";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;

interface DataSourceProps {
  id: string;
  name: string;
  status: boolean;
}

const { Text, Link } = Typography;

function AllowancePackage() {
  const [, setIsModalOpen] = useState(false);
  const allowancePackageModal = UseDialog(AllowancePackageModal);
  const [selectedItem] = useState<DataSourceProps | null | string>();
  const router = useRouter();

  const [state, setState] = useState({
    filter: "",
    page: 0,
    pageSize: 50,
  });

  const { filter, page, pageSize } = state;
  const { data, loading, refetch } = useQuery(
    FETCH_ALLOWANCE_PACKAGE_PAGEABLE,
    {
      variables: {
        filter,
        page,
        pageSize,
      },
    }
  );

  const [deleteAllowancePackage] = useMutation(DELETE_ALLOWANCE_PACKAGE, {
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

  const closeCallBack = () => {
    refetch();
  };

  const handleDelete = (index: string) => {
    deleteAllowancePackage({
      variables: { id: index },
    });
  };

  const handleClick = (idx: string) => {
    router?.push({
      pathname: `/payroll/allowance-management/${idx}/allowance-item`,
      query: { idx },
    });
  };

  const columns: ColumnsType<DataSourceProps> = [
    {
      title: "Name",
      key: "name",
      width: "150px",
      render: (_, record) => {
        return (
          <Text
            onClick={() => handleClick(record?.id)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {record?.name}
          </Text>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "150px",
      render: (_, record) => {
        let status;
        if (record?.status == true) {
          status = "ACTIVE";
        } else {
          status = "IN-ACTIVE";
        }
        return status;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
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
              onClick={() => allowancePackageModal({ record }, closeCallBack)}
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
      <PageContainer title="Allowance Package Management">
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
                  allowancePackageModal({ selectedItem }, closeCallBack);
                }}
                icon={<PlusCircleOutlined />}
              >
                Add Allowance Package
              </Button>
            </ProFormGroup>
          }
        >
          <Table
            loading={loading}
            dataSource={allowanceData}
            columns={columns}
            size="small"
          />
        </ProCard>
      </PageContainer>
    </div>
  );
}

const handleMouseEnter = () => {
  document.body.style.cursor = "pointer";
};

const handleMouseLeave = () => {
  document.body.style.cursor = "auto";
};

export default AllowancePackage;
