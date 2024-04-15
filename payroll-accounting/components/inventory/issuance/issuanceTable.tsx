import { StockIssue } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown } from "antd";
import { ColumnsType } from "antd/es/table";
import { DateFormatter, accessControl } from "@/utility/helper";
import { getUrlPrefix } from "@/utility/graphql-client";
import { useContext } from "react";
import { AccountContext } from "@/components/accessControl/AccountContext";
import ButtonPosted from "../commons/buttonPosted";

interface IProps {
  dataSource: StockIssue[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: StockIssue) => void;
  handleUpdateStatus: (record: StockIssue, status: boolean) => void;
  changePage: (page: number) => void;
  onViewAccount: (record: StockIssue) => void;
}

export default function IssuanceTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleUpdateStatus,
  changePage,
  onViewAccount,
}: IProps) {
  // ===================== menus ========================
  const account = useContext(AccountContext);
  // ===================== columns ========================
  const columns: ColumnsType<StockIssue> = [
    {
      title: "Date",
      dataIndex: "issueDate",
      key: "issueDate",
      width: 120,
      render: (text) => {
        return <span>{DateFormatter(text)}</span>;
      },
    },
    {
      title: "Transaction No.",
      dataIndex: "issueNo",
      key: "issueNo",
      width: 140,
    },
    {
      title: "To",
      dataIndex: "issueTo",
      key: "issueTo",
      render: (text, record) => (
        <span key={text}>{record?.issueTo?.officeDescription}</span>
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
        if (record.isCancel) {
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
        if (record?.issueType === "ISSUE") {
          items.push({
            label: "Print",
            onClick: () => {
              window.open(
                `${getUrlPrefix()}/reports/inventory/print/issue_report/${
                  record.id
                }`
              );
            },
            key: "3",
          });
        }
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
                  Office: <Tag>{record.issueTo?.officeDescription}</Tag>
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
