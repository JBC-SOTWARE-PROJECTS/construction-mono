import { PurchaseOrder } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { DateFormatter, accessControl } from "@/utility/helper";
import { getUrlPrefix } from "@/utility/graphql-client";
import { useContext } from "react";
import { AccountContext } from "@/components/accessControl/AccountContext";
import { type } from "os";
import styled from "styled-components";
import { responsiveColumn2 } from "@/utility/constant";
import _ from "lodash";

interface IProps {
  dataSource: PurchaseOrder[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: PurchaseOrder) => void;
  handleUpdateStatus: (record: PurchaseOrder, status: boolean) => void;
  handleCreateDR: (record: PurchaseOrder) => void;
  viewPRModal: (prNo: string) => void;
  changePage: (page: number) => void;
}

export default function PurchaseOrderTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  handleUpdateStatus,
  handleCreateDR,
  viewPRModal,
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
        if (text) {
          return (
            <Button size="small" type="link" onClick={() => viewPRModal(text)}>
              {text}
            </Button>
          );
        } else {
          return "--";
        }
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
      render: (__, record) => {
        const menus: MenuProps["items"] = [
          {
            label: "Print",
            onClick: () =>
              window.open(
                `${getUrlPrefix()}/reports/inventory/print/po_report/${
                  record.id
                }`
              ),
            key: "4",
          },
        ];

        if (record.isApprove) {
          menus.push(
            {
              label: "Create/View Delivery Receiving",
              onClick: () => handleCreateDR(record),
              key: "2",
            },
            {
              label: "Void",
              onClick: () => handleUpdateStatus(record, false),
              disabled: accessControl(account?.user?.access, "po_approver"),
              key: "3",
            }
          );
        } else {
          if (!record.isCompleted) {
            menus.push({
              label: "Approve",
              onClick: () => handleUpdateStatus(record, true),
              disabled: accessControl(account?.user?.access, "po_approver"),
              key: "1",
            });
          }
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
                      Office: <Tag>{record.office?.officeDescription}</Tag>
                    </p>
                    <p>
                      Prepared By: <Tag>{record.preparedBy}</Tag>
                    </p>
                  </Col>
                  <Col {...responsiveColumn2}>
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
