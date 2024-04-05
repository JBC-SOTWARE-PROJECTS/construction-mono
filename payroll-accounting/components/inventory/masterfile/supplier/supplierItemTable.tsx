import React, { useState } from "react";
import { SupplierItem } from "@/graphql/gql/graphql";
import { DeleteFilled } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button, InputNumber } from "antd";
import { ColumnsType } from "antd/es/table";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";
import { NumberFormater } from "@/utility/helper";
import { confirmDelete } from "@/hooks";


interface IProps {
  dataSource: SupplierItem[];
  loading: boolean;
  handleRemove: (id: string) => void;
  handleChangeCost: (record: SupplierItem, value: number) => void;
}

export default function SupplierItemTable({
  dataSource,
  loading,
  handleRemove,
  handleChangeCost,
}: IProps) {
  // ===================== menus ========================
  const [editable, setEditable] = useState<any>({});

  const _delete = (id: string) => {
    confirmDelete("Click Yes if you want to proceed", () => {
      handleRemove(id);
    });
  };
  // ===================== columns ========================
  const columns: ColumnsType<SupplierItem> = [
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
    },
    {
      title: "Generic Name",
      dataIndex: "genericName",
      key: "genericName",
      width: 200,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      width: 170,
    },
    {
      title: (
        <ColumnTitle
          descripton="Unit of Measurement (UoP/UoU)"
          popup="Unit of Purchase/Unit of Usage"
        />
      ),
      dataIndex: "unitMeasurement",
      key: "unitMeasurement",
      width: 250,
    },
    {
      title: (
        <ColumnTitle
          descripton="Unit Cost (UoU)"
          popup="Unit of Usage"
          editable={true}
        />
      ),
      dataIndex: "cost",
      key: "cost",
      width: 170,
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            setEditable({ ...editable, [e.id]: true });
          }, // double click row
        };
      },
      render: (_, record) => {
        return editable[record.id] ? (
          <InputNumber
            defaultValue={record.cost}
            autoFocus
            onBlur={(e) => {
              let newValue = Number(e?.target?.value);
              handleChangeCost(record, newValue);
              setEditable({ ...editable, [record.id]: false });
            }}
            style={{ width: "100%" }}
          />
        ) : (
          <span>
            {NumberFormater(record.cost) +
              " per " +
              record?.item?.unit_of_usage?.unitDescription}
          </span>
        );
      },
    },
    {
      title: (
        <ColumnTitle descripton="Unit Cost (UoP)" popup="Unit of Purchase" />
      ),
      dataIndex: "costPurchase",
      key: "costPurchase",
      width: 150,
      render: (_, record) => {
        return (
          <span>
            {NumberFormater(record.costPurchase) +
              " per " +
              record?.item?.unit_of_purchase?.unitDescription}
          </span>
        );
      },
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      width: 50,
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          danger
          onClick={() => {
            _delete(record?.id);
          }}
          icon={<DeleteFilled />}
        />
      ),
    },
  ];

  return (
    <Row>
      <Col span={24}>
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
          loading={loading}
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
