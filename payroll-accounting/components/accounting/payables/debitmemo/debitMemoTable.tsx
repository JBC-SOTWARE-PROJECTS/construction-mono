import { DebitMemo } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { getUrlPrefix } from "@/utility/graphql-client";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { FolderOpenOutlined, PrinterOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button, Tag, Space } from "antd";
import { ColumnsType } from "antd/es/table";

interface IProps {
  dataSource: DebitMemo[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: DebitMemo) => void;
  changePage: (page: number) => void;
  type: string;
}

export default function DebitMemoTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
  type = "Memo",
}: IProps) {
  const columns: ColumnsType<DebitMemo> = [
    {
      title: `Debit ${type} No.`,
      dataIndex: "debitNo",
      key: "debitNo",
      width: 150,
    },
    {
      title: `Debit ${type} Date`,
      dataIndex: "debitDate",
      key: "debitDate",
      width: 150,
      render: (text) => <span>{DateFormatter(text)}</span>,
    },
    {
      title: "Supplier",
      dataIndex: "supplier.supplierFullname",
      key: "supplier.supplierFullname",
      render: (text, record) => (
        <span key={text}>{record.supplier?.supplierFullname}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "memoAmount",
      key: "memoAmount",
      align: "right",
      fixed: "right",
      width: 140,
      render: (amount, record) => (
        <span>
          <small>{currency} </small>
          {type === "Memo"
            ? NumberFormater(amount)
            : NumberFormater(record.appliedAmount)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      width: 100,
      render: (text, record) => {
        let color = "orange";
        if (record.posted) {
          color = "green";
        } else if (text === "VOIDED") {
          color = "red";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },

    {
      title: "#",
      key: "action",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="dashed"
            size="small"
            onClick={() => handleOpen(record)}
            icon={<FolderOpenOutlined />}
          />
          <Button
            type="primary"
            size="small"
            onClick={() =>
              window.open(
                `${getUrlPrefix()}/reports/ap/print/debit-advice/${record.id}`
              )
            }
            icon={<PrinterOutlined />}
          />
        </Space>
      ),
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
          expandable={{
            expandedRowRender: (record) => (
              <>
                <p className="margin-0">
                  <span className="font-bold">Approved By : </span>
                  {record.postedBy ? (
                    <Tag color="blue">{record.postedBy}</Tag>
                  ) : (
                    "--"
                  )}
                </p>
                <p className="margin-0">
                  <span className="font-bold">Remarks : </span>
                  {record.remarksNotes}
                </p>
              </>
            ),
          }}
          scroll={{ x: 1400 }}
        />
      </Col>
    </Row>
  );
}
