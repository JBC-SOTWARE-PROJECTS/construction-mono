import React, { useState, useMemo } from "react";
import {
  Mutation,
  Query,
  Reapplication,
  Supplier,
} from "@/graphql/gql/graphql";
import {
  IDisbursementApplication,
  IPayloadValues,
} from "@/interface/payables/formInterfaces";
import {
  CarryOutOutlined,
  FileTextOutlined,
  IssuesCloseOutlined,
  RedoOutlined,
  SaveOutlined,
  ScheduleOutlined,
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
  Tag,
  App,
  Table,
  Card,
} from "antd";
import type { DescriptionsProps } from "antd";
import _ from "lodash";
import FullScreenModal from "@/components/common/fullScreenModal/fullScreenModal";
import {
  RPTOTALS,
  responsiveColumn3,
  responsiveColumn3Last,
} from "@/utility/constant";
import { FormInput, FormSelect, FormTextArea } from "@/components/common";
import {
  NumberFormater,
  decimalRound2,
  DateFormatter,
  requiredField,
} from "@/utility/helper";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import { useAPTransactionType } from "@/hooks/payables";
import { useConfirmationPasswordHook, useDialog } from "@/hooks";
import ViewJournalEntries from "../journalentries/viewJournalEntries";
import {
  GET_RECORDS_AP_REAPPLICATION,
  UPDATE_REAPPLICATION_RECORD,
  UPDATE_REAPPLICATION_STATUS,
} from "@/graphql/payables/disbursement-queries";
import RPJournalEntries from "../journalentries/rpJournalEntries";
import APApplicationsTable from "../disbursement/component/apApplications";
import ReapplicationSummaryFooter from "../common/reapplicationSummary";

interface IProps {
  hide: (hideProps: any) => void;
  supplier?: Supplier;
  record: Reapplication;
}

export default function ReapplicationModal(props: IProps) {
  const { message } = App.useApp();
  const { hide, supplier, record } = props;
  const [parentForm] = Form.useForm();
  const [showPasswordConfirmation] = useConfirmationPasswordHook();
  const [action, setAction] = useState<string | null>(null);
  const [state, setState] = useState<any>({
    discountAmount: record?.discountAmount ?? 0,
    ewtAmount: record?.ewtAmount ?? 0,
    appliedAmount: record?.appliedAmount ?? 0,
    balance: 0,
  });
  const [application, setApplication] = useState<IDisbursementApplication[]>(
    []
  );

  const [saveCloseLoading, setSaveCloseLoading] = useState(false);
  // ======================= Modal ===============================
  const journalEntries = useDialog(RPJournalEntries);
  const viewEntries = useDialog(ViewJournalEntries);
  // ===================== Queries ==============================
  const transactionList = useAPTransactionType({
    type: supplier?.supplierTypes?.id,
    category: "RP",
  });

  const { loading, refetch } = useQuery<Query>(GET_RECORDS_AP_REAPPLICATION, {
    variables: {
      id: record?.id,
    },
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      let result = data?.apReapplication as IDisbursementApplication[];
      if (result) {
        let payloadAmount = {
          discount: _.sumBy(result, "discount"),
          ewtAmount: _.sumBy(result, "ewtAmount"),
          appliedAmount: _.sumBy(result, "appliedAmount"),
        };
        calculateApplicationAmount(payloadAmount);
        setApplication(result);
      }
    },
  });

  const [upsertRecord] = useMutation<Mutation>(UPDATE_REAPPLICATION_RECORD, {
    ignoreResults: false,
  });

  const [updateRecord, { loading: updateLoading }] = useMutation<Mutation>(
    UPDATE_REAPPLICATION_STATUS,
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

  const onSubmit = (values: Reapplication) => {
    const payload = _.clone(values);
    payload.transType = null;
    if (values.transType) {
      payload.transType = { id: values.transType };
    }
    payload.discountAmount = state.discountAmount;
    payload.ewtAmount = state.ewtAmount;
    payload.appliedAmount = state.appliedAmount;
    // ==================== validations ===============================
    if (state.balance < 0) {
      return message.error(
        "Applied amount is greater than disbursement amount"
      );
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
          items: application,
        },
        onCompleted: (data) => {
          const result = data.updateReapply as Reapplication;
          setSaveCloseLoading(false);
          if (result?.id) {
            if (action === "save_close") {
              if (record?.id) {
                hide({
                  success: true,
                  message: "Reapplication Voucher successfully saved.",
                });
              } else {
                hide({
                  success: true,
                  message: "Reapplication Voucher successfully updated.",
                });
              }
            } else if (action === "save_post") {
              const postPayload = {
                id: record?.id,
                status: true,
                refNo: record?.disbursement?.disNo,
                supplierName: supplier?.supplierFullname,
                refDate: dayjs(record?.createdDate).format("YYYY"),
                type: supplier?.supplierTypes?.id,
                particulars: payload?.remarks,
              };
              journalEntries(postPayload, (e: any) => {
                if (e) {
                  hide({
                    success: true,
                    message: "Reapplication Voucher successfully posted.",
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
            message: "Reapplication Payable successfully voided.",
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
          let result = data?.updateRPStatus as Reapplication;
          if (result?.id) {
            hide({
              success: true,
              message: "Reapplication Payable updated to draft.",
            });
          }
        },
      });
    });
  };

  const calculateApplicationAmount = (payload: IPayloadValues) => {
    let credit = payload.appliedAmount - payload.ewtAmount - payload.discount;
    let disAmount = parseFloat(record?.disbursement?.voucherAmount ?? 0);
    setState({
      ...state,
      discountAmount: decimalRound2(payload.discount),
      ewtAmount: decimalRound2(payload.ewtAmount),
      appliedAmount: decimalRound2(payload.appliedAmount),
      balance: decimalRound2(disAmount - credit),
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
  }, [record, state, application]);

  const disabled = useMemo(() => {
    if (record?.posted) {
      return true;
    } else if (record?.status === "VOIDED") {
      return true;
    } else {
      return false;
    }
  }, [record]);

  const reapplicationBalance = useMemo(() => {
    let balance = 0;
    let vourcherAmount = record?.disbursement?.voucherAmount ?? 0;
    let appliedAmount = record?.disbursement?.appliedAmount ?? 0;
    balance = decimalRound2(vourcherAmount - appliedAmount);
    return balance;
  }, [record]);

  // ============================= UI =======================================

  return (
    <FullScreenModal
      hide={hide}
      allowFullScreen={true}
      icon={<ScheduleOutlined />}
      title="Disbursement Reapplication"
      extraTitle={record?.rpNo ?? record?.disbursement?.disNo}
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
          transType: record?.transType?.id,
          referenceNo: record?.referenceNo,
          remarks: record?.remarks,
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
            <Card size="small" title="Disbursement Details">
              <div className="w-full relative">
                <div className="dev-flex">
                  <p className="font-bold" style={{ width: "300px" }}>
                    Payee Name
                  </p>
                  <p style={{ width: "calc(100% - 300px)" }}>
                    {record?.disbursement?.payeeName}
                  </p>
                </div>
                <div className="dev-flex">
                  <p className="font-bold" style={{ width: "300px" }}>
                    Disbursement Type
                  </p>
                  <p style={{ width: "calc(100% - 300px)" }}>
                    {record?.disbursement?.disType}
                  </p>
                </div>
                <div className="dev-flex">
                  <p className="font-bold" style={{ width: "300px" }}>
                    Disbursement No
                  </p>
                  <p style={{ width: "calc(100% - 300px)" }}>
                    {record?.disbursement?.disNo}
                  </p>
                </div>
                <div className="dev-flex">
                  <p className="font-bold" style={{ width: "300px" }}>
                    Disbursement Date
                  </p>
                  <p style={{ width: "calc(100% - 300px)" }}>
                    {DateFormatter(record?.disbursement?.disDate)}
                  </p>
                </div>
                <div className="dev-flex">
                  <p className="font-bold" style={{ width: "300px" }}>
                    Disbursement Amount
                  </p>
                  <p
                    className="color-green"
                    style={{ width: "calc(100% - 300px)" }}>
                    {NumberFormater(record?.disbursement?.voucherAmount ?? 0)}
                  </p>
                </div>
                <div className="dev-flex">
                  <p className="font-bold" style={{ width: "300px" }}>
                    Applied Amount
                  </p>
                  <p
                    className="color-red"
                    style={{ width: "calc(100% - 300px)" }}>
                    {NumberFormater(record?.disbursement?.appliedAmount ?? 0)}
                  </p>
                </div>
                <div className="dev-flex">
                  <p className="font-bold" style={{ width: "300px" }}>
                    For Reapplication
                  </p>
                  <p
                    className="color-orange"
                    style={{ width: "calc(100% - 300px)" }}>
                    {NumberFormater(reapplicationBalance)}
                  </p>
                </div>
              </div>
            </Card>
          </Col>
          <Col {...responsiveColumn3}>
            <FormSelect
              label="Transaction Type"
              name="transType"
              propsselect={{
                options: transactionList,
                allowClear: true,
                placeholder: "Select Transaction Terms",
              }}
            />
            <FormInput
              label="Reference No"
              name="referenceNo"
              rules={requiredField}
              propsinput={{
                placeholder: "Reference No",
              }}
            />
            <FormTextArea
              label="Remarks/Notes (Particular)"
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
                <ReapplicationSummaryFooter
                  disAmount={decimalRound2(record?.disbursement?.voucherAmount)}
                  appliedAmount={decimalRound2(
                    state.appliedAmount + record.prevApplied
                  )}
                  balance={decimalRound2(state.balance - record.prevApplied)}
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
          <APApplicationsTable
            supplier={supplier}
            status={disabled}
            dataSource={application}
            loading={loading}
            calculateAmount={(e: IPayloadValues) =>
              calculateApplicationAmount(e)
            }
            setApplication={setApplication}
            onRefetchData={onRefetchData}
          />
        </Col>
      </Row>
    </FullScreenModal>
  );
}
