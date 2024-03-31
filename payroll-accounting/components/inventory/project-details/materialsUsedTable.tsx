import { ProjectUpdatesMaterials } from "@/graphql/gql/graphql";
import {
  DateFormatterWithTime,
  NumberFormater,
  NumberFormaterNoDecimal,
} from "@/utility/helper";
import { Row, Col, Table, Pagination } from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";


interface IProps {
  dataSource: ProjectUpdatesMaterials[];
  loading: boolean;
  totalElements: number;
  handleChangePage: (page: number) => void;
}

export default function MaterialsUsedTable({
  dataSource,
  loading,
  totalElements = 1,
  handleChangePage,
}: IProps) {
  const columns: ColumnsType<ProjectUpdatesMaterials> = [
    {
      title: "Transaction Date",
      dataIndex: "dateTransact",
      key: "dateTransact",
      width: 180,
      render: (date) => DateFormatterWithTime(date),
    },
    {
      title: "Reference #",
      dataIndex: "refNo",
      key: "refNo",
      align: "center",
      width: 150,
      render: (_, record) => {
        return <span>{record?.projectUpdates?.transNo ?? "--"}</span>;
      },
    },
    {
      title: "Item Description",
      dataIndex: "descLong",
      key: "descLong",
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: <ColumnTitle descripton="Unit (UoU)" popup="Unit of Usage" />,
      dataIndex: "uou",
      key: "uou",
      width: 150,
      render: (uou) => {
        return <span>{uou}</span>;
      },
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "right",
      width: 120,
      render: (qty) => {
        return <span>{NumberFormaterNoDecimal(qty)}</span>;
      },
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      align: "right",
      width: 120,
      render: (cost) => {
        return <span>{NumberFormater(cost)}</span>;
      },
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
      key: "subTotal",
      align: "right",
      width: 120,
      render: (subTotal) => {
        return <span>{NumberFormater(subTotal)}</span>;
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
              defaultCurrent={1}
              onChange={(e) => {
                handleChangePage(e - 1);
              }}
            />
          )}
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
