import React, { useMemo, useState } from "react";
import { DisbursementAp, Mutation, Supplier } from "@/graphql/gql/graphql";
import { IDisbursementApplication } from "@/interface/payables/formInterfaces";
import { confirmDelete, useDialog } from "@/hooks";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag, App } from "antd";
import { ColumnsType } from "antd/es/table";
import { REMOVE_DM_AP_RECORD } from "@/graphql/payables/debit-memo-queries";
import { useMutation } from "@apollo/client";
import AccountsPayableListSelectorModal from "../../dialogs/apListModal";
import DebitMemoAPSummaryFooter from "../../common/debitMemoAPSumarry";
import EditAccountPayableApplicationModal from "../../dialogs/editApplicationModal";
import update from "immutability-helper";
import _ from "lodash";

interface IProps {
  parentId?: string | undefined | null;
  dataSource?: IDisbursementApplication[];
  status?: boolean;
  supplier?: Supplier;
  loading?: boolean;
  isVoided?: boolean;
  type: string;
  onRefetchData: () => void;
  calculateAmount: (e: any) => void;
  setApplication: React.Dispatch<
    React.SetStateAction<IDisbursementApplication[]>
  >;
}

export default function APDebitMemoApplicationsTable(props: IProps) {
  const { message } = App.useApp();
  const {
    dataSource,
    status,
    supplier,
    loading,
    type,
    setApplication,
    calculateAmount,
    onRefetchData,
    isVoided,
  } = props;
  const [size, setSize] = useState<number>(5);
  // ======================== Modals ================================
  const showSelectAP = useDialog(AccountsPayableListSelectorModal);
  const editSelectedAP = useDialog(EditAccountPayableApplicationModal);
  // ======================== Queries ================================
  const [removeRecord] = useMutation<Mutation>(REMOVE_DM_AP_RECORD, {
    ignoreResults: false,
    onCompleted: (data) => {
      let result = data.removeDMAPDetails as DisbursementAp;
      if (!_.isEmpty(result?.id)) {
        onRefetchData();
        message.success("Successfully removed.");
      }
    },
  });
  //========================= functions ==============================
  const showModal = () => {
    console.log("type", type);
    showSelectAP(
      {
        supplier: supplier,
        payload: dataSource,
        singleSelect: type === "DM" ? true : false,
        debitMemo: type === "DM",
      },
      (result: IDisbursementApplication[]) => {
        if (!_.isEmpty(result)) {
          let payloadAmount = {
            discount: _.sumBy(result, "discount"),
            ewtAmount: _.sumBy(result, "ewtAmount"),
            appliedAmount: _.sumBy(result, "appliedAmount"),
            netAmount: _.sumBy(result, "netAmount"),
          };
          calculateAmount(payloadAmount);
          setApplication(result);
        }
      }
    );
  };

  const showEditModal = (record: IDisbursementApplication) => {
    let payload = _.clone(dataSource) as IDisbursementApplication[];
    editSelectedAP(
      { record: record, supplier: supplier },
      (result: IDisbursementApplication) => {
        if (!_.isEmpty(result)) {
          let key = payload.findIndex((e) => e.id === result.id);
          if (key >= 0) {
            let updatedPayload = update(dataSource, {
              [key]: {
                appliedAmount: {
                  $set: result.appliedAmount,
                },
                vatRate: {
                  $set: result.vatRate,
                },
                vatInclusive: {
                  $set: result.vatInclusive,
                },
                vatAmount: {
                  $set: result.vatAmount,
                },
                ewtDesc: {
                  $set: result.ewtDesc,
                },
                ewtRate: {
                  $set: result.ewtRate,
                },
                ewtAmount: {
                  $set: result.ewtAmount,
                },
                grossAmount: {
                  $set: result.grossAmount,
                },
                discount: {
                  $set: result.discount,
                },
                netAmount: {
                  $set: result.netAmount,
                },
              },
            }) as IDisbursementApplication[];
            // ============ calculate ========================
            let payloadAmount = {
              discount: _.sumBy(updatedPayload, "discount"),
              ewtAmount: _.sumBy(updatedPayload, "ewtAmount"),
              appliedAmount: _.sumBy(updatedPayload, "appliedAmount"),
              netAmount: _.sumBy(updatedPayload, "netAmount"),
            };
            calculateAmount(payloadAmount);
            // ============ set updated value ================
            setApplication(updatedPayload);
          }
        }
      }
    );
  };

  const onConfirmRemove = (record: IDisbursementApplication) => {
    confirmDelete("Click Yes if you want to proceed", () => {
      onRemove(record);
    });
  };

  const onRemove = (record: IDisbursementApplication) => {
    let payload = _.clone(dataSource);
    if (record.isNew) {
      _.remove(payload || [], function (e) {
        return e.id === record?.id;
      });
      let payloadAmount = {
        discount: _.sumBy(payload, "discount"),
        ewtAmount: _.sumBy(payload, "ewtAmount"),
        appliedAmount: _.sumBy(payload, "appliedAmount"),
      };
      calculateAmount(payloadAmount);
      setApplication(payload ?? []);
    } else {
      //remove database then refecth
      removeRecord({
        variables: {
          id: record?.id,
          parent: record?.payable?.id,
          type: type,
        },
      });
    }
  };
  // ======================== columns ================================
  const columns: ColumnsType<IDisbursementApplication> = useMemo(() => {
    const da: ColumnsType<IDisbursementApplication> = [
      {
        title: "Balance",
        dataIndex: "payable.balance",
        key: "payable.balance",
        width: 130,
        align: "right",
        render: (_, record) => (
          <span>
            <small>{currency} </small>
            {NumberFormater(record?.payable?.balance)}
          </span>
        ),
      },
      {
        title: "Amount",
        dataIndex: "appliedAmount",
        key: "appliedAmount",
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
        title: "Vat Amount",
        dataIndex: "vatAmount",
        key: "vatAmount",
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
        title: "Tax Description",
        dataIndex: "ewtDesc",
        key: "ewtDesc",
        width: 120,
      },
      {
        title: "Ewt Rate",
        dataIndex: "ewtRate",
        key: "ewtRate",
        align: "right",
        width: 130,
        render: (amount) => <span>{NumberFormater(amount)}</span>,
      },

      {
        title: "Ewt Amount",
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
        title: "Gross Amount",
        dataIndex: "grossAmount",
        key: "grossAmount",
        width: 130,
        align: "right",
        fixed: "right",
        render: (amount) => (
          <span>
            <small>{currency} </small>
            {NumberFormater(amount)}
          </span>
        ),
      },
      {
        title: "Discount",
        dataIndex: "discount",
        key: "discount",
        width: 130,
        align: "right",
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
              onClick={() => showEditModal(record)}
              disabled={status}
            />
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={status}
              onClick={() => onConfirmRemove(record)}
            />
          </Space>
        ),
      },
    ];
    const dm: ColumnsType<IDisbursementApplication> = [
      {
        title: "Invoice #",
        dataIndex: "payable.apNo",
        key: "payable.apNo",
        width: 200,
        render: (_, record) => <span>{record?.payable?.invoiceNo}</span>,
      },
      {
        title: "Amount",
        dataIndex: "appliedAmount",
        key: "appliedAmount",
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
        title: "Paid Amount",
        dataIndex: "payable.appliedAmount",
        key: "payable.appliedAmount",
        width: 130,
        align: "right",
        render: (_, record) => (
          <span>
            <small>{currency} </small>
            {NumberFormater(record.payable?.appliedAmount ?? 0)}
          </span>
        ),
      },
      {
        title: "DM Amount",
        dataIndex: "debitAmount",
        key: "debitAmount",
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
        width: 50,
        align: "center",
        fixed: "right",
        render: (_, record) => (
          <Space>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={isVoided ? false : status}
              onClick={() => onConfirmRemove(record)}
            />
          </Space>
        ),
      },
    ];

    const col: ColumnsType<IDisbursementApplication> = [
      {
        title: "A/P Date",
        dataIndex: "payable.apvDate",
        key: "payable.apvDate",
        width: 100,
        render: (_, record) => (
          <span>{DateFormatter(record?.payable?.apvDate)}</span>
        ),
      },
      {
        title: "A/P #",
        dataIndex: "payable.apNo",
        key: "payable.apNo",
        width: 100,
        render: (_, record) => <span>{record?.payable?.apNo}</span>,
      },
    ];

    if (type === "DM") {
      return [...col, ...dm];
    } else if (type === "DA") {
      return [...col, ...da];
    } else {
      return col;
    }
  }, [type, dataSource]);
  // ======================== ends ===================================

  return (
    <div className="w-full">
      <div className="w-full dev-right mb-2-5">
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={status}
            onClick={() => showModal()}>
            Add Posted Accounts Payables (A/P)
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        size="small"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={{
          pageSize: size,
          onShowSizeChange: (_, size) => {
            setSize(size);
          },
        }}
        scroll={{ x: 1600 }}
        summary={() => (
          <DebitMemoAPSummaryFooter type={type} dataSource={dataSource} />
        )}
      />
    </div>
  );
}
