import React, { useState, useMemo } from "react";
import {
  Disbursement,
  DisbursementWtx,
  GraphQlRetVal_Boolean,
  Mutation,
  Supplier,
} from "@/graphql/gql/graphql";
import {
  ICheckDetails,
  IDisbursementApplication,
  IDisbursementExpense,
} from "@/interface/payables/formInterfaces";
import {
  AuditOutlined,
  CarryOutOutlined,
  FileSyncOutlined,
  FileTextOutlined,
  FundProjectionScreenOutlined,
  InsertRowBelowOutlined,
  IssuesCloseOutlined,
  RedoOutlined,
  SaveOutlined,
  ScheduleOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { useMutation } from "@apollo/client";
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
  DISTOTALS,
  DIS_TYPE,
  responsiveColumn2,
  responsiveColumn3,
  responsiveColumn3Last,
} from "@/utility/constant";
import {
  FormDatePicker,
  FormInput,
  FormInputNumber,
  FormSelect,
  FormTextArea,
} from "@/components/common";
import {
  NumberFormater,
  decimalRound2,
  requiredField,
  validateDisbursement,
} from "@/utility/helper";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import { useAPTransactionType } from "@/hooks/payables";
import { useConfirmationPasswordHook, useDialog } from "@/hooks";
import ViewJournalEntries from "../journalentries/viewJournalEntries";
import FormSwitch from "@/components/common/formSwitch/formSwitch";
import DisbursementSummaryFooter from "../common/disbursementSummary";
import { TabsProps } from "antd/lib";
import ChecksTable from "../disbursement/component/checksTable";
import ApplicationAPTable from "../disbursement/component/applicationsTable";
import {
  UPDATE_DISBURSEMENT_STATUS,
  UPSERT_DISBURSEMENT_RECORD,
  UPSERT_REAPPLICATION_RECORD,
} from "@/graphql/payables/disbursement-queries";
import DisbrusementExepnseTable from "../disbursement/component/expensesTable";
import DisbrusementWTXTable from "../disbursement/component/witholdingTaxTable";
import CKJournalEntries from "../journalentries/ckJournalEntries";

interface IProps {
  hide: (hideProps: any) => void;
  supplier?: Supplier;
  record?: Disbursement;
}

interface IPayloadValues {
  discount: number;
  ewtAmount: number;
  appliedAmount: number;
}

export default function DisbursementModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, supplier, record } = props;
  const [parentForm] = Form.useForm();
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  const [action, setAction] = useState<string | null>(null);
  const [state, setState] = useState<any>({
    cash: record?.cash ?? 0,
    check: record?.checks ?? 0,
    discount: record?.discountAmount ?? 0,
    ewtAmount: record?.ewtAmount ?? 0,
    disAmount: record?.voucherAmount ?? 0,
    appliedAmount: record?.appliedAmount ?? 0,
    balance: 0,
    isAdvance: record?.isAdvance ?? false,
    paymentCategory: record?.paymentCategory ?? "PAYABLE",
    type: record?.disType ?? "CHECK",
  });
  const [checks, setChecks] = useState<ICheckDetails[]>([]);
  const [application, setApplication] = useState<IDisbursementApplication[]>(
    []
  );
  const [expense, setExpense] = useState<IDisbursementExpense[]>([]);
  const [wtx, setWtx] = useState<DisbursementWtx[]>([]);

  const [saveCloseLoading, setSaveCloseLoading] = useState(false);
  // ======================= Modal ===============================
  const journalEntries = useDialog(CKJournalEntries);
  const viewEntries = useDialog(ViewJournalEntries);
  // ===================== Queries ==============================
  const transactionList = useAPTransactionType({
    type: supplier?.supplierTypes?.id,
    category: "DS",
  });
  const [upsertRecord] = useMutation<Mutation>(UPSERT_DISBURSEMENT_RECORD, {
    ignoreResults: false,
  });
  const [updateRecord, { loading: updateLoading }] = useMutation<Mutation>(
    UPDATE_DISBURSEMENT_STATUS,
    {
      ignoreResults: false,
    }
  );

  const [reapply, { loading: reapplicationLoading }] = useMutation<Mutation>(
    UPSERT_REAPPLICATION_RECORD,
    {
      ignoreResults: false,
    }
  );
  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: Disbursement) => {
    const payload = _.clone(values);
    payload.supplier = supplier;
    payload.transType = null;
    if (values.transType) {
      payload.transType = { id: values.transType };
    }

    payload.cash = state.cash;
    payload.checks = state.check;
    payload.discountAmount = state.discount;
    payload.ewtAmount = state.ewtAmount;
    payload.voucherAmount = state.disAmount;
    payload.appliedAmount = state.appliedAmount;
    // ==================== validations ===============================
    const error = validateDisbursement(
      payload,
      state.balance,
      checks,
      application,
      expense
    );
    if (!_.isEmpty(error)) {
      return message.error(error);
    }
    //=================== end validations =============================
    showPasswordConfirmation(() => {
      if (action === "save_close") {
        setSaveCloseLoading(true);
      }
      upsertRecord({
        variables: {
          fields: payload,
          checks: checks,
          ap: application,
          expense: expense,
          wtx: wtx,
          id: record?.id ?? null,
        },
        onCompleted: (data) => {
          const result = data.disbursementUpsert;
          setSaveCloseLoading(false);
          if (result?.id) {
            if (action === "save_close") {
              if (record?.id) {
                hide({
                  success: true,
                  message: "Disbursement Voucher successfully saved.",
                });
              } else {
                hide({
                  success: true,
                  message: "Disbursement Voucher successfully updated.",
                });
              }
            } else if (action === "save_post") {
              const postPayload = {
                id: record?.id,
                status: true,
                refNo: record?.disNo,
                supplierName: supplier?.supplierFullname,
                refDate: dayjs(record?.disDate).format("YYYY"),
                type: supplier?.supplierTypes?.id,
                particulars: payload?.remarksNotes,
              };
              journalEntries(postPayload, (e: any) => {
                if (e) {
                  hide({
                    success: true,
                    message: "Disbursement Voucher successfully posted.",
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
    showPasswordConfirmation(() => {
      journalEntries({ id: record?.id, status: false }, (e: any) => {
        if (e) {
          hide({
            success: true,
            message: "Disbursement Payable successfully voided.",
          });
        }
      });
    });
  };

  const onReapplication = () => {
    showPasswordConfirmation(() => {
      if (record?.id) {
        reapply({
          variables: {
            id: record?.id ?? null,
          },
          onCompleted: (data) => {
            let result = data?.reapplicationUpsert as GraphQlRetVal_Boolean;
            if (result.success) {
              hide(result);
            } else {
              message.error(
                result?.message ??
                  "Something went wrong. Cannot create reapplication"
              );
            }
          },
        });
      }
    });
  };

  const onUpdateStatus = () => {
    showPasswordConfirmation(() => {
      updateRecord({
        variables: {
          id: record?.id,
          status: "DRAFT",
        },
        onCompleted: (data) => {
          let result = data?.updateCKStatus as Disbursement;
          if (result?.id) {
            hide({
              success: true,
              message: "Disbursement Payable updated to draft.",
            });
          }
        },
      });
    });
  };

  const onChangePaymentCategory = (e: string) => {
    setState((prev: any) => ({
      ...prev,
      paymentCategory: e,
    }));
    if (e === "EXPENSE") {
      setFormValueByName("isAdvance", false);
      setApplication([]);
    } else if (e === "PAYABLE") {
      setExpense([]);
      setWtx([]);
    }
  };

  const setFormValueByName = (
    name: string,
    value: string | number | boolean
  ) => {
    const { setFieldValue } = parentForm;
    setFieldValue(name, value);
  };

  const calculateAmount = (value: number, type: string) => {
    if (type === "CASH") {
      let debit = _.sum([value, state.discount, state.ewtAmount]);
      setState({
        ...state,
        type: type,
        check: 0,
        cash: decimalRound2(value),
        disAmount: decimalRound2(debit),
        balance: decimalRound2(debit - state.appliedAmount),
      });
      setChecks([]);
    } else if (type === "CHECK") {
      let debit = _.sum([value, state.discount, state.ewtAmount]);
      setState({
        ...state,
        type: type,
        cash: 0,
        check: decimalRound2(value),
        disAmount: decimalRound2(debit),
        balance: decimalRound2(debit - state.appliedAmount),
      });
      setFormValueByName("cash", 0);
    } else if (type === "EXPENSE") {
      let debit = _.sum([
        state.cash,
        state.check,
        state.discount,
        state.ewtAmount,
      ]);
      let app = decimalRound2(value);
      setState({
        ...state,
        disAmount: decimalRound2(debit),
        appliedAmount: app,
        balance: decimalRound2(debit - app),
      });
    } else if (type === "WTX") {
      let debit = _.sum([state.cash, state.check, state.discount, value]);
      setState({
        ...state,
        ewtAmount: decimalRound2(value),
        disAmount: decimalRound2(debit),
        balance: decimalRound2(debit - state.appliedAmount),
      });
    }
  };

  const calculateApplicationAmount = (payload: IPayloadValues) => {
    let debit = _.sum([
      state.cash,
      state.check,
      payload.discount,
      payload.ewtAmount,
    ]);
    let app = decimalRound2(payload.appliedAmount);
    setState({
      ...state,
      discount: decimalRound2(payload.discount),
      ewtAmount: decimalRound2(payload.ewtAmount),
      disAmount: decimalRound2(debit),
      appliedAmount: app,
      balance: decimalRound2(debit - app),
    });
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
    {
      title: "Running Balance",
      dataIndex: "runningBalance",
      key: "runningBalance",
      align: "right",
      width: 150,
      render: (amount) => {
        return <span>{NumberFormater(amount)}</span>;
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
    let result = DISTOTALS;
    let runBalance = 0;
    result = DISTOTALS.map((obj) => {
      let amount = state[obj.id];
      // running balance
      let runningBalance = (runBalance += state[obj.id]);
      // end running balance
      // returns
      if (obj.debit !== null) {
        return {
          ...obj,
          debit: amount,
          runningBalance: runningBalance,
        };
      } else {
        return {
          ...obj,
          credit: amount,
          runningBalance: runningBalance,
        };
      }
    });
    return result;
  }, [record, state, checks, application, expense, wtx]);

  const disabled = useMemo(() => {
    if (record?.posted) {
      return true;
    } else if (record?.status === "VOIDED") {
      return true;
    } else {
      return false;
    }
  }, [record]);

  const showReapplication = useMemo(() => {
    let amount = record?.voucherAmount - record?.appliedAmount;
    let roundedAmount = decimalRound2(amount);
    if (roundedAmount != 0) {
      return true;
    } else {
      return false;
    }
  }, [record]);

  const TABS = useMemo(() => {
    let localTabs: TabsProps["items"] = [];
    if (state.paymentCategory === "PAYABLE") {
      localTabs.push({
        label: (
          <span>
            <AuditOutlined />
            Accounts Payable Application
          </span>
        ),
        key: "2_application",
        children: (
          <ApplicationAPTable
            supplier={supplier}
            status={disabled}
            disabledBtn={state.isAdvance}
            parentId={record?.id}
            dataSource={application}
            isVoided={record?.status === "VOIDED"}
            calculateAmount={(e: IPayloadValues) =>
              calculateApplicationAmount(e)
            }
            setApplication={setApplication}
          />
        ),
      });
      if (state.type === "CHECK") {
        localTabs.push({
          label: (
            <span>
              <InsertRowBelowOutlined />
              Check Details
            </span>
          ),
          key: "1_checks",
          children: (
            <ChecksTable
              calculateAmount={(e, a) => calculateAmount(e, a)}
              status={disabled}
              parentId={record?.id}
              dataSource={checks}
              setChecks={setChecks}
              isVoided={record?.status === "VOIDED"}
            />
          ),
        });
      }
    } else if (state.paymentCategory === "EXPENSE") {
      localTabs.push({
        label: (
          <span>
            <TransactionOutlined />
            Expense Transaction
          </span>
        ),
        key: "2_expense_transaction",
        children: (
          <DisbrusementExepnseTable
            calculateAmount={(e: number) => calculateAmount(e, "EXPENSE")}
            status={disabled}
            parentId={record?.id}
            dataSource={expense}
            setExpense={setExpense}
            isVoided={record?.status === "VOIDED"}
          />
        ),
      });
      localTabs.push({
        label: (
          <span>
            <FundProjectionScreenOutlined />
            Expanded Withholding Tax
          </span>
        ),
        key: "3_expanded_tax",
        children: (
          <DisbrusementWTXTable
            calculateAmount={(e: number) => calculateAmount(e, "WTX")}
            status={disabled}
            parentId={record?.id}
            dataSource={wtx}
            setWtx={setWtx}
            isVoided={record?.status === "VOIDED"}
          />
        ),
      });
      if (state.type === "CHECK") {
        localTabs.push({
          label: (
            <span>
              <InsertRowBelowOutlined />
              Check Details
            </span>
          ),
          key: "1_checks",
          children: (
            <ChecksTable
              calculateAmount={(e, a) => calculateAmount(e, a)}
              status={disabled}
              parentId={record?.id}
              dataSource={checks}
              setChecks={setChecks}
              isVoided={record?.status === "VOIDED"}
            />
          ),
        });
      }
    }
    return _.sortBy(localTabs, ["key"]);
  }, [state, checks, application, expense, wtx, disabled]);

  // ============================= UI =======================================

  return (
    <FullScreenModal
      hide={hide}
      allowFullScreen={true}
      icon={<ScheduleOutlined />}
      title="Disbursement Details"
      extraTitle={record?.disNo}
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
            <Space>
              {showReapplication && (
                <Button
                  type="primary"
                  size="large"
                  loading={reapplicationLoading}
                  onClick={onReapplication}
                  icon={<FileSyncOutlined />}>
                  Draft Reapplication
                </Button>
              )}

              <Button
                type="primary"
                danger
                size="large"
                onClick={onVoidTransaction}
                icon={<IssuesCloseOutlined />}>
                Void Transaction
              </Button>
            </Space>
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
                      disabled={record?.posted ?? false}>
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
                    disabled={record?.posted ?? false}>
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
          disDate: dayjs(record?.disDate ?? new Date()),
          paymentCategory: record?.paymentCategory ?? "PAYABLE",
          isAdvance: record?.isAdvance ?? false,
          disType: record?.disType ?? "CHECK",
          payeeName: record?.payeeName ?? supplier?.supplierFullname,
          transType: record?.transType?.id,
          cash: record?.cash ?? 0,
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
              label="Disbursement Date"
              name="disDate"
              rules={requiredField}
              propsdatepicker={{
                allowClear: false,
              }}
            />
            <FormInput
              label="Payee Name"
              name="payeeName"
              rules={requiredField}
              propsinput={{
                placeholder: "Payee Name",
              }}
            />
            <Row gutter={[16, 0]}>
              <Col {...responsiveColumn2}>
                <FormSelect
                  label="Payment Category"
                  name="paymentCategory"
                  rules={requiredField}
                  propsselect={{
                    options: APCAT_DIS,
                    placeholder: "Select Payment Category",
                    onChange: (e) => {
                      onChangePaymentCategory(e);
                    },
                  }}
                />
              </Col>
              <Col {...responsiveColumn2}>
                <FormSwitch
                  label="Deposit / Advance Payment"
                  name="isAdvance"
                  valuePropName="checked"
                  switchprops={{
                    disabled:
                      state.paymentCategory === "EXPENSE" ||
                      !_.isEmpty(application),
                    checkedChildren: "Yes",
                    unCheckedChildren: "No",
                    onChange: (e) => {
                      setState((prev: any) => ({ ...prev, isAdvance: e }));
                    },
                  }}
                />
              </Col>
            </Row>
            <FormSelect
              label="Disbursement Type"
              name="disType"
              rules={requiredField}
              propsselect={{
                options: DIS_TYPE,
                placeholder: "Select Disbursement Type",
                onChange: (e) => {
                  calculateAmount(0, e);
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
            <FormInputNumber
              label="Cash"
              name="cash"
              rules={requiredField}
              propsinputnumber={{
                readOnly: state?.type === "CHECK",
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                placeholder: "Cash",
                onChange: (e) => {
                  calculateAmount(Number(e), "CASH");
                },
              }}
            />
            <FormTextArea
              label="Remarks/Notes (Particulars)"
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
                <DisbursementSummaryFooter
                  disAmount={decimalRound2(state.disAmount)}
                  appliedAmount={decimalRound2(state.appliedAmount)}
                  balance={decimalRound2(state.disAmount - state.appliedAmount)}
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
