import { PettyCash, PettyCashAccounting } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button, Tag } from "antd";
import { ColumnsType } from "antd/es/table";

interface IProps {
  dataSource: PettyCashAccounting[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: PettyCashAccounting) => void;
  changePage: (page: number) => void;
}

export default function PettyCashTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
}: IProps) {
  const columns: ColumnsType<PettyCashAccounting> = [
    {
      title: "PCV Date",
      dataIndex: "pcvDate",
      key: "pcvDate",
      width: 110,
      render: (text) => <span>{DateFormatter(text)}</span>,
    },
    {
      title: "PCV No",
      dataIndex: "pcvNo",
      key: "pcvNo",
      width: 100,
    },
    {
      title: "Payee Fullname",
      dataIndex: "payeeName",
      key: "payeeName",
      width: 500,
      render: (text, record) => <span key={text}>{record.payeeName}</span>,
    },
    {
      title: "PCV Category",
      dataIndex: "pcvCategory",
      key: "pcvCategory",
      width: 100,
      render: (text) => {
        if (text === "PURCHASE") {
          return (
            <Tag key={text} color="blue">
              {text}
            </Tag>
          );
        } else {
          return (
            <Tag key={text} color="magenta">
              {text}
            </Tag>
          );
        }
      },
    },
    {
      title: "Amount Issued",
      dataIndex: "amountIssued",
      key: "amountIssued",
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
      title: "Amount Used",
      dataIndex: "amountUsed",
      key: "amountUsed",
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
        } else if (text === "VOIDED") {
          color = "red";
        }
        return <Tag color={color}>{textMessage}</Tag>;
      },
    },

    {
      title: "#",
      key: "action",
      width: 50,
      fixed: "right",
      render: (text, record) => (
        <Button
          key={text}
          type="dashed"
          size="small"
          onClick={() => handleOpen(record)}
          icon={<FolderOpenOutlined />}
        />
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
                  {record.posted_by ? (
                    <Tag color="blue">{record.posted_by}</Tag>
                  ) : (
                    "--"
                  )}
                </p>
                <p className="margin-0">
                  <span className="font-bold">Remarks : </span>
                  {record.remarks}
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
