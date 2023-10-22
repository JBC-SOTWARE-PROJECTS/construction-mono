import { Disbursement } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { getUrlPrefix } from "@/utility/graphql-client";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { FolderOpenOutlined, PrinterOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button, Tag, Space } from "antd";
import { ColumnsType } from "antd/es/table";

interface IProps {
  dataSource: Disbursement[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: Disbursement) => void;
  changePage: (page: number) => void;
}

export default function DisbursementTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
}: IProps) {
  const columns: ColumnsType<Disbursement> = [
    {
      title: "CK No",
      dataIndex: "disNo",
      key: "disNo",
      width: 100,
    },
    {
      title: "CK Date",
      dataIndex: "disDate",
      key: "disDate",
      width: 110,
      render: (text) => <span>{DateFormatter(text)}</span>,
    },
    {
      title: "Transaction Type",
      dataIndex: "paymentCategory",
      key: "paymentCategory",
      width: 150,
      render: (text) => {
        let color = "red";
        if (text === "PAYABLE") {
          color = "geekblue";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Payment Type",
      dataIndex: "disType",
      key: "disType",
      width: 110,
    },
    {
      title: "Payee Name",
      dataIndex: "payeeName",
      key: "payeeName",
      width: 600,
    },
    {
      title: "Supplier",
      dataIndex: "supplier.supplierFullname",
      key: "supplier.supplierFullname",
      width: 600,
      render: (text, record) => (
        <span key={text}>{record.supplier?.supplierFullname}</span>
      ),
    },
    {
      title: "Check Amount",
      dataIndex: "checks",
      key: "checks",
      align: "right",
      width: 130,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Cash Amount",
      dataIndex: "cash",
      key: "cash",
      align: "right",
      width: 130,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Discount",
      dataIndex: "discountAmount",
      key: "discountAmount",
      align: "right",
      width: 130,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "EWT",
      dataIndex: "ewtAmount",
      key: "ewtAmount",
      align: "right",
      width: 130,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Applied Amount",
      dataIndex: "appliedAmount",
      key: "appliedAmount",
      align: "right",
      fixed: "right",
      width: 130,
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      width: 90,
      render: (text, record) => {
        let color = "orange";
        let textMessage = text;
        if (record.posted) {
          color = "green";
          let amount = record.voucherAmount - record.appliedAmount;
          if (amount != 0) {
            color = "lime";
            textMessage = "POSTED (A)";
          }
        } else if (text === "VOIDED") {
          color = "red";
        }
        return <Tag color={color}>{textMessage}</Tag>;
      },
    },
    {
      title: "#",
      key: "action",
      width: 80,
      fixed: "right",
      render: (text, record) => (
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
                `${getUrlPrefix()}/reports/ap/print/disbursement/${record.id}`
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
          scroll={{ x: 2400 }}
        />
      </Col>
    </Row>
  );
}
