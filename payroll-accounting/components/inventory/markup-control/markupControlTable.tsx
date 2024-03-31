import { Item, MarkupItemDto } from "@/graphql/gql/graphql";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import DescLong from "../desclong";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";
import { NumberFormater } from "@/utility/helper";


interface IProps {
  dataSource: MarkupItemDto[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: MarkupItemDto) => void;
  changePage: (page: number) => void;
}

export default function MarkupControlTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
}: IProps) {
  // ===================== menus ========================

  // ===================== columns ========================
  const columns: ColumnsType<MarkupItemDto> = [
    {
      title: "Description",
      dataIndex: "descLong",
      key: "descLong",
      render: (text, record) => {
        let item = {
          id: record?.item,
          descLong: record?.descLong ?? "",
          sku: record?.sku ?? "",
          itemCode: record?.itemCode ?? "",
          brand: record?.brand ?? "",
          production: record?.production ?? false,
          isMedicine: record?.isMedicine ?? false,
          vatable: record?.vatable ?? false,
          fixAsset: record?.fixAsset ?? false,
          consignment: record?.consignment ?? false,
          forSale: record?.forSale ?? false,
        } as Item;
        return <DescLong descripton={text ?? ""} record={item as Item} />;
      },
    },
    {
      title: "Category",
      dataIndex: "categoryDescription",
      key: "categoryDescription",
      width: 250,
    },
    {
      title: <ColumnTitle descripton="Unit (UoU)" popup="Unit of Usage" />,
      dataIndex: "uou",
      key: "uou",
      width: 110,
    },
    {
      title: "Last Unit Cost",
      dataIndex: "lastUnitCost",
      key: "lastUnitCost",
      width: 120,
      align: "right",
      render: (onHand) => <span>{NumberFormater(onHand)}</span>,
    },
    {
      title: "Actual Unit Cost",
      dataIndex: "actualCost",
      key: "actualCost",
      width: 120,
      align: "right",
      render: (cost) => <span>{NumberFormater(cost)}</span>,
    },
    {
      title: "Markup (%)",
      dataIndex: "markup",
      key: "markup",
      width: 120,
      align: "right",
      render: (cost) => <span>{`${NumberFormater(cost)}%`}</span>,
    },
    {
      title: "Selling Price (w/Vat)",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      width: 150,
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
