import { Item } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown } from "antd";
import { ColumnsType } from "antd/es/table";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";
import DescLong from "../../desclong";


interface IProps {
  dataSource: Item[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: Item) => void;
  handleAssign: (record: Item) => void;
  handleSupplier: (record: Item) => void;
  changePage: (page: number) => void;
}

export default function ItemTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleAssign,
  handleSupplier,
  changePage,
}: IProps) {
  // ===================== menus ========================

  // ===================== columns ========================
  const columns: ColumnsType<Item> = [
    {
      title: "SKU/Barcode",
      dataIndex: "sku",
      key: "sku",
      width: 120,
    },
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
      render: (text, record) => <DescLong descripton={text} record={record} />,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      width: 150,
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
      title: "Category",
      dataIndex: "item_category.categoryDescription",
      key: "item_category.categoryDescription",
      width: 250,
      render: (_, record) => (
        <span>{record?.item_category?.categoryDescription}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      align: "center",
      fixed: "right",
      width: 90,
      render: (text) => {
        let color = "red";
        if (text) {
          color = "green";
        }
        return <Tag color={color}>{text ? "Active" : "Inactive"}</Tag>;
      },
    },
    {
      title: "#",
      key: "action",
      width: 70,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const items: MenuProps["items"] = [
          {
            label: "Assign Item",
            onClick: () => handleAssign(record),
            key: "1",
          },
          {
            label: "Assign Supplier",
            onClick: () => handleSupplier(record),
            key: "2",
          },
        ];

        return (
          <Dropdown.Button
            size="small"
            type="dashed"
            menu={{ items }}
            trigger={["click"]}
            onClick={() => handleOpen(record)}>
            <FolderOpenOutlined />
          </Dropdown.Button>
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
