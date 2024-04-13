import { PurchaseRequest } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown } from "antd";
import { ColumnsType } from "antd/es/table";
import { DateFormatter, accessControl } from "@/utility/helper";
import { getUrlPrefix } from "@/utility/graphql-client";
import { useContext } from "react";
import { AccountContext } from "@/components/accessControl/AccountContext";
import _ from "lodash";
import { responsiveColumn2 } from "@/utility/constant";
import styled from "styled-components";

interface IProps {
  dataSource: PurchaseRequest[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: PurchaseRequest) => void;
  handleUpdateStatus: (record: PurchaseRequest, status: boolean) => void;
  handleCreatePO: (record: PurchaseRequest) => void;
  changePage: (page: number) => void;
}

export default function PurchaseRequestTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleUpdateStatus,
  handleCreatePO,
  changePage,
}: IProps) {
  // ===================== menus ========================
  const account = useContext(AccountContext);
  // ===================== columns ========================
  const columns: ColumnsType<PurchaseRequest> = [
    {
      title: "PR Date",
      dataIndex: "prDateRequested",
      key: "prDateRequested",
      width: 120,
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
      width: 130,
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
      title: "Type",
      dataIndex: "prType",
      key: "prType",
      width: 140,
      render: (text) => {
        let color = "green";
        if (text === "URGENT") {
          color = "orange";
        } else if (text === "EMERGENCY") {
          color = "red";
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
        let color = "orange";
        if (text) {
          color = "green";
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
      render: (__, record) => {
        let menus: MenuProps["items"] = [
          {
            label: "Print",
            onClick: () =>
              window.open(
                `${getUrlPrefix()}/reports/inventory/print/pr_report/${
                  record.id
                }`
              ),
            key: "4",
          },
        ];

        if (record.isApprove) {
          menus.push(
            {
              label: "Create/View Purchase Order",
              onClick: () => handleCreatePO(record),
              key: "2",
            },
            {
              label: "Void",
              onClick: () => handleUpdateStatus(record, false),
              disabled: accessControl(account?.user?.access, "pr_approver"),
              key: "3",
            }
          );
        } else {
          menus.push({
            label: "Approve",
            onClick: () => handleUpdateStatus(record, true),
            disabled: accessControl(account?.user?.access, "pr_approver"),
            key: "1",
          });
        }

        const items = _.sortBy(menus, ["key"]);

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
    <DivCSS>
      <Row>
        <Col span={24}>
          <Table
            expandable={{
              expandedRowRender: (record) => (
                <Row>
                  <Col {...responsiveColumn2}>
                    <p>
                      Requesting Office:{" "}
                      <Tag>{record.requestingOffice?.officeDescription}</Tag>
                    </p>
                    <p style={{ paddingTop: 5 }}>
                      Request To:{" "}
                      <Tag>{record.requestedOffice?.officeDescription}</Tag>
                    </p>
                  </Col>
                  <Col {...responsiveColumn2}>
                    <p style={{ paddingTop: 5 }}>
                      Request By: <Tag>{record?.userFullname ?? "--"}</Tag>
                    </p>
                    {record?.category === "PROJECTS" && (
                      <p style={{ paddingTop: 5 }}>
                        Project: <Tag>{record.project?.description}</Tag>
                      </p>
                    )}
                    {record?.category === "SPARE_PARTS" && (
                      <p style={{ paddingTop: 5 }}>
                        Equipment (Assets):{" "}
                        <Tag>{record.assets?.description}</Tag>
                      </p>
                    )}
                  </Col>
                </Row>
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
    </DivCSS>
  );
}

const DivCSS = styled.div`
  width: 100%;

  .ant-table-wrapper .ant-table-expanded-row-fixed {
    padding: 4px 16px !important;
  }
`;
