import React, { useState } from "react";
import {
  ApAccountsTemplateItems,
  Mutation,
  Query,
} from "@/graphql/gql/graphql";
import {
  DeleteOutlined,
  FileSearchOutlined,
  ReconciliationOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Modal,
  Row,
  Space,
  Table,
  Typography,
  App,
  Divider,
} from "antd";
import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { useConfirmationPasswordHook, useDialog } from "@/hooks";
import ChartOfAccountsComponentSelector from "@/components/chartOfAccounts/chartOfAccountsSelector";
import {
  GET_TEMPLATE_ACCOUNTS_ITEMS,
  REMOVE_TEMPLATE_ACCOUNT_ITEM,
  UPSERT_TEMPLATE_ACCOUNTS_ITEMS,
} from "@/graphql/payables/ledger-queries";
import { AccountsTemplateItemDto } from "@/interface/payables/formInterfaces";
import { randomId } from "@/utility/helper";

interface IProps {
  hide: (hideProps: any) => void;
  id: string | null;
}

export default function AccountTemplatesEntries(props: IProps) {
  const { message } = App.useApp();
  const { hide, id } = props;
  const [ledger, setLedger] = useState<AccountsTemplateItemDto[]>([]);
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  // ===================== Modals ==============================
  const showAccountSelector = useDialog(ChartOfAccountsComponentSelector);
  // ===================== Queries ==============================
  const { loading, refetch } = useQuery<Query>(GET_TEMPLATE_ACCOUNTS_ITEMS, {
    fetchPolicy: "cache-and-network",
    variables: {
      id: id,
    },
    onCompleted: (data) => {
      let result = data?.accountsItemsByParent as AccountsTemplateItemDto[];
      setLedger(result);
    },
    onError: () => {
      message.error(
        "Error occured while fetching data. Please contact administrator"
      );
    },
  });
  // ====================== Mutation ===============================
  const [upsertRecord, { loading: upsertLoading }] = useMutation<Mutation>(
    UPSERT_TEMPLATE_ACCOUNTS_ITEMS,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        const result =
          data.upsertAccountTemplateItem as ApAccountsTemplateItems;
        if (result?.id) {
          hide(result);
        }
      },
    }
  );

  const [removeRecord, { loading: removeLoading }] = useMutation<Mutation>(
    REMOVE_TEMPLATE_ACCOUNT_ITEM,
    {
      ignoreResults: false,
      onCompleted: (data) => {
        const result =
          data.removeAccountTemplateItem as ApAccountsTemplateItems;
        if (result?.id) {
          message.success("Successfully removed account");
          refetch();
        }
      },
    }
  );
  //================== functions ====================

  const onSave = () => {
    showPasswordConfirmation(() => {
      upsertRecord({
        variables: {
          id: id,
          entries: ledger,
        },
      });
    });
  };

  const onShowChartofAccounts = () => {
    const ledgerNew = ledger.map((item) => {
      return {
        code: item?.code ?? "",
        description: item?.desc ?? "",
        accountType: item?.accountType,
      };
    });
    // =====================
    showAccountSelector(
      { defaultSelected: ledgerNew ?? undefined },
      (selected: any) => {
        if (selected) {
          const mapped = selected.map((item: any) => {
            return {
              id: randomId(),
              code: item?.code ?? "",
              desc: item?.accountName ?? "",
              accountType: item?.accountType,
              isNew: true,
            };
          }) as AccountsTemplateItemDto[];
          // ============================
          const filtered = _.filter(mapped, (e) => {
            let obj = _.find(ledger, { code: e.code });
            return _.isEmpty(obj);
          });
          // =============================
          setLedger((prev) => [...prev, ...filtered]);
        }
      }
    );
  };

  const onRemove = (id: string) => {
    showPasswordConfirmation(() => {
      removeRecord({
        variables: {
          id: id,
        },
      });
    });
  };

  // ================ columns ================================
  const columns: ColumnsType<AccountsTemplateItemDto> = [
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
      title: "#",
      dataIndex: "action",
      key: "action",
      width: 50,
      align: "center",
      render: (_, record) => (
        <Button
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemove(record?.id as string)}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <ReconciliationOutlined /> Accounts Template Entries
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
        <div className="w-full dev-between">
          <div>
            <Button
              type="primary"
              size="large"
              danger
              onClick={onShowChartofAccounts}
              icon={<FileSearchOutlined />}>
              Select Accounts
            </Button>
          </div>
          <Space>
            <Button
              type="primary"
              size="large"
              disabled={_.isEmpty(ledger)}
              loading={upsertLoading}
              icon={<SaveOutlined />}
              onClick={onSave}>
              Save Accounts
            </Button>
          </Space>
        </div>
      }>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Divider>Accounts Ledger Entries</Divider>
        </Col>
        <Col span={24}>
          <Table
            rowKey="code"
            size="small"
            loading={loading || removeLoading}
            columns={columns}
            pagination={false}
            dataSource={ledger}
          />
        </Col>
      </Row>
    </Modal>
  );
}
