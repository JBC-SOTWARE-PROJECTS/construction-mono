import { ReturnSupplier } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown } from "antd";
import { ColumnsType } from "antd/es/table";
import { DateFormatter } from "@/utility/helper";
import { getUrlPrefix } from "@/utility/graphql-client";
import ButtonPosted from "../../commons/buttonPosted";

interface IProps {
  dataSource: ReturnSupplier[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: ReturnSupplier) => void;
  handleUpdateStatus: (record: ReturnSupplier, status: boolean) => void;
  changePage: (page: number) => void;
  onViewAccount: (record: ReturnSupplier) => void;
}

export default function ReturnSupplierTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleUpdateStatus,
  changePage,
  onViewAccount,
}: IProps) {
  // ===================== columns ========================
  const columns: ColumnsType<ReturnSupplier> = [
    {
      title: "RTS Date",
      dataIndex: "returnDate",
      key: "returnDate",
      width: 120,
      render: (text) => {
        return <span>{DateFormatter(text)}</span>;
      },
    },
    {
      title: "RTS #",
      dataIndex: "rtsNo",
      key: "rtsNo",
      width: 140,
    },
    {
      title: "Ref #",
      dataIndex: "receivedRefNo",
      key: "receivedRefNo",
      width: 200,
      render: (text) => {
        return <span>{text ?? ""}</span>;
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
      title: "Status",
      dataIndex: "isPosted",
      key: "isPosted",
      align: "center",
      fixed: "right",
      width: 110,
      render: (status, record) => {
        let color = status ? "green" : "blue";
        let text = status ? "POSTED" : "NEW";
        if (record.isVoid) {
          color = "red";
          text = "VOIDED";
        }
        // for viewing please set status to true to view the current entries not the reverse
        if (status) {
          return (
            <ButtonPosted onClick={() => onViewAccount(record)}>
              {text}
            </ButtonPosted>
          );
        } else {
          return (
            <Tag bordered={false} color={color} key={color}>
              {text}
            </Tag>
          );
        }
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
            label: "Post",
            onClick: () => handleUpdateStatus(record, true),
            key: "1",
          },
          {
            label: "Void",
            onClick: () => handleUpdateStatus(record, false),
            key: "2",
          },
          {
            label: "Print",
            onClick: () =>
              window.open(
                `${getUrlPrefix()}/reports/inventory/print/return_sup/${
                  record.id
                }`
              ),
            key: "3",
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
