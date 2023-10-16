import React, { use, useEffect, useMemo, useState } from "react";

import {
  Button,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Space,
  Table,
} from "antd";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
import {
  UPSERT_ALLOWANCE_ITEM,
  FETCH_ALLOWANCE_PAGEABLE,
} from "@/graphql/company/queries";
import { useMutation, useQuery } from "@apollo/client";
import _ from "lodash";

const { Search } = Input;

interface propsTypes {
  hide: (hideProps: any) => void;
  idx: string;
  refetch: any;
  data: any;
}

interface DataType {
  key: string;
  id: React.Key;
  name: string;
  allowanceType: string;
  amount: number;
  editable: boolean;
}

function AllowanceItemModal(props: propsTypes) {
  const { hide, idx, refetch, data: allowanceData } = props;

  console.log("data item", allowanceData);

  const [state, setState] = useState({
    filter: "",
    page: 0,
    pageSize: 10,
  });

  const { data: allowanceTypeData, loading: allowanceLoading } = useQuery(
    FETCH_ALLOWANCE_PAGEABLE,
    {
      variables: {
        filter: state.filter,
        page: state.page,
        pageSize: state.pageSize,
      },
    }
  );

  const [upsertAllowanceItem, { loading }] = useMutation(
    UPSERT_ALLOWANCE_ITEM,
    {
      onCompleted: ({ data }) => {
        if (data?.success) {
          message.success(data?.success && "Successfully Saved");
          hide(false);
          refetch();
        } else {
          message.error("Faild to Saved!");
        }
      },
    }
  );

  const externalItems = (allowanceData?.data?.content || []).map(
    (item: any) => item?.allowanceType?.id
  );
  const [data, setData] = useState<DataType[] | any>([]);
  const [selectedRows, setSelectedRows] = useState<DataType | any>([]);

  useEffect(() => {
    const defaultSelectedRows = data.filter((item: any) =>
      externalItems.includes(item.key)
    );
    setSelectedRows(defaultSelectedRows);
  }, [data]);

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    newSelectedRows: any
  ) => {
    setSelectedRows(newSelectedRows);
  };

  const handleSelectedRowKey = selectedRows.map((row: any) => row.key);

  const rowSelection = {
    selectedRowKeys: handleSelectedRowKey,
    onChange: onSelectChange,
    getCheckboxProps: (record: any) => ({
      disabled: record.editable,
    }),
  };

  const initialData = useMemo(() => {
    if (allowanceTypeData) {
      return allowanceTypeData?.data?.content.map((item: DataType) => ({
        id: item.id,
        key: item.id,
        name: item.name,
        allowanceType: item.allowanceType,
        amount: item.amount,
        editable: false,
      }));
    }
    return [];
  }, [allowanceTypeData]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  function onSubmit() {
    let selectedKeys = selectedRows?.map((item: any) => item.key);

    let filterData = data.filter(
      (item: any) => !selectedKeys.includes(item.key)
    );
    let deletedId = (filterData || []).map((item: any) => item.id);

    let allData = selectedRows?.map((item: DataType) => ({
      id: item?.key,
      name: item.name,
      allowanceType: item?.allowanceType,
      amount: item?.amount,
    }));

    upsertAllowanceItem({
      variables: {
        id: null,
        toDelete: deletedId,
        allowancePackage: idx,
        allowanceList: allData,
      },
    });
  }

  const columns = [
    {
      title: "name",
      dataIndex: "name",
    },
    {
      title: "Allowance Type",
      dataIndex: "allowanceType",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
  ];

  return (
    <div>
      <Modal
        title={
          <Row gutter={4}>
            <Col md={8}> Add Allowance Item</Col>
            <Col md={16}>
              <Search
                allowClear
                size="middle"
                placeholder="Search here.."
                onSearch={(e) => setState((prev) => ({ ...prev, filter: e }))}
                className="select-header-list"
                style={{ float: "right", marginRight: 30 }}
              />
            </Col>
          </Row>
        }
        open
        destroyOnClose={true}
        maskClosable={false}
        onCancel={() => hide(false)}
        width={"100%"}
        style={{ maxWidth: "1000px" }}
        footer={
          <Space>
            <Button
              type="primary"
              size="large"
              danger
              onClick={() => hide(false)}
              icon={<CloseCircleOutlined />}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              form="upsertForm"
              onClick={onSubmit}
              icon={<SaveOutlined />}
            >
              Save
            </Button>
          </Space>
        }
      >
        <Divider />
        <Row>
          <Col span={24}>
            <Table
              dataSource={data}
              columns={columns}
              loading={allowanceLoading}
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default AllowanceItemModal;
