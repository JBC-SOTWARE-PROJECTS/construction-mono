import React, { useState } from "react";

import {
  PageContainer,
  ProCard,
  ProFormGroup,
} from "@ant-design/pro-components";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import AllowanceItemModal from "./allowance-item-modal";

import UseDialog from "@/hooks/useDialog";
import { useRouter } from "next/router";

import {
  FETCH_ALLOWANCE_ITEM,
  UPSERT_ALLOWANCE_PACKAGE_ITEM,
} from "@/graphql/company/queries";
import { useMutation, useQuery } from "@apollo/client";

const { Search } = Input;

interface Item {
  key: string;
  id: string;
  name: string;
  allowanceType: string;
  amount: number;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}: any) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function AllowanceItem() {
  const router = useRouter();

  const { idx } = router.query;
  const [state, setState] = useState({
    filter: "",
    page: 0,
    pageSize: 50,
  });

  const { filter, page, pageSize } = state;

  const allowanceItem = UseDialog(AllowanceItemModal);
  const { data, loading, refetch } = useQuery(FETCH_ALLOWANCE_ITEM, {
    variables: {
      filter,
      page,
      pageSize,
      allowancePackage: idx,
    },
  });

  const [upsertAllowanceitem] = useMutation(UPSERT_ALLOWANCE_PACKAGE_ITEM, {
    onCompleted: ({ data }) => {
      if (data?.success) {
        message.success(data?.success && "Successfully Saved");
        refetch();
      } else {
        message.error("Faild to Saved!");
      }
    },
  });

  const closeCallBack = () => {
    refetch();
  };

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: Item) => record.id === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({
      name: "",
      allowanceType: "",
      amount: 0,
      ...record,
    });
    setEditingKey(record.id as string);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newItem = data?.data?.content || [];
      const newData = [...newItem];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const updatedItem = {
          ...newData[index],
          ...row,
        };

        await upsertAllowanceitem({
          variables: {
            id: updatedItem.id,
            fields: updatedItem,
          },
        });

        setEditingKey("");
      }
    } catch (errInfo) {
      message.error("Something Went Wrong");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Allowance Type",
      dataIndex: "allowanceType",
      render: (value: string) => {
        return value.replace("_", " ");
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="primary"
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button type="primary" danger>
                Cancel
              </Button>
            </Popconfirm>
          </span>
        ) : (
          <Button type="primary" onClick={() => edit(record)}>
            Edit
          </Button>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === "amount" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

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
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  allowanceItem({ idx, refetch, data }, closeCallBack);
                }}
              >
                Add Allowance Item
              </Button>
            </ProFormGroup>
          }
        >
          <div>
            <Form
              form={form}
              name="upsertForm"
              layout="vertical"
              // onFinish={onSubmit}
              // onFinishFailed={onFinishFailed}
            >
              <Table
                rowKey={"id"}
                loading={loading}
                dataSource={data?.data?.content}
                columns={mergedColumns}
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                rowClassName="editable-row"
                pagination={{
                  onChange: cancel,
                }}
              />
            </Form>
          </div>
        </ProCard>
      </PageContainer>
    </div>
  );
}

export default AllowanceItem;
