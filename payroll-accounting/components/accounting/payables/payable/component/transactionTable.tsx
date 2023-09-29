import React, { useState } from "react";
import { AccountsPayableDetails, Supplier } from "@/graphql/gql/graphql";
import { useDialog } from "@/hooks";
import { currency } from "@/utility/constant";
import { NumberFormater } from "@/utility/helper";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import APDetailsModal from "../../dialogs/apDetailsModal";
import _ from "lodash";
import {
  ExtendedAPTransactionDto,
  IFormAPTransactionDetailsBulk,
} from "@/interface/payables/formInterfaces";
import APDetailsTransactionSummaryFooter from "../../common/apDetailsSummary";
import APDetailsBulkModal from "../../dialogs/apDetailsBulkModal";

interface IProps {
  loading?: boolean;
  supplier?: Supplier;
  status?: boolean;
  isVoided?: boolean;
  dataSource: AccountsPayableDetails[];
  onRemoveDetails: (id: string, i: boolean) => void;
  onAddDetails: (e: ExtendedAPTransactionDto) => void;
  onBulkUpdates: (e: IFormAPTransactionDetailsBulk) => void;
  getVatRate: () => number;
}

export default function APTransactionDetailsTable(props: IProps) {
  const {
    loading,
    dataSource,
    status,
    onRemoveDetails,
    onAddDetails,
    onBulkUpdates,
    getVatRate,
    supplier,
    isVoided,
  } = props;

  const [size, setSize] = useState(5);
  // ===================== modal ====================================
  const showTransaction = useDialog(APDetailsModal);
  const transactionBulk = useDialog(APDetailsBulkModal);
  // ======================== functions ===============================
  const onShowTransaction = (e?: AccountsPayableDetails) => {
    let payload = _.clone(e ?? {}) as ExtendedAPTransactionDto;
    payload.vatRate = getVatRate();
    showTransaction({ record: payload, supplier: supplier }, (e: any) => {
      if (e?.id) {
        let result = e as ExtendedAPTransactionDto;
        onAddDetails(result);
      }
    });
  };

  const onRemove = (e?: AccountsPayableDetails) => {
    let payload = _.clone(e ?? {}) as ExtendedAPTransactionDto;
    if (payload?.id) {
      // useConfirm("Click Yes if you want to proceed", () => {
      //   onRemoveDetails(payload?.id, payload.isNew ?? false);
      // });
    }
  };

  const onUpdateMany = () => {
    transactionBulk(
      { vatRate: getVatRate(), supplier: supplier },
      (e: IFormAPTransactionDetailsBulk) => {
        if (e) {
          onBulkUpdates(e);
        }
      }
    );
  };

  // ======================== columns ================================
  const columns: ColumnsType<AccountsPayableDetails> = [
    {
      title: "Transaction Type",
      dataIndex: "transType.description",
      key: "transType.description",
      width: 150,
      render: (_, record) => <span>{record?.transType?.description}</span>,
    },
    {
      title: "Office",
      dataIndex: "department.departmentName",
      key: "department.departmentName",
      width: 200,
      render: (_, record) => <span>{record?.office?.officeDescription}</span>,
    },
    {
      title: "Project",
      dataIndex: "project.description",
      key: "project.description",
      width: 200,
      render: (_, record) => <span>{record?.project?.description}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
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
      title: "Discount Rate",
      dataIndex: "discRate",
      key: "discRate",
      width: 130,
      align: "center",
      render: (amount) => <span>{amount}</span>,
    },
    {
      title: "Discount Amount",
      dataIndex: "discAmount",
      key: "discAmount",
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
      title: "Vat Inclusive?",
      dataIndex: "vatInclusive",
      key: "vatInclusive",
      width: 110,
      align: "center",
      render: (status) => {
        let text = status ? "Yes" : "No";
        let color = status ? "green" : "red";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Ref. No",
      dataIndex: "refNo",
      key: "refNo",
      width: 200,
    },
    {
      title: "Remarks",
      dataIndex: "remarksNotes",
      key: "remarksNotes",
      width: 400,
    },
    {
      title: "Tax Description",
      dataIndex: "taxDesc",
      key: "taxDesc",
      width: 120,
    },
    {
      title: "Vat Amount",
      dataIndex: "vatAmount",
      key: "vatAmount",
      align: "right",
      width: 130,
      fixed: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "Ewt Rate",
      dataIndex: "ewtRate",
      key: "ewtRate",
      align: "right",
      width: 130,
      fixed: "right",
      render: (amount) => <span>{NumberFormater(amount)}</span>,
    },
    {
      title: "Ewt Amount",
      dataIndex: "ewtAmount",
      key: "ewtAmount",
      align: "right",
      width: 130,
      fixed: "right",
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
      width: 130,
      fixed: "right",
      render: (amount) => (
        <span>
          <small>{currency} </small>
          {NumberFormater(amount)}
        </span>
      ),
    },
    {
      title: "#",
      dataIndex: "action",
      key: "action",
      width: 90,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => onShowTransaction(record)}
            disabled={status}
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            disabled={isVoided ? false : status}
            onClick={() => onRemove(record)}
          />
        </Space>
      ),
    },
  ];
  // ======================== ends ===================================

  return (
    <div className="w-full">
      <div className="w-full dev-right mb-2-5">
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={status}
            onClick={() => onShowTransaction()}>
            Add Transaction
          </Button>
          <Button
            type="dashed"
            danger
            icon={<EditOutlined />}
            onClick={() => onUpdateMany()}
            disabled={status}>
            Bulk Changes
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        size="small"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        scroll={{ x: 2600 }}
        pagination={{
          pageSize: size,
          onShowSizeChange: (_, size) => {
            setSize(size);
          },
        }}
        summary={() => (
          <APDetailsTransactionSummaryFooter dataSource={dataSource} />
        )}
      />
    </div>
  );
}
