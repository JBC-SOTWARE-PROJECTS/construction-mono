import React, { useMemo } from "react";
import {
  JournalEntryViewDto,
  QuantityAdjustment,
  Query,
} from "@/graphql/gql/graphql";
import { FileDoneOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Typography,
  App,
  Table,
  Divider,
} from "antd";
import _ from "lodash";
import {
  UPSERT_STATUS_ADJUSTMENT,
  GET_JOURNAL_ENTRIES_QTY_ADJUSTMENT,
} from "@/graphql/inventory/adjustments-queries";
import { useConfirmationPasswordHook } from "@/hooks";
import JournaEntriesTable from "../commons/journalEntriesTable";
import { decimalRound2 } from "@/utility/helper";

interface IProps {
  hide: (hideProps: any) => void;
  record: QuantityAdjustment;
  status: boolean;
  viewOnly: boolean;
}

export default function PostQuantityAdjustmentModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, record, status, viewOnly } = props;
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  // ===================== Queries ==============================
  const { data, loading } = useQuery<Query>(
    GET_JOURNAL_ENTRIES_QTY_ADJUSTMENT,
    {
      variables: {
        id: record?.id,
        status: status,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_STATUS_ADJUSTMENT,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.updateQtyAdjStatus?.id)) {
          hide("Quantity Adjustment Posted");
        } else {
          message.error("Something went wrong. Please contact administrator");
        }
      },
    }
  );

  //================== functions ====================
  const onSubmit = () => {
    showPasswordConfirmation(() => {
      upsertRecord({
        variables: {
          status: status,
          id: record?.id,
        },
      });
    });
  };

  const disabledButton = useMemo(() => {
    let ledger = data?.adjQuantityAccountView as JournalEntryViewDto[];
    const debit = decimalRound2(_.sumBy(ledger, "debit"));
    const credit = decimalRound2(_.sumBy(ledger, "credit"));
    const sum = decimalRound2(debit - credit);
    return sum !== 0;
  }, [data?.adjQuantityAccountView]);

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <FileDoneOutlined /> Quantity Adjustment Journal Entry Details
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
        !viewOnly ? (
          <Space>
            <Button
              type="primary"
              size="large"
              danger={status ? false : true}
              loading={upsertLoading}
              onClick={onSubmit}
              disabled={upsertLoading || disabledButton}
              icon={<SaveOutlined />}>
              {status ? "Post to Inventory" : "Void to Inventory"}
            </Button>
          </Space>
        ) : (
          false
        )
      }>
      <Divider plain>Accounting Journal Entries</Divider>
      <JournaEntriesTable
        entries={data?.adjQuantityAccountView as JournalEntryViewDto[]}
        loading={loading}
      />
    </Modal>
  );
}
