import { Row, Col, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { NumberFormater, NumberFormaterDynamic } from "@/utility/helper";
import { InventoryPostList } from "@/utility/inventory-helper";
import ColumnTitle from "../../common/columnTitle/columnTitle";
import dayjs from "dayjs";
import styled from "styled-components";

interface IProps {
  dataSource: InventoryPostList[];
  loading: boolean;
}

export default function PostInventoryTable({ dataSource, loading }: IProps) {
  // ===================== menus ========================

  // ===================== columns ========================
  const columns: ColumnsType<InventoryPostList> = [
    {
      title: "Transaction Date",
      dataIndex: "date",
      key: "date",
      width: 150,
      render: (date) => (
        <span key={date}>{dayjs(date).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 50,
      render: (type) => {
        return (
          <Tag color="green" bordered={false}>
            {type}
          </Tag>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "item.descLong",
      key: "item.descLong",
      render: (_, record) => <span>{record?.item?.descLong ?? "--"}</span>,
    },
    {
      title: (
        <ColumnTitle
          descripton="Unit (UoU)"
          popup="Unit of Usage"
          popupColor="#399b53"
        />
      ),
      dataIndex: "item.unit_of_usage.unitDescription",
      key: "item.unit_of_usage.unitDescription",
      width: 120,
      align: "center",
      render: (text, record) => (
        <span key={text}>{record?.item?.unit_of_usage?.unitDescription}</span>
      ),
    },
    {
      title: (
        <ColumnTitle
          descripton="Qty (UoU)"
          popup="Unit of Usage"
          popupColor="#399b53"
        />
      ),
      dataIndex: "qty",
      key: "qty",
      width: 120,
      align: "right",
      render: (qty) => <span>{NumberFormaterDynamic(qty)}</span>,
    },
    {
      title: (
        <ColumnTitle
          descripton="Unit Cost (UoU)"
          popup="Unit of Usage"
          popupColor="#399b53"
        />
      ),
      dataIndex: "unitcost",
      key: "unitcost",
      width: 140,
      align: "right",
      render: (unitcost) => <span>{NumberFormater(unitcost)}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 70,
      align: "center",
      render: (status) => {
        let color = status === true ? "green" : "blue";
        let text = status === true ? "Posted" : "New";
        return (
          <Tag color={color} bordered={false}>
            {text}
          </Tag>
        );
      },
    },
  ];

  return (
    <TableCSS>
      <Row>
        <Col span={24}>
          <Table
            rowKey="id"
            expandable={{
              expandedRowRender: (record) => (
                <div className="w-full">
                  <p>
                    Inventory Location:{" "}
                    <Tag>{record?.source?.officeDescription}</Tag>
                  </p>
                </div>
              ),
            }}
            size="small"
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            loading={loading}
            scroll={{ x: 1400, y: 250 }}
          />
        </Col>
      </Row>
    </TableCSS>
  );
}

const TableCSS = styled.div`
  thead > tr > td.ant-table-cell.ant-table-row-expand-icon-cell,
  th.ant-table-cell {
    background: #fff !important;
    color: #399b53 !important;
    padding-bottom: 6px !important;
    border-bottom: 4px solid #f0f0f0 !important;
  }

  .ant-table-body {
    overflow: auto auto !important;
  }

  .ant-card .ant-card-head {
    padding: 0px !important;
  }
`;
