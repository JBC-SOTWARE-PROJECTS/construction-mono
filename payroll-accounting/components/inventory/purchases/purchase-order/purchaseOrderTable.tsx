import { PurchaseOrder } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown } from "antd";
import { ColumnsType } from "antd/es/table";
import { DateFormatter, accessControl } from "@/utility/helper";
import { getUrlPrefix } from "@/utility/graphql-client";
import { useContext } from "react";
import { AccountContext } from "@/components/accessControl/AccountContext";

interface IProps {
  dataSource: PurchaseOrder[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: PurchaseOrder) => void;
  handleUpdateStatus: (record: PurchaseOrder, status: boolean) => void;
  changePage: (page: number) => void;
}

export default function PurchaseOrderTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleUpdateStatus,
  changePage,
}: IProps) {
  // ===================== menus ========================
  const account = useContext(AccountContext);
  // ===================== columns ========================
  const columns: ColumnsType<PurchaseOrder> = [
    {
      title: "PO Date",
      dataIndex: "preparedDate",
      key: "preparedDate",
      width: 120,
      render: (text) => {
        return <span>{DateFormatter(text)}</span>;
      },
    },
    {
      title: "PO No.",
      dataIndex: "poNumber",
      key: "poNumber",
      width: 140,
    },
    {
      title: "PR Number",
      dataIndex: "prNos",
      key: "prNos",
      width: 200,
      render: (text) => {
        return <span>{text ?? "--"}</span>;
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
      dataIndex: "isApprove",
      key: "isApprove",
      align: "center",
      fixed: "right",
      width: 110,
      render: (text, record) => {
        let color = text ? "cyan" : "orange";
        if (record.isCompleted) {
          color = "green";
        } else if (record.isVoided) {
          color = "red";
        }
        return <Tag color={color}>{record.status}</Tag>;
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
            label: "Approve",
            onClick: () => handleUpdateStatus(record, true),
            disabled: accessControl(account?.user?.access, "po_approver"),
            key: "1",
          },
          {
            label: "Void",
            onClick: () => handleUpdateStatus(record, false),
            disabled: accessControl(account?.user?.access, "po_approver"),
            key: "2",
          },
          {
            label: "Print",
            onClick: () =>
              window.open(
                `${getUrlPrefix()}/reports/inventory/print/po_report/${
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
          expandable={{
            expandedRowRender: (record) => (
              <div className="w-full">
                <p>
                  Office: <Tag>{record.office?.officeDescription}</Tag>
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
