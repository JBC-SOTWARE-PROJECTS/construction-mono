import { ReceivingReport } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown } from "antd";
import { ColumnsType } from "antd/es/table";
import { DateFormatter, accessControl } from "@/utility/helper";
import { getUrlPrefix } from "@/utility/graphql-client";
import { useContext } from "react";
import { AccountContext } from "@/components/accessControl/AccountContext";
import ButtonPosted from "../../commons/buttonPosted";

interface IProps {
  dataSource: ReceivingReport[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: ReceivingReport) => void;
  handleUpdateStatus: (record: ReceivingReport, status: boolean) => void;
  changePage: (page: number) => void;
  onViewAccount: (record: ReceivingReport) => void;
  onHandleDraftAPV: (record: ReceivingReport) => void;
  onRedoTransaction: (record: ReceivingReport) => void;
}

export default function DeliveryReceivingTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleUpdateStatus,
  changePage,
  onViewAccount,
  onHandleDraftAPV,
  onRedoTransaction,
}: IProps) {
  // ===================== menus ========================
  const account = useContext(AccountContext);
  // ===================== columns ========================
  const columns: ColumnsType<ReceivingReport> = [
    {
      title: "Receiving Date",
      dataIndex: "receiveDate",
      key: "receiveDate",
      width: 120,
      render: (text) => {
        return <span>{DateFormatter(text)}</span>;
      },
    },
    {
      title: "Receiving No.",
      dataIndex: "rrNo",
      key: "rrNo",
      width: 140,
    },
    {
      title: "PO No.",
      dataIndex: "purchaseOrder",
      key: "purchaseOrder",
      width: 140,
      render: (text, record) => (
        <span key={text}>{record?.purchaseOrder?.poNumber}</span>
      ),
    },
    {
      title: "Supplier",
      dataIndex: "supplier.supplierFullname",
      key: "supplier.supplierFullname",
      render: (_, record) => (
        <span>
          {record?.supplier ? record?.supplier?.supplierFullname : "--"}{" "}
          {record?.refAp && (
            <Tag color="cyan" bordered={false}>
              Drafted to APV
            </Tag>
          )}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 140,
      align: "center",
      render: (text) => {
        let color = "blue";
        if (text === "PROJECTS") {
          color = "geekblue";
        } else if (text === "SPARE_PARTS") {
          color = "lime";
        } else if (text === "FIXED_ASSET") {
          color = "cyan";
        } else if (text === "CONSIGNMENT") {
          color = "magenta";
        }
        return <Tag color={color}>{text}</Tag>;
      },
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
        let items: MenuProps["items"] = [
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
        ];
        if (record.isPosted) {
          items.push({
            label: "Draft to APV",
            onClick: () => onHandleDraftAPV(record),
            key: "4",
          });
        }
        if (record.isVoid) {
          items.push({
            label: "Redo",
            onClick: () => onRedoTransaction(record),
            key: "5",
          });
        }
        items.push({
          label: "Print",
          onClick: () =>
            window.open(
              `${getUrlPrefix()}/reports/inventory/print/receiving_report/${
                record.id
              }`
            ),
          key: "6",
        });
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
          expandable={{
            expandedRowRender: (record) => (
              <div className="w-full">
                <p>
                  Office: <Tag>{record.receivedOffice?.officeDescription}</Tag>
                </p>
                <p>
                  Received By: <Tag>{record.userFullname}</Tag>
                </p>
                {record?.category === "PROJECTS" && (
                  <p style={{ paddingTop: 5 }}>
                    Project: <Tag>{record.project?.description}</Tag>
                  </p>
                )}
                {record?.category === "SPARE_PARTS" && (
                  <p style={{ paddingTop: 5 }}>
                    Equipment (Assets): <Tag>{record.assets?.description}</Tag>
                  </p>
                )}
              </div>
            ),
          }}
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
