import { Supplier } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown, Button } from "antd";
import { ColumnsType } from "antd/es/table";

interface IProps {
  dataSource: Supplier[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: Supplier) => void;
  handleAssign: (record: Supplier) => void;
  changePage: (page: number) => void;
}

export default function SupplierTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleAssign,
  changePage,
}: IProps) {
  // ===================== menus ========================

  // ===================== columns ========================
  const columns: ColumnsType<Supplier> = [
    {
      title: "Supplier Code",
      dataIndex: "supplierCode",
      key: "supplierCode",
      width: 140,
    },
    {
      title: "Supplier Name",
      dataIndex: "supplierFullname",
      key: "supplierFullname",
    },
    {
      title: "Contact No.",
      dataIndex: "primaryTelphone",
      key: "primaryTelphone",
      width: 200,
    },
    {
      title: "Email Address",
      dataIndex: "supplierEmail",
      key: "supplierEmail",
      width: 200,
      render: (txt) => {
        return <span className="text-blue">{txt}</span>;
      },
    },
    {
      title: "Supplier Type",
      dataIndex: "supplierTypes",
      key: "supplierTypes",
      width: 140,
      render: (_, record) => {
        return record?.supplierTypes?.supplierTypeDesc;
      },
    },
    {
      title: "ATC #",
      dataIndex: "atcNo",
      key: "atcNo",
      width: 140,
      render: (atcNo) => {
        return atcNo ?? "--";
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
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
            label: "View Supplier Item",
            onClick: () => handleAssign(record),
            key: "1",
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
