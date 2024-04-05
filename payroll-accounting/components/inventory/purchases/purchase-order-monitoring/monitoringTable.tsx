import { PurchaseOrderItemsMonitoring } from "@/graphql/gql/graphql";
import { Row, Col, Table, Pagination, Tag, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { DateFormatter } from "@/utility/helper";
import { NumberFormaterDynamic } from "../../../../utility/helper";

interface IProps {
  dataSource: PurchaseOrderItemsMonitoring[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: PurchaseOrderItemsMonitoring) => void;
  changePage: (page: number) => void;
}

export default function POMonitoringTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
}: IProps) {
  // ===================== columns ========================
  const columns: ColumnsType<PurchaseOrderItemsMonitoring> = [
    {
      title: "PO No.",
      dataIndex: "prDateRequested",
      key: "prDateRequested",
      width: 150,
      render: (_, record) => <span>{record?.purchaseOrder?.poNumber}</span>,
    },
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
      render: (_, record) => <span>{record?.item?.descLong}</span>,
    },
    {
      title: "Supplier",
      dataIndex: "supplier.supplierFullname",
      key: "supplier.supplierFullname",
      width: 400,
      render: (_, record) => (
        <span>{record?.purchaseOrder?.supplier?.supplierFullname}</span>
      ),
    },
    {
      title: "Date Transaction",
      dataIndex: "preparedDate",
      key: "preparedDate",
      width: 140,
      align: "center",
      render: (_, record) => {
        return (
          <span>{DateFormatter(record?.purchaseOrder?.preparedDate)}</span>
        );
      },
    },
    {
      title: "Order Qty (UoU)",
      dataIndex: "qtyInSmall",
      key: "qtyInSmall",
      width: 140,
      align: "right",
      render: (qty) => <span>{NumberFormaterDynamic(qty)}</span>,
    },
    {
      title: "Unit (UoU)",
      dataIndex: "unit",
      key: "unit",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Tag color="blue">{record?.item?.unit_of_usage?.unitDescription}</Tag>
      ),
    },
    {
      title: "Delivered Qty (UoU)",
      dataIndex: "deliveredQty",
      key: "deliveredQty",
      width: 150,
      align: "right",
    },
    {
      title: "Balance Qty (UoU)",
      dataIndex: "deliveryBalance",
      key: "deliveryBalance",
      width: 140,
      align: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      width: 110,
      render: (text) => {
        let color = "blue";
        if (text === "For Delivery") {
          color = "orange";
        } else if (text === "Delivered") {
          color = "green";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "#",
      key: "action",
      width: 80,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        return (
          <Button
            size="small"
            type="primary"
            onClick={() => handleOpen(record)}>
            View
          </Button>
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
          scroll={{ x: 1800 }}
        />
      </Col>
    </Row>
  );
}
