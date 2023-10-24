import React, { useState, useEffect } from "react";
import {
  DisbursementAp,
  Mutation,
  Query,
  Supplier,
} from "@/graphql/gql/graphql";
import { IDisbursementApplication } from "@/interface/payables/formInterfaces";
import { confirmDelete, useDialog } from "@/hooks";
import { currency } from "@/utility/constant";
import { DateFormatter, NumberFormater } from "@/utility/helper";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag, App } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  GET_DISBURSEMENT_AP_APPLICATION,
  REMOVE_DISBURSEMENT_AP,
} from "@/graphql/payables/disbursement-queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import DisbursementAPSummaryFooter from "../../common/disbursementAPSumarry";
import AccountsPayableListSelectorModal from "../../dialogs/apListModal";
import EditAccountPayableApplicationModal from "../../dialogs/editApplicationModal";
import update from "immutability-helper";
import _ from "lodash";

interface IProps {
  parentId?: string | undefined | null;
  dataSource?: IDisbursementApplication[];
  status?: boolean;
  supplier?: Supplier;
  isVoided?: boolean;
  disabledBtn: boolean;
  calculateAmount: (e: any) => void;
  setApplication: React.Dispatch<
    React.SetStateAction<IDisbursementApplication[]>
  >;
}

export default function ApplicationAPTable(props: IProps) {
  const { message } = App.useApp();
  const {
    dataSource,
    status,
    parentId,
    supplier,
    disabledBtn,
    setApplication,
    calculateAmount,
    isVoided,
  } = props;
  const [size, setSize] = useState<number>(5);
  // ======================== Modals ================================
  const showSelectAP = useDialog(AccountsPayableListSelectorModal);
  const editSelectedAP = useDialog(EditAccountPayableApplicationModal);
  // ======================== Queries ================================
  const [getRecords, { loading }] = useLazyQuery<Query>(
    GET_DISBURSEMENT_AP_APPLICATION,
    {
      onCompleted: (data) => {
        let result = data?.apAppByDis as IDisbursementApplication[];
        let payload = _.clone(dataSource);
        if (_.isEmpty(payload)) {
          setApplication(result);
          let payloadAmount = {
            discount: _.sumBy(result, "discount"),
            ewtAmount: _.sumBy(result, "ewtAmount"),
            appliedAmount: _.sumBy(result, "appliedAmount"),
          };
          calculateAmount(payloadAmount);
        } else {
          let filterNew = _.filter(payload, ["isNew", true]);
          let dataOld = _.filter(payload, (e) => !e.isNew);
          let dataFinal = mappedDataPayload(dataOld, result);

          let concatArray = _.concat(dataFinal, filterNew);
          let payloadAmount = {
            discount: _.sumBy(concatArray, "discount"),
            ewtAmount: _.sumBy(concatArray, "ewtAmount"),
            appliedAmount: _.sumBy(concatArray, "appliedAmount"),
          };
          calculateAmount(payloadAmount);
          setApplication(concatArray);
        }
      },
    }
  );
  const [removeRecord] = useMutation<Mutation>(REMOVE_DISBURSEMENT_AP, {
    ignoreResults: false,
    onCompleted: (data) => {
      let result = data.removeApApp as DisbursementAp;
      if (!_.isEmpty(result?.id)) {
        message.success("Successfully removed.");
        getRecords({
          variables: {
            id: parentId,
          },
        });
      }
    },
  });
  //========================= functions ==============================
  const mappedDataPayload = (
    oldPayload: IDisbursementApplication[],
    resultPayload: IDisbursementApplication[]
  ): IDisbursementApplication[] => {
    let tobeDisplay = [] as IDisbursementApplication[];
    if (_.isEmpty(resultPayload)) {
      tobeDisplay = resultPayload;
    } else {
      if (!_.isEmpty(oldPayload)) {
        tobeDisplay = _.filter(oldPayload, (e) => {
          let record = _.find(resultPayload, { id: e.id });
          return !_.isEmpty(record);
        });
      }
    }
    return tobeDisplay;
  };
  const showModal = () => {
    showSelectAP(
      { supplier: supplier, payload: dataSource },
      (result: IDisbursementApplication[]) => {
        if (!_.isEmpty(result)) {
          let payloadAmount = {
            discount: _.sumBy(result, "discount"),
            ewtAmount: _.sumBy(result, "ewtAmount"),
            appliedAmount: _.sumBy(result, "appliedAmount"),
          };
          calculateAmount(payloadAmount);
          setApplication(result);
        }
      }
    );
  };

  const showEditModal = (record?: IDisbursementApplication) => {
    editSelectedAP(
      { record: record, supplier: supplier },
      (result: IDisbursementApplication) => {
        let payload = _.clone(dataSource) as IDisbursementApplication[];
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
          id: record.id,
          parent: record?.payable?.id,
        },
      });
    }
  };
  // ======================== columns ================================
  const columns: ColumnsType<IDisbursementApplication> = [
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
            disabled={isVoided ? false : status}
            onClick={() => onConfirmRemove(record)}
          />
        </Space>
      ),
    },
  ];
  // ======================== ends ===================================
  useEffect(() => {
    if (parentId) {
      getRecords({
        variables: {
          id: parentId,
        },
      });
    }
  }, [parentId]);

  return (
    <div className="w-full">
      <div className="w-full dev-right mb-2-5">
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={status || disabledBtn}
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
        summary={() => <DisbursementAPSummaryFooter dataSource={dataSource} />}
      />
    </div>
  );
}
