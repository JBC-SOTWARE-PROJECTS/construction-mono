import React, { useState } from "react";
import { Query, Wtx2307, Wtx2307Consolidated } from "@/graphql/gql/graphql";
import {
  GET_2307_LIST_PAGE,
  UPSERT_CONSOLIDATED_WTX,
} from "@/graphql/payables/wtx-queries";
import { useConfirmationPasswordHook } from "@/hooks";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { ReconciliationOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Divider,
  Modal,
  Pagination,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  App,
} from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import _ from "lodash";

interface IProps {
  hide: (hideProps: any) => void;
  record: Wtx2307Consolidated;
  size: number;
}

export default function WTXListModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, record, size } = props;
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Wtx2307[]>([]);
  const [selectedRowkeys, setSelectedRowkeys] = useState<React.Key[]>([]);
  // ===================== Queries ==============================
  const { data, loading } = useQuery<Query>(GET_2307_LIST_PAGE, {
    variables: {
      filter: "",
      supplier: record.supplier?.id,
      start: record.dateFrom,
      end: record.dateTo,
      status: false,
      size: 10,
      page: page,
    },
    fetchPolicy: "cache-and-network",
  });

  const [upsert, { loading: upsertLoading }] = useMutation(
    UPSERT_CONSOLIDATED_WTX,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (data) {
          hide(data);
        }
      },
    }
  );

  //================== functions ====================

  const onSubmit = () => {
    let tobeAdded = _.size(selected);
    let count = tobeAdded + size;
    if (count > 10) {
      return message.error(
        "Up Ten (10) 2307 can be consolidated. Please try again."
      );
    } else {
      showPasswordConfirmation(() => {
        upsert({
          variables: {
            fields: {},
            items: selected,
            id: record?.id,
            supplier: record?.supplier?.id,
          },
        });
      });
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Wtx2307[]) => {
      setSelectedRowkeys(selectedRowKeys);
      setSelected(selectedRows);
    },
    getCheckboxProps: (record: Wtx2307) => ({
      disabled: record.process ?? false,
    }),
  };

  // ================ columns ================================
  const columns: ColumnsType<Wtx2307> = [
    {
      title: "Date",
      dataIndex: "wtxDate",
      key: "wtxDate",
      width: 125,
      render: (text) => <span>{DateFormatter(text)}</span>,
    },
    {
      title: "Source Document",
      dataIndex: "sourceDoc",
      key: "sourceDoc",
      render: (text, record) => <span key={text}>{text ?? record?.refNo}</span>,
    },
    {
      title: "Ref. No",
      dataIndex: "refNo",
      key: "refNo",
    },
    {
      title: "Supplier/Payee",
      dataIndex: "supplier.supplierFullname",
      key: "supplier.supplierFullname",
      render: (text, record) => (
        <span key={text}>{record.supplier?.supplierFullname}</span>
      ),
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
  ];

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <ReconciliationOutlined /> 2307 List:
            {record?.supplier && (
              <Tag color="magenta">{record?.supplier?.supplierFullname}</Tag>
            )}
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "1400px" }}
      onCancel={() => hide(false)}
      footer={
        <Space>
          <Button
            type="primary"
            size="large"
            loading={upsertLoading}
            icon={<SaveOutlined />}
            onClick={onSubmit}>
            Add Selected to 2307 Consolidated
          </Button>
        </Space>
      }>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <p>
            <span className="font-bold">Date From: </span>
            {dayjs(record?.dateFrom).format("MMM DD, YYYY")}
          </p>
          <p>
            <span className="font-bold">Date to: </span>
            {dayjs(record?.dateTo).format("MMM DD, YYYY")}
          </p>
          <Divider className="my-5" />
        </Col>
        <Col span={24}>
          <Table
            rowSelection={{
              selectedRowKeys: selectedRowkeys,
              ...rowSelection,
            }}
            rowKey="id"
            size="small"
            loading={loading}
            columns={columns}
            pagination={false}
            dataSource={data?.wtxListPage?.content as Wtx2307[]}
            footer={() => (
              <Pagination
                current={page + 1}
                pageSize={10}
                responsive={true}
                showSizeChanger={false}
                total={data?.wtxListPage?.totalElements as number}
                onChange={(page) => setPage(page - 1)}
              />
            )}
          />
        </Col>
      </Row>
    </Modal>
  );
}
