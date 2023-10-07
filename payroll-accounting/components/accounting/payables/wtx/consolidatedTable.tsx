import { Query, Wtx2307Consolidated } from "@/graphql/gql/graphql";
import { FilterDates, OptionsValue } from "@/utility/interfaces";
import { Row, Col, Table, Pagination, Button, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import { GET_2307_CONSOLIDATED_PAGE } from "@/graphql/payables/wtx-queries";
import { useQuery } from "@apollo/client";
import {
  DateFormatter,
  DateFormatterWithTime,
  NumberFormater,
  dateEndToString,
  dateToString,
} from "@/utility/helper";
import { currency } from "@/utility/constant";
import { FolderOpenOutlined, PrinterOutlined } from "@ant-design/icons";
import { useDialog } from "@/hooks";
import WTXEditConsolidatedModal from "../dialogs/wtxEditConsolidatedModal";
import { getUrlPrefix } from "@/utility/graphql-client";

interface IProps {
  filter: string;
  supplier: OptionsValue | undefined;
  filterDates: FilterDates;
  setPage: (e: number) => void;
  page: number;
}

export default function WTXConsolidatedTable({
  filterDates,
  supplier,
  setPage,
  ...props
}: IProps) {
  const modal = useDialog(WTXEditConsolidatedModal);
  const { data, loading, refetch } = useQuery<Query>(
    GET_2307_CONSOLIDATED_PAGE,
    {
      variables: {
        filter: props.filter,
        supplier: supplier?.value,
        start: dateToString(filterDates.start),
        end: dateEndToString(filterDates.end),
        size: 10,
        page: props.page,
      },
      fetchPolicy: "cache-and-network",
    }
  );
  //=====================functions =========================
  const handleOpen = (record: Wtx2307Consolidated) => {
    modal({ record: record, parentRefetch: refetch }, (result: any) => {
      if (result) {
        refetch();
      }
    });
  };
  //===================== columns ==========================
  const columns: ColumnsType<Wtx2307Consolidated> = [
    {
      title: "Ref. No",
      key: "refNo",
      dataIndex: "refNo",
    },
    {
      title: "Date Consolidated",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 200,
      render: (text) => <span>{DateFormatterWithTime(text)}</span>,
    },
    {
      title: "Date From",
      dataIndex: "dateFrom",
      key: "dateFrom",
      width: 125,
      render: (text) => <span>{DateFormatter(text)}</span>,
    },
    {
      title: "Date To",
      dataIndex: "dateTo",
      key: "dateTo",
      width: 125,
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
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Amount",
      dataIndex: "ewtAmount",
      key: "ewtAmount",
      align: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "#",
      key: "action",
      width: 120,
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
            key={text}
            type="primary"
            size="small"
            onClick={() =>
              window.open(
                `${getUrlPrefix()}/reports/ap/print/2307/consolidated/${
                  record.id
                }`
              )
            }
            icon={<PrinterOutlined />}>
            Print
          </Button>
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
          dataSource={data?.wtxConListPage?.content as Wtx2307Consolidated[]}
          pagination={false}
          loading={loading}
          footer={() => (
            <Pagination
              current={props.page + 1}
              pageSize={10}
              responsive={true}
              showSizeChanger={false}
              total={data?.wtxConListPage?.totalElements as number}
              onChange={(page) => setPage(page - 1)}
            />
          )}
        />
      </Col>
    </Row>
  );
}
