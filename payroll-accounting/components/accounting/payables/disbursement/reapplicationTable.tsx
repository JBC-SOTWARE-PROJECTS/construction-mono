import { Reapplication } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { getUrlPrefix } from "@/utility/graphql-client";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { FolderOpenOutlined, PrinterOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button, Tag, Space } from "antd";
import { ColumnsType } from "antd/es/table";

interface IProps {
  dataSource: Reapplication[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: Reapplication) => void;
  changePage: (page: number) => void;
}

export default function ReapplicationTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
}: IProps) {
  const columns: ColumnsType<Reapplication> = [
    {
      title: "Reapplication Date",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 150,
      render: (text) => <span>{DateFormatter(text)}</span>,
    },
    {
      title: "RP No",
      dataIndex: "rpNo",
      key: "rpNo",
      width: 100,
      render: (text) => <span key={text}>{text ?? "--"}</span>,
    },
    {
      title: "CK No",
      dataIndex: "disNo",
      key: "disNo",
      width: 100,
      render: (text, record) => (
        <span key={text}>{record.disbursement?.disNo}</span>
      ),
    },
    {
      title: "CK Date",
      dataIndex: "disDate",
      key: "disDate",
      width: 110,
      render: (text, record) => (
        <span key={text}>{DateFormatter(record.disbursement?.disDate)}</span>
      ),
    },
    {
      title: "Payee Name",
      dataIndex: "disbursement.payeeName",
      key: "disbursement.payeeName",
      width: 500,
      render: (text, record) => (
        <span key={text}>{record.disbursement?.payeeName}</span>
      ),
    },
    {
      title: "Supplier",
      dataIndex: "supplier.supplierFullname",
      key: "supplier.supplierFullname",
      width: 500,
      render: (text, record) => (
        <span key={text}>{record.supplier?.supplierFullname}</span>
      ),
    },
    {
      title: "Disbursement Amount",
      dataIndex: "checks",
      key: "checks",
      align: "right",
      width: 180,
      render: (key, record) => (
        <span key={key}>
          <small>{currency} </small>
          {NumberFormater(record.disbursement?.voucherAmount)}
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
      render: (text, record) => (
        <Space>
          <Button
            key={text}
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
                `${getUrlPrefix()}/reports/ap/print/reapply/${record.id}`
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
                  <span className="font-bold">Remarks : </span>
                  {record.remarks}
                </p>
              </>
            ),
          }}
          scroll={{ x: 2250 }}
        />
      </Col>
    </Row>
  );
}
