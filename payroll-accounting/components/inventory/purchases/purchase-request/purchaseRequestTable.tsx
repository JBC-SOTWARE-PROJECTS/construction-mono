import { PurchaseRequest } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown } from "antd";
import { ColumnsType } from "antd/es/table";
import DescLong from "../../desclong";
import { DateFormatter } from "@/utility/helper";

interface IProps {
  dataSource: PurchaseRequest[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: PurchaseRequest) => void;
  handleAssign: (record: PurchaseRequest) => void;
  handleSupplier: (record: PurchaseRequest) => void;
  changePage: (page: number) => void;
}

export default function PurchaseRequestTable({
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
  const columns: ColumnsType<PurchaseRequest> = [
    {
      title: "PR Date",
      dataIndex: "prDateRequested",
      key: "prDateRequested",
      width: 140,
      render: (text) => {
        return <span>{DateFormatter(text)}</span>;
      },
    },
    {
      title: "PR No.",
      dataIndex: "prNo",
      key: "prNo",
      width: 140,
    },
    {
      title: "PR Date Needed",
      dataIndex: "prDateNeeded",
      key: "prDateNeeded",
      width: 140,
      render: (text) => {
        return <span>{DateFormatter(text)}</span>;
      },
    },
    {
      title: "Supplier",
      dataIndex: "supplier.supplierFullname",
      key: "supplier.supplierFullname",
      render: (_, record) => (
        <span>
          {record?.supplier ? record?.supplier?.supplierFullname : "--"}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 140,
      render: (_, record) => (
        <span>
          {record?.supplier ? record?.supplier?.supplierFullname : "--"}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "prType",
      key: "prType",
      width: 140,
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
