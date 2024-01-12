import { Inventory, Item } from "@/graphql/gql/graphql";
import { EditFilled, FolderOpenOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import DescLong from "../desclong";
import ColTitlePopUp from "../colTitlePopUp";
import { NumberFormaterNoDecimal } from "@/utility/helper";

interface IProps {
  dataSource: Inventory[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: Inventory) => void;
  changePage: (page: number) => void;
}

export default function ProjectInventoryMonitoringTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
}: IProps) {
  // ===================== menus ========================

  // ===================== columns ========================
  const columns: ColumnsType<Inventory> = [
    {
      title: "SKU/Barcode",
      dataIndex: "sku",
      key: "sku",
      width: 140,
    },
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
      render: (text, record) => (
        <DescLong descripton={text} record={record.item as Item} />
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      width: 140,
      render: (text) => <span>{text ?? "--"}</span>,
    },
    {
      title: (
        <ColTitlePopUp
          descripton="Unit of Measurement (UoU)"
          popup="Unit of Usage"
        />
      ),
      dataIndex: "uou",
      key: "uou",
      width: 210,
    },
    {
      title: "Category",
      dataIndex: "item_category.categoryDescription",
      key: "item_category.categoryDescription",
      width: 250,
      render: (_, record) => (
        <span>{record?.item?.item_category?.categoryDescription}</span>
      ),
    },
    {
      title: "Critical Level",
      dataIndex: "reOrderQty",
      key: "reOrderQty",
      width: 120,
      align: "right",
      render: (reOrderQty) => (
        <span>{NumberFormaterNoDecimal(reOrderQty)}</span>
      ),
    },
    {
      title: "On Hand Qty",
      dataIndex: "onHand",
      key: "onHand",
      width: 120,
      align: "right",
      render: (onHand) => <span>{NumberFormaterNoDecimal(onHand)}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      width: 90,
      render: (status) => {
        let color = status === "Healthy" ? "green" : "orange";
        if (status === "No Stock") {
          color = "red";
        }
        return (
          <span>
            <Tag color={color} key={color}>
              {status}
            </Tag>
          </span>
        );
      },
    },
    {
      title: "#",
      key: "action",
      width: 70,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        return (
          <Button
            type="dashed"
            size="small"
            onClick={() => handleOpen(record)}
            icon={<EditFilled />}
          />
        );
      },
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
          pagination={false}
          loading={loading}
          footer={() => (
            <Pagination
              showSizeChanger={false}
              pageSize={10}
              responsive={true}
              total={totalElements}
              onChange={(e) => {
                changePage(e - 1);
              }}
            />
          )}
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
