import React, { useState } from "react";
import { JournalEntryViewDto, Query } from "@/graphql/gql/graphql";
import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { ReconciliationOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { Col, Modal, Row, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { GET_JOURNAL_POSTED } from "@/graphql/payables/queries";
import JournalEntriesSummary from "../common/journalEntriesSummary";
import _ from "lodash";


interface IProps {
  hide: (hideProps: any) => void;
  id: string | null;
}

export default function ViewJournalEntries(props: IProps) {
  const { hide, id } = props;
  const [ledger, setLedger] = useState<JournalEntryViewDto[]>([]);
  // ===================== Queries ==============================
  const { loading } = useQuery<Query>(GET_JOURNAL_POSTED, {
    fetchPolicy: "cache-and-network",
    variables: {
      id: id,
    },
    onCompleted: (data) => {
      let result = data?.ledgerView as JournalEntryViewDto[];
      if (!_.isEmpty(result)) {
        setLedger(result);
      }
    },
  });

  //================== functions ====================

  // ================ columns ================================
  const columns: ColumnsType<JournalEntryViewDto> = [
    {
      title: "Account Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Account Description",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      width: 130,
      align: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Credit",
      dataIndex: "credit",
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
  ];

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <ReconciliationOutlined /> Journal Entries
          </Space>
        </Typography.Title>
      }
      destroyOnClose={true}
      maskClosable={false}
      open={true}
      width={"100%"}
      style={{ maxWidth: "1400px" }}
      onCancel={() => hide(false)}
      footer={false}
    >
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Table
            rowKey="code"
            size="small"
            loading={loading}
            columns={columns}
            pagination={false}
            dataSource={ledger}
            summary={() => <JournalEntriesSummary dataSource={ledger} />}
          />
        </Col>
      </Row>
    </Modal>
  );
}
