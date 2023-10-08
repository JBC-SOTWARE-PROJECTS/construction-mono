import React, { useEffect, useState, useMemo } from "react";
import {
  AccountsPayable,
  AccountsPayableDetails,
  Mutation,
  Query,
  Supplier,
} from "@/graphql/gql/graphql";
import {
  GET_AP_ADVANCE_SUPPLIER,
  GET_AP_ITEMS,
  POST_ACCOUNT_PAYABLE,
  REMOVE_AP_DETAILS,
  UPDATE_PAYABLE_STATUS,
  UPSERT_PAYABLE_RECORD,
} from "@/graphql/payables/queries";
import {
  AuditOutlined,
  BarsOutlined,
  CarryOutOutlined,
  FileTextOutlined,
  InsertRowBelowOutlined,
  IssuesCloseOutlined,
  RedoOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
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
import APTransactionDetailsTable from "../payable/component/transactionTable";
import APReferencesTable from "../payable/component/references";
import {
  APCATEGORY,
  APTOTALS,
  responsiveColumn2,
  responsiveColumn3,
  responsiveColumn3Last,
  vatRate,
} from "@/utility/constant";
import {
  FormDatePicker,
  FormInput,
  FormInputNumber,
  FormSelect,
  FormTextArea,
} from "@/components/common";
import { ColumnsType } from "antd/es/table";
import {
  useAPTransactionType,
  usePaymentTerms,
  useReferenceType,
} from "@/hooks/payables";
import dayjs from "dayjs";
import PayableSummaryFooter from "../common/payableSummary";
import {
  ExtendedAPTransactionDto,
  IFormAPTransactionDetailsBulk,
} from "@/interface/payables/formInterfaces";
import update from "immutability-helper";
import { useConfirmationPasswordHook, useDialog } from "@/hooks";
import APJournalEntries from "../journalentries/apJournalEntries";
import ViewJournalEntries from "../journalentries/viewJournalEntries";
import { NumberFormater, requiredField, decimalRound2 } from "@/utility/helper";
import FormAutoComplete from "@/components/common/formAutoComplete/formAutoComplete";
import FormSwitch from "@/components/common/formSwitch/formSwitch";

interface IProps {
  hide: (hideProps: any) => void;
  supplier?: Supplier;
  record?: AccountsPayable;
}

export default function PayableModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, supplier, record } = props;
  const [parentForm] = Form.useForm();
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  const [action, setAction] = useState<string | null>(null);
  const [state, setState] = useState<any>({
    grossAmount: record?.grossAmount,
    discountAmount: record?.discountAmount,
    netOfDiscount: record?.netOfDiscount,
    vatRate: record?.vatRate,
    vatAmount: record?.vatAmount,
    netOfVat: record?.netOfVat,
    ewtAmount: record?.ewtAmount,
    netAmount: record?.netAmount,
  });
  const [items, setItems] = useState<AccountsPayableDetails[]>([]);
  const [saveCloseLoading, setSaveCloseLoading] = useState(false);
  const [allowBeginning, setAllowBeginning] = useState(false);
  // ======================= Modal ===============================
  const journalEntries = useDialog(APJournalEntries);
  const viewEntries = useDialog(ViewJournalEntries);
  // ===================== Queries ==============================
  const paymentTermsList = usePaymentTerms();
  const referenceTypes = useReferenceType();
  const transactionList = useAPTransactionType({
    type: supplier?.supplierTypes?.id,
    category: "AP",
  });

  const { loading: beginningLoading } = useQuery<Query>(
    GET_AP_ADVANCE_SUPPLIER,
    {
      fetchPolicy: "cache-and-network",
      variables: {
        supplier: supplier?.id,
        id: record?.id,
      },
      onCompleted: (data) => {
        let result = data?.apBeginning as boolean;
        setAllowBeginning(result);
      },
    }
  );

  const [getItems, { loading }] = useLazyQuery<Query>(GET_AP_ITEMS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const res = data?.detailsByAp as AccountsPayableDetails[];
      setItems(res);
      calculateAmount(res);
    },
  });

  const [upsertRecord] = useMutation<Mutation>(UPSERT_PAYABLE_RECORD, {
    ignoreResults: false,
  });
  const [updateRecord, { loading: updateLoading }] = useMutation<Mutation>(
    UPDATE_PAYABLE_STATUS,
    {
      ignoreResults: false,
    }
  );

  const [removeRecord] = useMutation<Mutation>(REMOVE_AP_DETAILS, {
    ignoreResults: false,
    onCompleted: (data) => {
      console.log(data);
      let result = data?.removeApDetails as AccountsPayableDetails;
      if (!_.isEmpty(result?.id)) {
        getItems({
          variables: {
            id: record?.id,
          },
        });
        message.success("Sucessfully Removed");
      }
    },
  });

  const [postAccountPayable, { loading: upsertLoading }] =
    useMutation<Mutation>(POST_ACCOUNT_PAYABLE, {
      ignoreResults: false,
      onCompleted: (data) => {
        const result = data.postAp as AccountsPayable;
        if (result?.id) {
          hide({
            success: true,
            message: "Account Payable successfully posted.",
          });
        }
      },
    });

  //================== functions ====================
  const onFinishFailed = () => {
    message.error("Something went wrong. Please contact administrator.");
  };

  const onSubmit = (values: AccountsPayable) => {
    const payload = _.clone(values);
    payload.supplier = supplier;
    payload.paymentTerms = { id: values.paymentTerms };
    if (values?.transType) {
      payload.transType = { id: values.transType };
    } else {
      payload.transType = null;
    }
    payload.apCategory = values.apCategory;
    payload.grossAmount = state.grossAmount;
    payload.discountAmount = state.discountAmount;
    payload.netOfDiscount = state.netOfDiscount;
    payload.vatAmount = state.vatAmount;
    payload.netOfVat = state.netOfVat;
    payload.ewtAmount = state.ewtAmount;
    payload.netAmount = state.netAmount;

    showPasswordConfirmation(() => {
      if (action === "save_close") {
        setSaveCloseLoading(true);
      }
      upsertRecord({
        variables: {
          fields: payload,
          items: items,
          id: record?.id ?? null,
        },
        onCompleted: (data) => {
          const result = data.upsertPayables;
          setSaveCloseLoading(false);
          if (result?.id) {
            if (action === "save_close") {
              if (record?.id) {
                hide({
                  success: true,
                  message: "Account Payable successfully saved.",
                });
              } else {
                hide({
                  success: true,
                  message: "Account Payable successfully updated.",
                });
              }
            } else if (action === "save_post") {
              if (payload.isBeginningBalance) {
                postAccountPayable({
                  variables: {
                    id: record?.id,
                    status: false,
                  },
                });
              } else {
                const postPayload = {
                  id: record?.id,
                  status: true,
                  refNo: record?.apNo,
                  supplierName: supplier?.supplierFullname,
                  refDate: dayjs(record?.apvDate).format("YYYY"),
                };
                journalEntries(postPayload, (e: any) => {
                  if (e) {
                    hide({
                      success: true,
                      message: "Account Payable successfully posted.",
                    });
                  } else {
                    hide(false);
                  }
                });
              }
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
    if (_.isEmpty(record?.disbursement) && _.isEmpty(record?.dmRefNo)) {
      showPasswordConfirmation(() => {
        if (record?.isBeginningBalance) {
          postAccountPayable({
            variables: {
              id: record?.id,
              status: true,
            },
          });
        } else {
          journalEntries({ id: record?.id, status: false }, (e: any) => {
            if (e) {
              hide({
                success: true,
                message: "Account Payable successfully voided.",
              });
            } else {
              hide(false);
            }
          });
        }
      });
    } else {
      message.error(
        `Cannot void the transaction because it has been used in the following transaction: ${
          record?.disbursement
        }${record?.dmRefNo ? `,${record?.dmRefNo}` : ""}`
      );
    }
  };

  const onUpdateStatus = () => {
    showPasswordConfirmation(() => {
      updateRecord({
        variables: {
          id: record?.id,
          status: "DRAFT",
        },
        onCompleted: (data) => {
          let result = data?.updateAPStatus as AccountsPayable;
          if (result?.id) {
            hide({
              success: true,
              message: "Account Payable updated to draft.",
            });
          }
        },
      });
    });
  };

  const onRemoveDetails = (id: string, isNew: boolean) => {
    let data = _.clone(items);
    let index = data.findIndex((e) => e.id === id);
    if (isNew) {
      //remove array
      if (data[index]) {
        _.remove(data, function (e) {
          return e.id === data[index].id;
        });
        setItems(data);
        calculateAmount(data);
        message.success("Sucessfully Removed");
      }
    } else {
      //remove database then refecth
      removeRecord({
        variables: {
          id: id,
        },
      });
    }
  };

  const onAddDetails = (item: ExtendedAPTransactionDto) => {
    let data = _.clone(items);
    let key = data.findIndex((e) => e.id === item.id);
    if (key < 0) {
      data.push(item);
      setItems(data);
      calculateAmount(data);
    } else {
      let payloadUpdated = update(data, {
        [key]: {
          amount: {
            $set: item?.amount,
          },
          discRate: {
            $set: item?.discRate,
          },
          discAmount: {
            $set: item?.discAmount,
          },
          vatAmount: {
            $set: item?.vatAmount,
          },
          vatInclusive: {
            $set: item?.vatInclusive,
          },
          ewtRate: {
            $set: item?.ewtRate,
          },
          ewtAmount: {
            $set: item?.ewtAmount,
          },
          netAmount: {
            $set: item?.netAmount,
          },
          remarksNotes: {
            $set: item?.remarksNotes,
          },
          refNo: {
            $set: item?.refNo,
          },
          transType: {
            $set: item?.transType,
          },
          office: {
            $set: item?.office,
          },
          project: {
            $set: item?.project,
          },
          taxDesc: {
            $set: item?.taxDesc,
          },
        },
      });
      setItems(payloadUpdated);
      calculateAmount(payloadUpdated);
    }
  };
  const onBulkUpdates = (item: IFormAPTransactionDetailsBulk) => {
    let data = _.clone(items);
    let discount = item?.discAmount ?? 0;
    let size = _.size(data);
    let discountAmount = discount / size;
    let vat = item?.vatRate ?? 0;
    let vatRate = vat / 100;
    let ewtRate = item?.ewtRate ?? 0;
    //loop calculate
    _.forEach(data, function (e, key) {
      //discRate
      let sprice = e?.amount - decimalRound2(discountAmount);
      let discountRate = ((e?.amount - sprice) / e?.amount) * 100;
      let netOfdiscount = e?.amount - decimalRound2(discountAmount);
      //vatAmount
      let vatAmount = 0;
      if (item?.vatInclusive) {
        vatAmount = (netOfdiscount / (vatRate + 1)) * vatRate;
      } else {
        vatAmount = netOfdiscount * vatRate;
      }
      //ewt
      let ewt = 0;
      if (vatRate <= 0) {
        ewt = netOfdiscount * vatRate;
      } else {
        if (item?.vatInclusive) {
          ewt = (netOfdiscount / (vatRate + 1)) * (ewtRate / 100);
        } else {
          ewt = netOfdiscount * (ewtRate / 100);
        }
      }
      //net
      let net = 0;
      if (item?.vatInclusive) {
        net = netOfdiscount - ewt;
      } else {
        net = netOfdiscount + vatAmount - ewt;
      }
      //end net
      let up = update(data, {
        [key]: {
          transType: {
            $set: _.isEmpty(item?.transType)
              ? data[key].transType
              : item.transType,
          },
          office: {
            $set: _.isEmpty(item.office) ? data[key].office : item.office,
          },
          project: {
            $set: _.isEmpty(item.project) ? data[key].project : item.project,
          },
          discRate: {
            $set: decimalRound2(discountRate),
          },
          discAmount: {
            $set: decimalRound2(discountAmount),
          },
          vatAmount: {
            $set: decimalRound2(vatAmount),
          },
          vatInclusive: {
            $set: item?.vatInclusive,
          },
          taxDesc: {
            $set: item?.taxDesc,
          },
          ewtRate: {
            $set: item?.ewtRate,
          },
          ewtAmount: {
            $set: decimalRound2(ewt),
          },
          netAmount: {
            $set: decimalRound2(net),
          },
        },
      });
      data = up;
    });
    setItems(data);
    calculateAmount(data);
    //
  };

  const getFormValueByName = (name: string) => {
    const { getFieldValue } = parentForm;
    return getFieldValue(name);
  };

  const calculateAmount = (data: AccountsPayableDetails[]) => {
    let netdiscount = _.sumBy(data, "amount") - _.sumBy(data, "discAmount");
    let netOfVat = _.sumBy(data, function (e) {
      let netdisc = e.amount - e.discAmount;
      return e.vatInclusive ? netdisc - e.vatAmount : netdisc;
    });
    setState({
      ...state,
      grossAmount: _.sumBy(data, "amount"),
      discountAmount: _.sumBy(data, "discAmount"),
      netOfDiscount: netdiscount,
      vatAmount: _.sumBy(data, "vatAmount"),
      netOfVat: netOfVat,
      ewtAmount: _.sumBy(data, "ewtAmount"),
      netAmount: _.sumBy(data, "netAmount"),
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

  const totals = useMemo(() => {
    let result = APTOTALS;
    result = APTOTALS.map((obj) => {
      let amount = state[obj.id];
      let runningBalance = state[obj.id];
      // running balance
      if (obj.id === "grossAmount") {
        runningBalance = state.grossAmount;
      } else if (obj.id === "discountAmount") {
        runningBalance = state.netOfDiscount;
      } else if (obj.id === "vatAmount") {
        runningBalance = state.netOfVat + state.vatAmount;
      } else if (obj.id === "ewtAmount") {
        runningBalance = state.netAmount;
      }
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
  }, [record, state, items]);

  // ========================== end =============================
  // ========================== useEffects and Others ======================
  useEffect(() => {
    if (record?.id) {
      getItems({
        variables: {
          id: record?.id,
        },
      });
    }
  }, [record]);

  const disabled = useMemo(() => {
    if (record?.posted) {
      return true;
    } else if (record?.status === "VOIDED") {
      return true;
    } else {
      return false;
    }
  }, [record]);
  //============================= UI =======================================

  return (
    <FullScreenModal
      hide={() => hide(false)}
      allowFullScreen={true}
      icon={<AuditOutlined />}
      title="Account Payables Details"
      extraTitle={record?.apNo}
      footer={
        <div className="w-full dev-between">
          <Space>
            {record?.posted ? (
              <Button
                type="dashed"
                size="large"
                disabled={record?.isBeginningBalance ?? false}
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
                      loading={upsertLoading}
                      onClick={() => setAction("save_post")}
                      icon={<CarryOutOutlined />}
                      disabled={record?.posted || _.isEmpty(items)}>
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
                    disabled={record?.posted || _.isEmpty(items)}>
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
          apvDate: dayjs(record?.apvDate ?? new Date()),
          paymentTerms: record?.paymentTerms?.id,
          dueDate: dayjs(record?.dueDate ?? new Date()),
          apCategory: record?.apCategory,
          transType: record?.transType?.id,
          referenceType: record?.referenceType,
          invoiceNo: record?.invoiceNo,
          vatRate: record?.id
            ? record?.vatRate
            : supplier?.isVatable
            ? vatRate
            : 0,
          isBeginningBalance: record?.isBeginningBalance ?? false,
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
              label="A/P Date"
              name="apvDate"
              rules={requiredField}
              propsdatepicker={{
                allowClear: false,
              }}
            />
            <FormSelect
              label="Payment Terms"
              name="paymentTerms"
              rules={requiredField}
              propsselect={{
                options: paymentTermsList,
                allowClear: true,
                placeholder: "Select Payment Terms",
              }}
            />
            <FormDatePicker
              label="Due Date"
              name="dueDate"
              rules={requiredField}
              propsdatepicker={{
                allowClear: false,
              }}
            />
            <FormSelect
              label="A/P Category"
              name="apCategory"
              rules={requiredField}
              propsselect={{
                options: APCATEGORY,
                allowClear: true,
                placeholder: "Select Payment Terms",
              }}
            />
            <Row gutter={[16, 0]}>
              <Col {...responsiveColumn2}>
                <FormSelect
                  label="Transaction Type"
                  name="transType"
                  propsselect={{
                    options: transactionList,
                    allowClear: true,
                    placeholder: "Select Payment Terms",
                  }}
                />
              </Col>
              {!beginningLoading && (
                <Col {...responsiveColumn2}>
                  <FormSwitch
                    label="Beginning Balance Marker"
                    name="isBeginningBalance"
                    valuePropName="checked"
                    switchprops={{
                      disabled: disabled || !allowBeginning,
                      checkedChildren: "Yes",
                      unCheckedChildren: "No",
                    }}
                  />
                </Col>
              )}
            </Row>
          </Col>
          <Col {...responsiveColumn3}>
            <FormAutoComplete
              label="Reference Type"
              name="referenceType"
              rules={requiredField}
              propsinput={{
                options: referenceTypes,
                placeholder: "Reference No",
              }}
            />
            <FormInput
              label="Reference No"
              name="invoiceNo"
              rules={requiredField}
              propsinput={{
                placeholder: "Reference No",
              }}
            />
            <FormInputNumber
              label="Vat Rate"
              name="vatRate"
              rules={requiredField}
              propsinputnumber={{
                placeholder: "Vat Rate",
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
              summary={() => <PayableSummaryFooter amount={state.netAmount} />}
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
            items={[
              {
                label: (
                  <span>
                    <InsertRowBelowOutlined />
                    Transaction Details
                  </span>
                ),
                key: "details",
                children: (
                  <APTransactionDetailsTable
                    status={disabled}
                    dataSource={items}
                    loading={loading}
                    supplier={supplier}
                    getVatRate={() => getFormValueByName("vatRate")}
                    onRemoveDetails={(e, i) => onRemoveDetails(e, i)}
                    onAddDetails={(e) => onAddDetails(e)}
                    onBulkUpdates={(e) => onBulkUpdates(e)}
                    isVoided={record?.status === "VOIDED"}
                  />
                ),
              },
              {
                label: (
                  <span>
                    <BarsOutlined />
                    References
                  </span>
                ),
                key: "srr",
                children: <APReferencesTable recId={record?.receiving?.id} />,
              },
            ]}
          />
        </Col>
      </Row>
    </FullScreenModal>
  );
}
