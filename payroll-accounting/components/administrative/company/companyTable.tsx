import { AccountsPayable } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { FolderOpenOutlined } from "@ant-design/icons";
import { Row, Col, Table, Pagination, Button, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

interface IProps {
  dataSource: AccountsPayable[];
  loading: boolean;
  totalElements: number;
  handleOpen: (record: AccountsPayable) => void;
  changePage: (page: number) => void;
}

export default function CompanyTable({
  dataSource,
  loading,
  totalElements = 1,
  handleOpen,
  changePage,
}: IProps) {
  const columns: ColumnsType<AccountsPayable> = [
    {
      title: "A/P No",
      dataIndex: "apNo",
      key: "apNo",
      width: 100,
    },
    {
      title: "A/P Date",
      dataIndex: "apvDate",
      key: "apvDate",
      width: 110,
      render: (text) => <span>{DateFormatter(text)}</span>,
    },
    {
      title: "Due Date",
      key: "dueDate",
      dataIndex: "dueDate",
      width: 110,
      align: "center",
      render: (text, record) => {
        let now = dayjs(dayjs().format("YYYY-MM-DD"));
        let diff = dayjs(text).diff(now, "days");
        let stringDate = DateFormatter(text);
        let string = "Past Due";
        let color = "red";
        if (diff === 0) {
          string = "Due Today";
          color = "magenta";
        } else if (diff > 0) {
          if (diff === 1) {
            string = "Due Tomorrow";
            color = "orange";
          } else {
            string = `Due in ${diff} days`;
            color = "green";
          }
        }
        if (record.posted) {
          return "--";
        } else {
          return (
            <Tooltip title={stringDate} color={color} key={color}>
              <Tag color={color}>{string}</Tag>
            </Tooltip>
          );
        }
      },
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
      dataIndex: "grossAmount",
      key: "grossAmount",
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
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
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
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
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
                  {record.postedBy ? (
                    <Tag color="blue">{record.postedBy}</Tag>
                  ) : (
                    "--"
                  )}
                </p>
                <p className="margin-0">
                  <span className="font-bold">Ref. Invoice : </span>
                  {record.invoiceNo}
                </p>
                <p className="margin-0">
                  <span className="font-bold">Remarks : </span>
                  {record.remarksNotes}
                </p>
              </>
            ),
          }}
          scroll={{ x: 1600 }}
        />
      </Col>
    </Row>
  );
}
