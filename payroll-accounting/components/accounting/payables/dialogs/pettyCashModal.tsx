import React, { useState, useMemo } from "react";
import { Mutation, PettyCashAccounting, Query } from "@/graphql/gql/graphql";
import {
  ConfigVat,
  PettyCashItemDto,
  PettyCashOthersDto,
} from "@/interface/payables/formInterfaces";
import {
  CarryOutOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  IssuesCloseOutlined,
  RedoOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Col, Divider, Form, Row, Space, App, Table } from "antd";
import _ from "lodash";
import FullScreenModal from "@/components/common/fullScreenModal/fullScreenModal";
import {
  PC_CATEGORY,
  PETTYTOTALS,
  responsiveColumn2,
  responsiveColumn3,
  responsiveColumn3Last,
  vatRate,
} from "@/utility/constant";
import { FormInput, FormSelect, FormTextArea } from "@/components/common";
import {
  DateFormatter,
  NumberFormater,
  decimalRound2,
  requiredField,
} from "@/utility/helper";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import {
  useAPTransactionTypeOthers,
  usePettyCashNames,
  useReferencePettyCashType,
} from "@/hooks/payables";
import { useConfirmationPasswordHook, useDialog } from "@/hooks";
import ViewJournalEntries from "../journalentries/viewJournalEntries";
import PCVJournalEntries from "../journalentries/pcvJournalEntries";
import FormDatePicker from "@/components/common/formDatePicker/formDatePicker";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import PCVPurchaseTable from "../pettycash/component/purchasesTable";
import PettyCashSummaryFooter from "../common/pettyCashSummary";
import {
  UPSERT_PETTY_CASH_RECORD,
  UPDATE_PETTY_CASH_STATUS,
  GET_PCV_ITEMS,
} from "@/graphql/payables/petty-cash-queries";
import FormAutoComplete from "@/components/common/formAutoComplete/formAutoComplete";
import PettyOthersTable from "../pettycash/component/pettyOthersTable";

interface IProps {
  hide: (hideProps: any) => void;
  record: PettyCashAccounting;
}

export default function PettyCashModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, record } = props;
  const [parentForm] = Form.useForm();
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  const [action, setAction] = useState<string | null>(null);
  const [state, setState] = useState<any>({
    amountIssued: record?.amountIssued ?? 0,
    amountUsed: record?.amountUsed ?? 0,
    amountUnused: record?.amountUnused ?? 0,
  });
  const [purchases, setPurchases] = useState<PettyCashItemDto[]>([]);
  const [others, setOthers] = useState<PettyCashOthersDto[]>([]);
  const [category, setCategory] = useState<string>(
    record?.pcvCategory ?? "OTHERS"
  );
  const [config, setConfig] = useState<ConfigVat>({
    vatRate: record?.vatRate ?? vatRate,
    vatInclusive: record?.vatInclusive ?? true,
  });

  const [saveCloseLoading, setSaveCloseLoading] = useState(false);
  // ======================= Modal ===============================
  const journalEntries = useDialog(PCVJournalEntries);
  const viewEntries = useDialog(ViewJournalEntries);
  // ===================== Queries ==============================
  const transactionList = useAPTransactionTypeOthers({
    category: "PC",
  });
  const referenceTypes = useReferencePettyCashType();
  const pettyCashNames = usePettyCashNames();

  const { loading, refetch } = useQuery<Query>(GET_PCV_ITEMS, {
    variables: {
      id: record?.id,
    },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      console.log("data", data);
      if (category === "PURCHASE") {
        let result = data.purchaseItemsByPetty as PettyCashItemDto[];
        let mapped = (result || []).map((obj) => {
          return {
            ...obj,
            expirationDate: obj.expirationDate
              ? DateFormatter(obj.expirationDate)
              : null,
          };
        });
        setPurchases(mapped);
        //======================= calculate=========================
        if (!_.isEmpty(mapped)) {
          let netOfDiscount: number = decimalRound2(
            _.sumBy(mapped, "netDiscount")
          );
          let netAmount: number = decimalRound2(_.sumBy(mapped, "netAmount"));
          if (config.vatInclusive) {
            calculateUsedAmount(netOfDiscount);
          } else {
            calculateUsedAmount(netAmount);
          }
        }
      } else if (category === "OTHERS") {
        let result = data.othersByPetty as PettyCashOthersDto[];
        setOthers(result);
        //======================= calculate=========================
        let sumAmount: number = _.sumBy(result, "amount");
        calculateUsedAmount(sumAmount);
      }
    },
  });

  const [upsertRecord] = useMutation<Mutation>(UPSERT_PETTY_CASH_RECORD, {
    ignoreResults: false,
  });

  const [updateRecord, { loading: updateLoading }] = useMutation<Mutation>(
    UPDATE_PETTY_CASH_STATUS,
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

  const onSubmit = (values: PettyCashAccounting) => {
    const payload = _.clone(values);
    payload.transType = null;
    if (values.transType) {
      payload.transType = { id: values.transType };
    }
    if (category === "PURCHASE") {
      payload.vatRate = config.vatRate;
      payload.vatInclusive = config.vatInclusive;
    } else {
      payload.vatRate = 0;
      payload.vatInclusive = false;
    }
    payload.amountIssued = state.amountIssued;
    payload.amountUsed = state.amountUsed;
    payload.amountUnused = state.amountUnused;
    payload.pcvDate = values.pcvDate;
    // ==================== validations ===============================
    if (state.amountUnused < 0) {
      return message.error("Applied issued is greater than Amount used");
    }
    //=================== end validations =============================
    showPasswordConfirmation(() => {
      if (action === "save_close") {
        setSaveCloseLoading(true);
      }
      upsertRecord({
        variables: {
          id: record?.id,
          fields: payload,
          items: purchases,
          others: others,
        },
        onCompleted: (data) => {
          const result = data.upsertPettyCashAccounting as PettyCashAccounting;
          setSaveCloseLoading(false);
          if (result?.id) {
            if (action === "save_close") {
              if (record?.id) {
                hide({
                  success: true,
                  message: "Petty Cash Voucher successfully saved.",
                });
              } else {
                hide({
                  success: true,
                  message: "Petty Cash Voucher successfully updated.",
                });
              }
            } else if (action === "save_post") {
              const payload = {
                id: record?.id,
                status: true,
                refNo: record?.pcvNo,
                supplierName: record?.payeeName,
                refDate: dayjs(record?.pcvDate).format("YYYY"),
              };
              journalEntries(payload, (e: any) => {
                if (e) {
                  hide({
                    success: true,
                    message: "Petty Cash Voucher successfully posted.",
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
            message: "Petty Cash Payable successfully voided.",
          });
        }
      });
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
          let result = data?.updatePettyCashStatus as PettyCashAccounting;
          if (result?.id) {
            hide({
              success: true,
              message: "Petty Cash Payable updated to draft.",
            });
          }
        },
      });
    });
  };

  const calculateUsedAmount = (amount: number) => {
    setState((prev: any) => ({
      ...prev,
      amountUsed: amount,
      amountUnused: decimalRound2(Number(prev.amountIssued) - amount),
    }));
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

  // ========================== end =============================
  // ========================== useEffects and Others ======================
  const totals = useMemo(() => {
    let result = PETTYTOTALS;
    result = PETTYTOTALS.map((obj) => {
      let amount = state[obj.id];
      // end running balance
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
  }, [record, state, purchases]);

  const disabled = useMemo(() => {
    if (record?.posted) {
      return true;
    } else if (record?.status === "VOIDED") {
      return true;
    } else {
      return false;
    }
  }, [record]);

  const disabledSaveBtn = useMemo(() => {
    if (record?.posted) {
      return true;
    } else if (category === "PURCHASE") {
      return _.isEmpty(purchases);
    } else if (category === "OTHERS") {
      return _.isEmpty(others);
    } else {
      return false;
    }
  }, [record, purchases, others, category]);

  // ============================= UI =======================================

  return (
    <FullScreenModal
      hide={hide}
      allowFullScreen={true}
      icon={<CreditCardOutlined />}
      title="Petty Cash Transaction"
      extraTitle={record?.pcvNo ?? null}
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
                      disabled={disabledSaveBtn}>
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
                    disabled={disabledSaveBtn}>
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
          pcvDate: record?.pcvDate ? dayjs(record?.pcvDate) : dayjs(),
          payeeName: record?.payeeName,
          pcvCategory: category,
          amountIssued: record?.amountIssued ?? 0,
          transType: record?.transType?.id,
          referenceType: record?.referenceType,
          referenceNo: record?.referenceNo,
          remarks: record?.remarks,
        }}>
        <Row gutter={[16, 0]}>
          <Col {...responsiveColumn3}>
            <FormDatePicker
              label="PCV Date"
              name="pcvDate"
              rules={requiredField}
              propsdatepicker={{
                allowClear: false,
              }}
            />
            <FormAutoComplete
              label="Payee Name"
              name="payeeName"
              rules={requiredField}
              propsinput={{
                options: pettyCashNames,
                placeholder: "Payee Name",
              }}
            />
            <FormSelect
              label="PCV Category"
              name="pcvCategory"
              rules={requiredField}
              propsselect={{
                options: PC_CATEGORY,
                allowClear: true,
                placeholder: "Select PCV Category",
                onChange: (e) => {
                  if (!record?.id) {
                    setPurchases([]);
                    setOthers([]);
                  }
                  setCategory(e);
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
              label="Amount Issued"
              name="amountIssued"
              rules={requiredField}
              propsinputnumber={{
                formatter: (value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
                placeholder: "Amount Issued",
                onChange: (e) => {
                  setState((prev: any) => ({
                    ...prev,
                    amountIssued: Number(e),
                    amountUnused: decimalRound2(Number(e) - prev.amountUsed),
                  }));
                },
              }}
            />
            <Row gutter={[8, 0]}>
              <Col {...responsiveColumn2}>
                <FormAutoComplete
                  label="Reference Type"
                  name="referenceType"
                  rules={requiredField}
                  propsinput={{
                    options: referenceTypes,
                    placeholder: "Reference Type",
                  }}
                />
              </Col>
              <Col {...responsiveColumn2}>
                <FormInput
                  label="Reference No"
                  name="referenceNo"
                  rules={requiredField}
                  propsinput={{
                    placeholder: "Reference No",
                  }}
                />
              </Col>
            </Row>
            <FormTextArea
              label="Remarks/Notes"
              name="remarks"
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
                <PettyCashSummaryFooter amount={state.amountUnused} />
              )}
            />
          </Col>
        </Row>
      </Form>
      {/*  */}
      <Divider plain>Transaction Details</Divider>
      <Row>
        <Col span={24}>
          {category === "PURCHASE" && (
            <PCVPurchaseTable
              loading={loading}
              onRefetchData={onRefetchData}
              status={disabled}
              isVoided={record?.status === "VOIDED"}
              dataSource={purchases}
              setDataSource={setPurchases}
              calculateUsedAmount={(e: number) => calculateUsedAmount(e)}
              config={config}
              setConfig={setConfig}
            />
          )}

          {category === "OTHERS" && (
            <PettyOthersTable
              loading={loading}
              onRefetchData={onRefetchData}
              status={disabled}
              isVoided={record?.status === "VOIDED"}
              dataSource={others}
              setOthers={setOthers}
              calculateUsedAmount={(e: number) => calculateUsedAmount(e)}
            />
          )}
        </Col>
      </Row>
    </FullScreenModal>
  );
}
