import { BeginningBalanceDto, Item } from "@/graphql/gql/graphql";
import { EditFilled, FolderOpenOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Row, Col, Table, Pagination, Tag, Dropdown, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import DescLong from "../desclong";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";
import { NumberFormater, NumberFormaterNoDecimal } from "@/utility/helper";


interface IProps {
  dataSource: BeginningBalanceDto[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: BeginningBalanceDto) => void;
  changePage: (page: number) => void;
}

export default function BeginningBalanceTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
}: IProps) {
  // ===================== menus ========================

  // ===================== columns ========================
  const columns: ColumnsType<BeginningBalanceDto> = [
    {
      title: "SKU/Barcode",
      dataIndex: "sku",
      key: "sku",
      width: 115,
      render: (_, record) => <span>{record?.item?.sku}</span>,
    },
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
      render: (_, record) => (
        <DescLong
          descripton={record.item?.descLong ?? ""}
          record={record.item as Item}
        />
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      width: 190,
      render: (_, record) => <span>{record?.item?.brand ?? "--"}</span>,
    },
    {
      title: <ColumnTitle descripton="Unit (UoU)" popup="Unit of Usage" />,
      dataIndex: "uou",
      key: "uou",
      width: 110,
    },
    {
      title: "Category",
      dataIndex: "item.categoryDescription",
      key: "item.categoryDescription",
      width: 250,
      render: (_, record) => <span>{record?.item?.categoryDescription}</span>,
    },
    {
      title: "Beg. Qty",
      dataIndex: "beginningBalance",
      key: "beginningBalance",
      width: 120,
      align: "right",
      render: (onHand) => <span>{NumberFormaterNoDecimal(onHand)}</span>,
    },
    {
      title: "Unit Cost",
      dataIndex: "beginningCost",
      key: "beginningCost",
      width: 120,
      align: "right",
      render: (cost) => <span>{NumberFormater(cost)}</span>,
    },
    {
      title: "#",
      key: "action",
      width: 70,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        return (
          <Button
            type="dashed"
            size="small"
            onClick={() => handleOpen(record)}
            icon={<FolderOpenOutlined />}
          />
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
