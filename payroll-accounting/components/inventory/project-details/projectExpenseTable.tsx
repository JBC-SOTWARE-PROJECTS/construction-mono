import { gql, useLazyQuery } from "@apollo/client";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { App, Col, Row, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { Key, useState } from "react";

const GET_PROJECT_PAYABLE_BREAKDOWN = gql`
  query ($projectId: UUID!, $transactionTypeId: UUID) {
    list: projectPayableBreakdown(
      projectId: $projectId
      transactionTypeId: $transactionTypeId
    ) {
      payableId
      apNo
      apvDate
      invoiceNo
      supplierName
      status
      netAmount
      lineCount
    }
  }
`;

const GET_PROJECT_PAYABLE_ITEMS = gql`
  query (
    $projectId: UUID!
    $payableId: UUID!
    $transactionTypeId: UUID
  ) {
    list: projectPayableItems(
      projectId: $projectId
      payableId: $payableId
      transactionTypeId: $transactionTypeId
    ) {
      detailId
      transactionTypeDescription
      amount
      discAmount
      vatAmount
      ewtAmount
      netAmount
      refNo
      remarksNotes
    }
  }
`;

interface ProjectExpenseRow {
  project?: { id?: string | null } | null;
  transactionType?: { id?: string | null } | null;
  transTypeDescription?: string | null;
  totalNetAmount?: number | null;
  lineCount?: number | null;
  payableCount?: number | null;
  pettyCashCount?: number | null;
  sourceType?: string | null;
}

interface ProjectPayableBreakdown {
  payableId: string;
  apNo?: string | null;
  apvDate?: string | null;
  invoiceNo?: string | null;
  supplierName?: string | null;
  status?: string | null;
  netAmount?: number | null;
  lineCount?: number | null;
}

interface ProjectPayableItem {
  detailId: string;
  transactionTypeDescription?: string | null;
  amount?: number | null;
  discAmount?: number | null;
  vatAmount?: number | null;
  ewtAmount?: number | null;
  netAmount?: number | null;
  refNo?: string | null;
  remarksNotes?: string | null;
}

interface ProjectPayableBreakdownQuery {
  list: ProjectPayableBreakdown[];
}

interface ProjectPayableItemsQuery {
  list: ProjectPayableItem[];
}

interface IProps {
  projectId?: string;
  dataSource: ProjectExpenseRow[];
  loading: boolean;
}

export default function ProjectExpenseTable({
  projectId,
  dataSource,
  loading,
}: IProps) {
  const { message } = App.useApp();
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
  const [expandedPayableKeys, setExpandedPayableKeys] = useState<Key[]>([]);
  const [breakdownByKey, setBreakdownByKey] = useState<
    Record<string, ProjectPayableBreakdown[]>
  >({});
  const [itemsByPayableKey, setItemsByPayableKey] = useState<
    Record<string, ProjectPayableItem[]>
  >({});
  const [loadingKeys, setLoadingKeys] = useState<Record<string, boolean>>({});
  const [loadingItemKeys, setLoadingItemKeys] = useState<
    Record<string, boolean>
  >({});
  const [loadBreakdown] = useLazyQuery<ProjectPayableBreakdownQuery>(
    GET_PROJECT_PAYABLE_BREAKDOWN
  );
  const [loadPayableItems] = useLazyQuery<ProjectPayableItemsQuery>(
    GET_PROJECT_PAYABLE_ITEMS
  );

  const getRowKey = (record: ProjectExpenseRow) =>
    `${record.sourceType ?? "source"}-${record.project?.id ?? projectId ?? "project"}-${
      record.transactionType?.id ?? "transaction-type"
    }`;

  const getPayableRowKey = (
    record: ProjectPayableBreakdown,
    breakdownProjectId?: string | null,
    transactionTypeId?: string | null
  ) =>
    `${breakdownProjectId ?? "project"}-${
      transactionTypeId ?? "transaction-type"
    }-${record.payableId}`;

  const payableColumns: ColumnsType<ProjectPayableBreakdown> = [
    {
      title: "A/P No.",
      dataIndex: "apNo",
      key: "apNo",
      width: 130,
    },
    {
      title: "A/P Date",
      dataIndex: "apvDate",
      key: "apvDate",
      width: 120,
      render: (date) => (date ? DateFormatter(date) : "--"),
    },
    {
      title: "Supplier",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "Invoice No.",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
      width: 140,
    },
    {
      title: "Project Amount",
      dataIndex: "netAmount",
      key: "netAmount",
      width: 120,
      align: "right",
      render: (amount) => NumberFormater(amount ?? 0),
    },
    {
      title: "Lines",
      dataIndex: "lineCount",
      key: "lineCount",
      width: 80,
      align: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render: (status) => <Tag color="green">{status ?? "POSTED"}</Tag>,
    },
  ];

  const payableItemColumns: ColumnsType<ProjectPayableItem> = [
    {
      title: "Transaction Type",
      dataIndex: "transactionTypeDescription",
      key: "transactionTypeDescription",
      width: 170,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 115,
      align: "right",
      render: (amount) => NumberFormater(amount ?? 0),
    },
    {
      title: "Discount",
      dataIndex: "discAmount",
      key: "discAmount",
      width: 115,
      align: "right",
      render: (amount) => NumberFormater(amount ?? 0),
    },
    {
      title: "VAT",
      dataIndex: "vatAmount",
      key: "vatAmount",
      width: 115,
      align: "right",
      render: (amount) => NumberFormater(amount ?? 0),
    },
    {
      title: "EWT",
      dataIndex: "ewtAmount",
      key: "ewtAmount",
      width: 115,
      align: "right",
      render: (amount) => NumberFormater(amount ?? 0),
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
      width: 125,
      align: "right",
      render: (amount) => NumberFormater(amount ?? 0),
    },
    {
      title: "Reference No.",
      dataIndex: "refNo",
      key: "refNo",
      width: 140,
    },
    {
      title: "Remarks",
      dataIndex: "remarksNotes",
      key: "remarksNotes",
    },
  ];

  const columns: ColumnsType<ProjectExpenseRow> = [
    {
      title: "Transaction Type",
      dataIndex: "transTypeDescription",
      key: "transTypeDescription",
      width: 180,
    },
    {
      title: "Amount",
      dataIndex: "totalNetAmount",
      key: "totalNetAmount",
      width: 120,
      align: "right",
      render: (cost) => NumberFormater(cost ?? 0),
    },
    {
      title: "Source",
      dataIndex: "sourceType",
      key: "sourceType",
      width: 130,
      render: (sourceType) =>
        sourceType === "PETTY_CASH" ? "Petty Cash Voucher" : "A/P Payable",
    },
    {
      title: "Documents",
      key: "documentCount",
      width: 120,
      align: "right",
      render: (_, record) =>
        record.sourceType === "PETTY_CASH"
          ? record.pettyCashCount ?? 0
          : record.payableCount ?? 0,
    },
  ];

  const handleExpand = async (expanded: boolean, record: ProjectExpenseRow) => {
    const rowKey = getRowKey(record);
    const breakdownProjectId = record.project?.id ?? projectId;

    setExpandedRowKeys((keys) =>
      expanded
        ? keys.includes(rowKey)
          ? keys
          : [...keys, rowKey]
        : keys.filter((key) => key !== rowKey)
    );

    if (
      !expanded ||
      breakdownByKey[rowKey] ||
      !breakdownProjectId ||
      !record.transactionType?.id
    ) {
      return;
    }

    setLoadingKeys((keys) => ({ ...keys, [rowKey]: true }));
    try {
      const result = await loadBreakdown({
        variables: {
          projectId: breakdownProjectId,
          transactionTypeId: record.transactionType.id,
        },
      });
      if (result.error) {
        throw result.error;
      }
      setBreakdownByKey((items) => ({
        ...items,
        [rowKey]: result.data?.list ?? [],
      }));
    } catch (error) {
      const details = error instanceof Error ? `: ${error.message}` : "";
      message.error(`Unable to load the payable breakdown${details}`);
    } finally {
      setLoadingKeys((keys) => ({ ...keys, [rowKey]: false }));
    }
  };

  const handlePayableExpand = async (
    expanded: boolean,
    record: ProjectPayableBreakdown,
    breakdownProjectId?: string | null,
    transactionTypeId?: string | null
  ) => {
    const payableRowKey = getPayableRowKey(
      record,
      breakdownProjectId,
      transactionTypeId
    );

    setExpandedPayableKeys((keys) =>
      expanded
        ? keys.includes(payableRowKey)
          ? keys
          : [...keys, payableRowKey]
        : keys.filter((key) => key !== payableRowKey)
    );

    if (
      !expanded ||
      itemsByPayableKey[payableRowKey] ||
      !breakdownProjectId ||
      !record.payableId
    ) {
      return;
    }

    setLoadingItemKeys((keys) => ({ ...keys, [payableRowKey]: true }));
    try {
      const result = await loadPayableItems({
        variables: {
          projectId: breakdownProjectId,
          payableId: record.payableId,
          transactionTypeId,
        },
      });
      if (result.error) {
        throw result.error;
      }
      setItemsByPayableKey((items) => ({
        ...items,
        [payableRowKey]: result.data?.list ?? [],
      }));
    } catch (error) {
      const details = error instanceof Error ? `: ${error.message}` : "";
      message.error(`Unable to load the payable items${details}`);
    } finally {
      setLoadingItemKeys((keys) => ({ ...keys, [payableRowKey]: false }));
    }
  };

  return (
    <Row>
      <Col span={24}>
        <Table
          rowKey={getRowKey}
          size="small"
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: 20,
            showSizeChanger: false,
          }}
          expandable={{
            expandedRowKeys,
            onExpand: handleExpand,
            rowExpandable: (record) =>
              Boolean(
                (record.project?.id ?? projectId) &&
                  record.transactionType?.id
              ) &&
              Number(record.payableCount ?? 0) > 0,
            expandedRowRender: (record) => {
              const rowKey = getRowKey(record);
              const breakdownProjectId = record.project?.id ?? projectId;
              const transactionTypeId = record.transactionType?.id;
              return (
                <div className="w-full px-5">
                  <p style={{ margin: "0 0 8px", fontWeight: "bold" }}>
                    Payable Breakdown (expand an A/P row to view its items)
                  </p>
                  <Table
                    rowKey={(payable) =>
                      getPayableRowKey(
                        payable,
                        breakdownProjectId,
                        transactionTypeId
                      )
                    }
                    size="small"
                    columns={payableColumns}
                    dataSource={breakdownByKey[rowKey] ?? []}
                    loading={loadingKeys[rowKey]}
                    pagination={false}
                    expandable={{
                      expandedRowKeys: expandedPayableKeys,
                      onExpand: (expanded, payable) =>
                        handlePayableExpand(
                          expanded,
                          payable,
                          breakdownProjectId,
                          transactionTypeId
                        ),
                      rowExpandable: (payable) =>
                        Boolean(breakdownProjectId && payable.payableId),
                      expandedRowRender: (payable) => {
                        const payableRowKey = getPayableRowKey(
                          payable,
                          breakdownProjectId,
                          transactionTypeId
                        );
                        return (
                          <Table
                            rowKey="detailId"
                            size="small"
                            columns={payableItemColumns}
                            dataSource={itemsByPayableKey[payableRowKey] ?? []}
                            loading={loadingItemKeys[payableRowKey]}
                            pagination={false}
                            locale={{
                              emptyText:
                                "No matching project items were found for this payable.",
                            }}
                          />
                        );
                      },
                    }}
                    locale={{
                      emptyText:
                        "No posted payable details are assigned to this transaction type.",
                    }}
                  />
                </div>
              );
            },
          }}
          loading={loading}
        />
      </Col>
    </Row>
  );
}
