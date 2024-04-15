import React, { useMemo } from "react";
import {
  BeginningBalance,
  JournalEntryViewDto,
  Query,
} from "@/graphql/gql/graphql";
import { FileDoneOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Modal, Space, Typography, App, Divider } from "antd";
import _ from "lodash";
import { useConfirmationPasswordHook } from "@/hooks";
import JournaEntriesTable from "../commons/journalEntriesTable";
import { decimalRound2 } from "@/utility/helper";
import {
  GET_JOURNAL_ENTRIES_BEGINNING,
  UPSERT_STATUS_BEGINNING,
} from "@/graphql/inventory/beginning-queries";

interface IProps {
  hide: (hideProps: any) => void;
  record: BeginningBalance;
  status: boolean;
  viewOnly: boolean;
}

export default function PostBeginningBalanceModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, record, status, viewOnly } = props;
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  // ===================== Queries ==============================
  const { data, loading } = useQuery<Query>(GET_JOURNAL_ENTRIES_BEGINNING, {
    variables: {
      id: record?.id,
      status: status,
    },
    fetchPolicy: "cache-and-network",
  });

  const [upsertRecord, { loading: upsertLoading }] = useMutation(
    UPSERT_STATUS_BEGINNING,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        if (!_.isEmpty(data?.updateBegBalStatus?.id)) {
          hide("Beginning Balance Posted");
        } else {
          message.error(
            "Beginning balance for the item has already been set up."
          );
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
    let ledger = data?.begBalanceAccountView as JournalEntryViewDto[];
    const debit = decimalRound2(_.sumBy(ledger, "debit"));
    const credit = decimalRound2(_.sumBy(ledger, "credit"));
    const sum = decimalRound2(debit - credit);
    return sum !== 0;
  }, [data?.begBalanceAccountView]);

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <FileDoneOutlined /> Beginning Balance Journal Entry Details
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
        entries={data?.begBalanceAccountView as JournalEntryViewDto[]}
        loading={loading}
      />
    </Modal>
  );
}
