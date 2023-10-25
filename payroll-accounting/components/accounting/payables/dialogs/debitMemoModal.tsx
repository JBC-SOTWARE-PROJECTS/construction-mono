import React, { useState, useMemo } from "react";
import { DebitMemo, Mutation, Query, Supplier } from "@/graphql/gql/graphql";
import {
  IDisbursementApplication,
  IDebitMemoDetails,
} from "@/interface/payables/formInterfaces";
import {
  AuditOutlined,
  CarryOutOutlined,
  FileTextOutlined,
  IssuesCloseOutlined,
  RedoOutlined,
  SaveOutlined,
  ScheduleOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Form,
  Row,
  Space,
  Tabs,
  Tag,
  App,
  Table,
} from "antd";
import type { DescriptionsProps } from "antd";
import _ from "lodash";
import FullScreenModal from "@/components/common/fullScreenModal/fullScreenModal";
import {
  APCAT_DIS,
  RPTOTALS,
  responsiveColumn3,
  responsiveColumn3Last,
} from "@/utility/constant";
import { FormDatePicker, FormSelect, FormTextArea } from "@/components/common";
import { NumberFormater, decimalRound2, requiredField } from "@/utility/helper";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import { useAPTransactionType, useBanks } from "@/hooks/payables";
import { useConfirmationPasswordHook, useDialog } from "@/hooks";
import ViewJournalEntries from "../journalentries/viewJournalEntries";
import { TabsProps } from "antd/lib";
import {
  GET_DEBIT_MEMO_TRANSACTIONS,
  UPDATE_DEBITMEMO_STATUS,
  UPSERT_DEBITMEMO_RECORD,
} from "@/graphql/payables/debit-memo-queries";
import DMJournalEntries from "../journalentries/dmJournalEntries";
import DebitMemoSummaryFooter from "../common/debitMemoSummary";
import APDebitMemoApplicationsTable from "../disbursement/component/apDebitMemoApplication";
import DebitMemoTransactionTable from "../disbursement/component/debitMemoTransactionTable";

interface IProps {
  hide: (hideProps: any) => void;
  type: string;
  supplier?: Supplier;
  record?: DebitMemo;
}

interface IPayloadValues {
  discount: number;
  ewtAmount: number;
  appliedAmount: number;
  netAmount: number;
}

export default function DebitMemoModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, supplier, record, type } = props;
  const [parentForm] = Form.useForm();
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  const [action, setAction] = useState<string | null>(null);
  const [state, setState] = useState<any>({
    discount: record?.discount ? record?.discount : 0,
    ewtAmount: record?.ewtAmount ? record?.ewtAmount : 0,
    memoAmount: record?.memoAmount ? record?.memoAmount : 0,
    appliedAmount: record?.appliedAmount ? record?.appliedAmount : 0,
  });
  const [application, setApplication] = useState<IDisbursementApplication[]>(
    []
  );
  const [expense, setExpense] = useState<IDebitMemoDetails[]>([]);
  const [saveCloseLoading, setSaveCloseLoading] = useState(false);
  const [category, setCategory] = useState<string>(
    record?.debitCategory ?? "PAYABLE"
  );
  // ======================= Modal ===============================
  const journalEntries = useDialog(DMJournalEntries);
  const viewEntries = useDialog(ViewJournalEntries);
  // ===================== Queries ==============================
  const transactionList = useAPTransactionType({
    type: supplier?.supplierTypes?.id,
    category: type === "DEBIT_MEMO" ? "DM" : "DA",
  });
  const banks = useBanks();

  const { loading, refetch } = useQuery<Query>(GET_DEBIT_MEMO_TRANSACTIONS, {
    variables: {
      id: record?.id,
    },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      let ap = data?.apDebitMemo as IDisbursementApplication[];
      let dm = data?.dmDetials as IDebitMemoDetails[];
      if (record?.id) {
        if (type === "DEBIT_MEMO") {
          // =================== application =================
          setApplication(ap);
          let payloadAmount = {
            discount: _.sumBy(ap, "discount"),
            ewtAmount: _.sumBy(ap, "ewtAmount"),
            appliedAmount: _.sumBy(ap, "appliedAmount"),
            netAmount: _.sumBy(ap, "netAmount"),
          };
          calculateApplicationAmount(payloadAmount);
          //=================== expense =================
          setExpense(dm);
          let sumAmount: number = _.sumBy(dm, "amount");
          calculateAmount(sumAmount);
        } else if (type === "DEBIT_ADVICE") {
          if (category === "PAYABLE") {
            // =================== application =================
            setApplication(_.isEmpty(ap) ? [] : ap);
            let payloadAmount = {
              discount: _.sumBy(ap, "discount"),
              ewtAmount: _.sumBy(ap, "ewtAmount"),
              appliedAmount: _.sumBy(ap, "appliedAmount"),
              netAmount: _.sumBy(ap, "netAmount"),
            };
            calculateApplicationAmount(payloadAmount);
          } else if (category === "EXPENSE") {
            //=================== expense =================
            setExpense(_.isEmpty(dm) ? [] : dm);
            let sumAmount: number = _.sumBy(dm, "amount");
            calculateAmount(sumAmount);
          }
        }
      }
    },
  });

  const [upsertRecord] = useMutation<Mutation>(UPSERT_DEBITMEMO_RECORD, {
    ignoreResults: false,
  });

  const [updateRecord, { loading: updateLoading }] = useMutation<Mutation>(
    UPDATE_DEBITMEMO_STATUS,
    {
      ignoreResults: false,
    }
  );

  //================== functions ====================
  const onRefetchData = () => {
    refetch();
  };

  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: DebitMemo) => {
    const payload = _.clone(values);
    payload.supplier = supplier;
    payload.transType = null;
    payload.bank = null;
    if (values.transType) {
      payload.transType = { id: values.transType };
    }
    if (values.bank) {
      payload.bank = { id: values.bank };
    }
    payload.debitType = type;
    payload.discount = state.discount;
    payload.ewtAmount = state.ewtAmount;
    payload.memoAmount = state.memoAmount;
    payload.appliedAmount = state.appliedAmount;

    let msg = "Debit Advice";
    if (type === "DEBIT_MEMO") {
      msg = "Debit Memo";
    }
    // ==================== validations ===============================
    showPasswordConfirmation(() => {
      if (action === "save_close") {
        setSaveCloseLoading(true);
      }
      upsertRecord({
        variables: {
          id: record?.id,
          fields: payload,
          items: application,
          details: expense,
        },
        onCompleted: (data) => {
          const result = data.upsertDebitMemo as DebitMemo;
          setSaveCloseLoading(false);
          if (result?.id) {
            if (action === "save_close") {
              if (record?.id) {
                hide({
                  success: true,
                  message: `${msg} successfully saved.`,
                });
              } else {
                hide({
                  success: true,
                  message: `${msg} successfully updated.`,
                });
              }
            } else if (action === "save_post") {
              const postPayload = {
                id: record?.id,
                status: true,
                refNo: record?.debitNo,
                supplierName: supplier?.supplierFullname,
                refDate: dayjs(record?.debitDate).format("YYYY"),
                type: supplier?.supplierTypes?.id,
                particulars: payload?.remarksNotes,
                mode: type === "DEBIT_MEMO" ? "DM" : "DA",
              };
              journalEntries(postPayload, (e: any) => {
                if (e) {
                  hide({
                    success: true,
                    message: `${msg} successfully posted.`,
                  });
                } else {
                  hide(false);
                }
              });
            }
          } else {
            message.error("Something went wrong. Cannot process request");
          }
        },
        onError: (error, clientOptions) => {
          setSaveCloseLoading(false);
          message.error("Something went wrong. Cannot process request");
          console.error("Error => ", error);
          console.log("clientOptions => ", clientOptions);
        },
      });
    });
    //reset actions
    setAction(null);
  };

  const onViewJournalEntries = () => {
    viewEntries({ id: record?.postedLedger }, () => {});
  };

  const onVoidTransaction = () => {
    let msg = "Debit Advice";
    if (type === "DEBIT_MEMO") {
      msg = "Debit Memo";
    }
    showPasswordConfirmation(() => {
      journalEntries({ id: record?.id, status: false }, (e: any) => {
        if (e) {
          hide({
            success: true,
            message: `${msg} successfully voided.`,
          });
        }
      });
    });
  };

  const onUpdateStatus = () => {
    let msg = "Debit Advice";
    if (type === "DEBIT_MEMO") {
      msg = "Debit Memo";
    }
    showPasswordConfirmation(() => {
      updateRecord({
        variables: {
          id: record?.id,
          status: "DRAFT",
        },
        onCompleted: (data) => {
          let result = data?.updateDmStatus as DebitMemo;
          if (result?.id) {
            hide({
              success: true,
              message: `${msg} updated to draft.`,
            });
          }
        },
      });
    });
  };

  const calculateAmount = (value: number) => {
    if (category === "EXPENSE") {
      setState((prev: any) => ({
        ...prev,
        appliedAmount: decimalRound2(value),
        memoAmount: decimalRound2(value),
      }));
    } else if (category === "PAYABLE") {
      setState((prev: any) => ({
        ...prev,
        memoAmount: decimalRound2(value),
      }));
    }
  };

  const calculateApplicationAmount = (payload: IPayloadValues) => {
    if (type === "DEBIT_MEMO") {
      setState((prev: any) => ({
        ...prev,
        appliedAmount: decimalRound2(payload.appliedAmount),
      }));
    } else if (type === "DEBIT_ADVICE") {
      setState((prev: any) => ({
        ...prev,
        discount: decimalRound2(payload.discount),
        ewtAmount: decimalRound2(payload.ewtAmount),
        appliedAmount: decimalRound2(payload.appliedAmount),
        memoAmount: decimalRound2(payload.netAmount),
      }));
    }
  };

  const onChangePaymentCategory = (e: string) => {
    setCategory(e);
    if (e === "EXPENSE") {
      let payloadAmount = {
        discount: 0,
        ewtAmount: 0,
        appliedAmount: 0,
        netAmount: 0,
      };
      setApplication([]);
      calculateApplicationAmount(payloadAmount);
    } else if (e === "PAYABLE") {
      let sumAmount: number = 0;
      setExpense([]);
      calculateAmount(sumAmount);
    }
  };

  // ================ column tabs descriptions ================================
  const columns: ColumnsType<any> = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      align: "right",
      width: 130,
      render: (amount, record) => {
        let color = "text-green";
        if (record.id === "vatAmount") {
          color = "text-gray";
        }
        if (amount !== null) {
          return <span className={color}>{NumberFormater(amount)}</span>;
        } else {
          return <span>--</span>;
        }
      },
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      align: "right",
      width: 130,
      render: (amount) => {
        if (amount !== null) {
          return <span className="text-red">{NumberFormater(amount)}</span>;
        } else {
          return <span>--</span>;
        }
      },
    },
  ];

  const descriptions: DescriptionsProps["items"] = useMemo(() => {
    return [
      {
        key: "1",
        label: "Supplier Name",
        children: <Tag color="cyan">{supplier?.supplierFullname ?? "--"}</Tag>,
      },
      {
        key: "2",
        label: "Contact Person",
        children: <p>{supplier?.primaryContactPerson ?? "--"}</p>,
      },
      {
        key: "3",
        label: "Email Address",
        children: <p>{supplier?.supplierEmail ?? "--"}</p>,
      },
      {
        key: "4",
        label: "Supplier Types",
        children: <p>{supplier?.supplierTypes?.supplierTypeDesc ?? "--"}</p>,
      },
    ];
  }, [supplier]);

  // ========================== end =============================
  // ========================== useEffects and Others ======================
  const totals = useMemo(() => {
    let result = RPTOTALS;
    result = RPTOTALS.map((obj) => {
      let amount = state[obj.id];
      // returns
      if (obj.debit !== null) {
        return {
          ...obj,
          debit: amount,
        };
      } else {
        return {
          ...obj,
          credit: amount,
        };
      }
    });
    return result;
  }, [record, state, application, expense]);

  const disabled = useMemo(() => {
    if (record?.posted) {
      return true;
    } else if (record?.status === "VOIDED") {
      return true;
    } else {
      return false;
    }
  }, [record]);

  const disabledButton = useMemo(() => {
    if (type === "DEBIT_MEMO") {
      return record?.posted || _.isEmpty(application) || _.isEmpty(expense);
    } else {
      if (category === "PAYABLE") {
        return record?.posted || _.isEmpty(application);
      } else {
        return record?.posted || _.isEmpty(expense);
      }
    }
  }, [record, application, expense, type, category]);

  const summaryMemoAmount = useMemo(() => {
    if (type === "DEBIT_MEMO") {
      return decimalRound2(state.memoAmount) as number;
    } else {
      return decimalRound2(
        state.memoAmount + state.ewtAmount + state.discount
      ) as number;
    }
  }, [state, type]);

  const TABS = useMemo(() => {
    let localTabs: TabsProps["items"] = [];
    let statusExpense: boolean = disabled;
    if (category === "PAYABLE") {
      statusExpense = disabled || _.isEmpty(application);
    }

    if (category === "PAYABLE") {
      localTabs.push({
        label: (
          <span>
            <AuditOutlined />
            Accounts Payable Application
          </span>
        ),
        key: "1_application",
        children: (
          <APDebitMemoApplicationsTable
            supplier={supplier}
            status={disabled || !_.isEmpty(expense)}
            dataSource={application}
            loading={loading}
            isVoided={record?.status === "VOIDED"}
            type={type === "DEBIT_MEMO" ? "DM" : "DA"}
            calculateAmount={(e: IPayloadValues) =>
              calculateApplicationAmount(e)
            }
            setApplication={setApplication}
            onRefetchData={onRefetchData}
          />
        ),
      });
    }

    if (type === "DEBIT_MEMO" || category === "EXPENSE") {
      localTabs.push({
        label: (
          <span>
            <TransactionOutlined />
            Transactions
          </span>
        ),
        key: "2_expense_transaction",
        children: (
          <DebitMemoTransactionTable
            type={type}
            loading={loading}
            isVoided={record?.status === "VOIDED"}
            calculateAmount={(e: number) => calculateAmount(e)}
            status={statusExpense}
            parentId={record?.id}
            appliedAmount={state.appliedAmount ?? 0}
            dataSource={expense}
            setExpense={setExpense}
            onRefetchData={onRefetchData}
          />
        ),
      });
    }

    return _.sortBy(localTabs, ["key"]);
  }, [state, application, expense, disabled, loading, type, category]);

  // ============================= UI =======================================

  return (
    <FullScreenModal
      hide={hide}
      allowFullScreen={true}
      icon={<ScheduleOutlined />}
      title={`Debit ${type === "DEBIT_MEMO" ? "Memo" : "Advice"} Details`}
      extraTitle={record?.debitNo}
      footer={
        <div className="w-full dev-between">
          <Space>
            {record?.posted ? (
              <Button
                type="dashed"
                size="large"
                onClick={onViewJournalEntries}
                icon={<FileTextOutlined />}>
                View Journal Entries
              </Button>
            ) : null}
          </Space>
          {record?.posted ? (
            <Button
              type="primary"
              danger
              size="large"
              onClick={onVoidTransaction}
              icon={<IssuesCloseOutlined />}>
              Void Transaction
            </Button>
          ) : (
            <div className="w-full">
              {record?.status === "VOIDED" ? (
                <Button
                  type="dashed"
                  danger
                  size="large"
                  loading={updateLoading}
                  onClick={onUpdateStatus}
                  icon={<RedoOutlined />}>
                  Draft Transaction
                </Button>
              ) : (
                <Space>
                  {record?.id ? (
                    <Button
                      type="dashed"
                      danger
                      size="large"
                      htmlType="submit"
                      form="upsertForm"
                      onClick={() => setAction("save_post")}
                      icon={<CarryOutOutlined />}
                      disabled={disabledButton}>
                      Save Changes & Post
                    </Button>
                  ) : null}
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    form="upsertForm"
                    onClick={() => setAction("save_close")}
                    loading={saveCloseLoading}
                    icon={<SaveOutlined />}
                    disabled={disabledButton}>
                    {`Save ${record?.id ? "Changes" : ""} & Close`}
                  </Button>
                </Space>
              )}
            </div>
          )}
        </div>
      }>
      <Form
        form={parentForm}
        name="upsertForm"
        layout="vertical"
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        disabled={disabled}
        initialValues={{
          debitDate: dayjs(record?.debitDate ?? new Date()),
          debitCategory: category,
          memoAmount: 0,
          bank: record?.bank?.id,
          transType: record?.transType?.id,
          remarksNotes: record?.remarksNotes,
        }}>
        <Row>
          <Col span={24}>
            <Descriptions
              className="supplier-info-descriptions"
              items={descriptions}
            />
          </Col>
        </Row>
        <Divider className="my-5" />
        <Row gutter={[16, 0]}>
          <Col {...responsiveColumn3}>
            <FormDatePicker
              label={`Debit ${type === "DEBIT_MEMO" ? "Memo" : "Advice"} Date`}
              name="debitDate"
              rules={requiredField}
              propsdatepicker={{
                allowClear: false,
              }}
            />
            <FormSelect
              label="Debit Memo Category"
              name="debitCategory"
              rules={requiredField}
              propsselect={{
                disabled: type === "DEBIT_MEMO" || disabled,
                options: APCAT_DIS,
                placeholder: "Select Memo Category",
                onChange: (e) => {
                  onChangePaymentCategory(e);
                },
              }}
            />
            <FormSelect
              label="Transaction Type"
              name="transType"
              propsselect={{
                options: transactionList,
                allowClear: true,
                placeholder: "Select Transaction Terms",
              }}
            />
          </Col>
          <Col {...responsiveColumn3}>
            {type === "DEBIT_ADVICE" && (
              <FormSelect
                label="Bank"
                name="bank"
                rules={requiredField}
                propsselect={{
                  options: banks,
                  allowClear: true,
                  placeholder: "Select Bank",
                }}
              />
            )}
            <FormTextArea
              label="Remarks/Notes (Particular)"
              name="remarksNotes"
              rules={requiredField}
              propstextarea={{
                rows: 6,
                placeholder: "Remarks/Notes",
              }}
            />
          </Col>
          <Col {...responsiveColumn3Last}>
            <Table
              rowKey="id"
              size="small"
              loading={false}
              columns={columns}
              pagination={false}
              dataSource={totals}
              summary={() => (
                <DebitMemoSummaryFooter
                  type={type}
                  memoAmount={summaryMemoAmount}
                  appliedAmount={decimalRound2(state.appliedAmount)}
                  balance={decimalRound2(
                    state.appliedAmount - state.memoAmount
                  )}
                />
              )}
            />
          </Col>
        </Row>
      </Form>
      {/*  */}
      <Divider plain>Transaction Details</Divider>
      <Row>
        <Col span={24}>
          <Tabs
            destroyInactiveTabPane
            defaultActiveKey="details"
            type="card"
            items={TABS}
          />
        </Col>
      </Row>
    </FullScreenModal>
  );
}
