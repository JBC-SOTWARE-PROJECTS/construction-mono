import React, { useMemo, useState } from "react";
import {
  Reapplication,
  JournalEntryViewDto,
  Mutation,
  Query,
  ApAccountsTemplateItems,
} from "@/graphql/gql/graphql";
import {
  GET_RP_AUTO_ENTRIES,
  POST_REAPPLICATION_PAYABLE,
  POST_ACCOUNT_REAPPLICATION_MANUAL,
} from "@/graphql/payables/disbursement-queries";
import { currency } from "@/utility/constant";
import { NumberFormater, decimalRound2, requiredField } from "@/utility/helper";
import {
  DeleteOutlined,
  FileSearchOutlined,
  IssuesCloseOutlined,
  ReconciliationOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Table,
  Typography,
  App,
} from "antd";
import { ColumnsType } from "antd/es/table";
import JournalEntriesSummary from "../common/journalEntriesSummary";
import _ from "lodash";
import { responsiveColumn2 } from "@/utility/constant";
import { FormInput, FormSelect, FormTextArea } from "@/components/common";
import { useDialog } from "@/hooks";
import ChartOfAccountsComponentSelector from "@/components/chartOfAccounts/chartOfAccountsSelector";
import FormInputNumber from "@/components/common/formInputNumber/formInputNumber";
import update from "immutability-helper";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";
import { useAccountsTemplate } from "@/hooks/payables";
import { GET_TEMPLATE_ACCOUNTS_ITEMS } from "@/graphql/payables/ledger-queries";

interface IProps {
  hide: (hideProps: any) => void;
  id: string | null;
  status: boolean;
  refNo?: string;
  supplierName?: string;
  refDate?: string;
  type?: string;
  particulars?: string;
}

export default function RPJournalEntries(props: IProps) {
  const { message } = App.useApp();
  const { hide, id, status, refNo, supplierName, refDate, type, particulars } =
    props;
  const [ledger, setLedger] = useState<JournalEntryViewDto[]>([]);
  const [manual, setManual] = useState<boolean>(false);
  const [editable, setEditable] = useState<any>({});
  const [form] = Form.useForm();
  // ===================== Modals ==============================
  const showAccountSelector = useDialog(ChartOfAccountsComponentSelector);
  // ===================== Queries ==============================
  const templates = useAccountsTemplate({
    type: type ?? null,
    category: "RP",
  });
  // ===============================
  const { loading } = useQuery<Query>(GET_RP_AUTO_ENTRIES, {
    fetchPolicy: "cache-and-network",
    variables: {
      id: id,
      status: status,
    },
    onCompleted: (data) => {
      let result = data?.reapplyAccountView as JournalEntryViewDto[];
      if (!_.isEmpty(result)) {
        setLedger(result);
      } else {
        setManual(true);
      }
    },
    onError: (error) => {
      if (error) {
        setManual(true);
      }
    },
  });
  // ======================== LAZY ==========================
  const [getAccounts, { loading: getLoadingAccounts }] = useLazyQuery<Query>(
    GET_TEMPLATE_ACCOUNTS_ITEMS,
    {
      onCompleted: (data) => {
        const result = data.accountsItemsByParent as ApAccountsTemplateItems[];
        if (!_.isEmpty(result)) {
          const mapped = (result || []).map((item) => {
            return {
              code: item?.code ?? "",
              desc: item?.desc ?? "",
              accountType: item?.accountType ?? "",
              debit: 0.0,
              credit: 0.0,
            };
          });
          //=========================
          setLedger(mapped);
        }
      },
    }
  );
  // ====================== Mutation ===============================
  const [postReapplicationPayable, { loading: upsertLoading }] =
    useMutation<Mutation>(POST_REAPPLICATION_PAYABLE, {
      ignoreResults: false,
      onCompleted: (data) => {
        const result = data.postReapplication as Reapplication;
        if (result?.id) {
          hide(result);
        }
      },
    });

  const [postReapplicationPayableManual, { loading: manualLoading }] =
    useMutation<Mutation>(POST_ACCOUNT_REAPPLICATION_MANUAL, {
      ignoreResults: false,
      onCompleted: (data) => {
        const result = data.postReappManual;
        if (result?.success) {
          hide(result?.message);
        }
      },
    });
  //================== functions ====================
  const onPostandVoid = () => {
    const debit = decimalRound2(_.sumBy(ledger, "debit"));
    const credit = decimalRound2(_.sumBy(ledger, "credit"));

    if (debit !== credit) {
      return message.error("Journal Entry Accounts are not balance.");
    }

    postReapplicationPayable({
      variables: {
        id: id,
        status: !status,
      },
    });
  };

  const onPostManual = () => {
    const { validateFields } = form;
    let selectedCoa: any = [];
    const debit = decimalRound2(_.sumBy(ledger, "debit"));
    const credit = decimalRound2(_.sumBy(ledger, "credit"));
    if (!_.isEmpty(ledger)) {
      selectedCoa = ledger.map((obj: any) => ({
        code: obj?.code ?? "",
        credit: decimalRound2(obj?.credit) ?? 0.0,
        debit: decimalRound2(obj?.debit) ?? 0.0,
        accountType: obj?.accountType ?? "",
        description: obj.desc ?? "",
      }));
    }
    if (debit !== credit) {
      return message.error("Journal Entry Accounts are not balance.");
    }
    validateFields()
      .then((values) => {
        if (selectedCoa) {
          postReapplicationPayableManual({
            variables: {
              id: id,
              header: values,
              entries: selectedCoa,
            },
          });
        }
      })
      .catch((errorInfo) => {
        if (errorInfo) {
          message.error("Error submitting form. Please contact adminstrator");
        }
      });
  };

  const onRemove = (code: string) => {
    if (code) {
      const filtered = _.filter(
        ledger,
        (obj: JournalEntryViewDto) => obj.code !== code
      );
      setLedger(filtered);
    }
  };

  const onShowChartofAccounts = () => {
    showAccountSelector(
      { defaultSelected: ledger ?? undefined },
      (selected: any) => {
        if (selected) {
          setLedger(
            selected.map((item: any) => {
              return {
                ...item,
                desc: item?.accountName ?? "",
                debit: 0.0,
                credit: 0.0,
              };
            })
          );
        }
      }
    );
  };

  const onChangeArray = (element: string, record: any, newValue: number) => {
    let payload = _.clone(ledger);
    let index = _.findIndex(payload, ["code", record.code]);
    let contraElement = "";
    if (element === "debit") {
      contraElement = "credit";
    } else if (element === "credit") {
      contraElement = "debit";
    }

    let data = update(payload, {
      [index]: {
        [element]: {
          $set: newValue,
        },
        [contraElement]: {
          $set: 0,
        },
      },
    });
    setLedger(data);
  };

  const renderNumberInput = (record: any, el: string) => {
    return (
      <Form
        onFinish={(formData) => {
          const { value } = formData;
          onChangeArray(el, record, Number(value));
          setEditable({ [`${record.code}-${el}`]: false });
        }}
        initialValues={{
          value: record[el],
        }}>
        <FormInputNumber
          name="value"
          rules={requiredField}
          propsinputnumber={{
            formatter: (value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            parser: (value) => value!.replace(/\$\s?|(,*)/g, ""),
            autoFocus: true,
            onFocus: (event) => {
              event.target.select();
            },
            style: { width: 130 },
          }}
        />
      </Form>
    );
  };

  const onGetAccounts = (e: string) => {
    if (e) {
      getAccounts({
        variables: {
          id: e,
        },
      });
    } else {
      setLedger([]);
    }
  };

  // ================ columns ================================
  const columns = useMemo(() => {
    let cols: ColumnsType<JournalEntryViewDto> = [
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
        title: <ColumnTitle descripton="Debit" editable={true} />,
        dataIndex: "debit",
        key: "debit",
        width: 130,
        align: "right",
        onCell: (record) => {
          return {
            onDoubleClick: () => {
              if (!manual) {
                message.error("This Transaction is not Editable");
              } else {
                setEditable({ [`${record.code}-debit`]: true });
              }
            }, // double click row
          };
        },
        render: (amount, record) => {
          return editable[`${record.code}-debit`] ? (
            renderNumberInput(record, "debit")
          ) : (
            <span>
              <small>{currency} </small>
              {NumberFormater(amount)}
            </span>
          );
        },
      },
      {
        title: <ColumnTitle descripton="Credit" editable={true} />,
        dataIndex: "credit",
        key: "credit",
        align: "right",
        width: 130,
        onCell: (record) => {
          return {
            onDoubleClick: () => {
              if (!manual) {
                message.error("This Transaction is not Editable");
              } else {
                setEditable({ [`${record.code}-credit`]: true });
              }
            }, // double click row
          };
        },
        render: (amount, record) => {
          return editable[`${record.code}-credit`] ? (
            renderNumberInput(record, "credit")
          ) : (
            <span>
              <small>{currency} </small>
              {NumberFormater(amount)}
            </span>
          );
        },
      },
    ];
    if (manual) {
      cols.push({
        title: "#",
        dataIndex: "action",
        key: "action",
        width: 50,
        align: "center",
        render: (_, record) => {
          return (
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onRemove(record?.code as string)}
            />
          );
        },
      });
    }
    return cols;
  }, [manual, editable, ledger]);

  const disabledButton = useMemo(() => {
    const debit = _.sumBy(ledger, "debit");
    const credit = _.sumBy(ledger, "credit");
    const sum = decimalRound2(debit - credit);
    return sum !== 0;
  }, [ledger]);

  return (
    <Modal
      title={
        <Typography.Title level={4}>
          <Space align="center">
            <ReconciliationOutlined /> Reapplication Journal Entries
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
            {manual && (
              <Button
                type="primary"
                size="large"
                danger
                onClick={onShowChartofAccounts}
                icon={<FileSearchOutlined />}>
                Select Accounts
              </Button>
            )}
          </div>
          <Space>
            <Button
              type="primary"
              size="large"
              danger={!status}
              disabled={disabledButton}
              loading={upsertLoading || manualLoading}
              icon={!status ? <IssuesCloseOutlined /> : <SaveOutlined />}
              onClick={manual ? onPostManual : onPostandVoid}>
              {!status ? "Void Journal Entries" : "Post Journal Entries"}
            </Button>
          </Space>
        </div>
      }>
      <Row gutter={[8, 8]}>
        {manual && (
          <>
            <Col span={24}>
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  invoiceSoaReference: `${refDate}-${refNo}`,
                  entityName: `${supplierName}`,
                  particulars: particulars ?? `${refNo}-${supplierName}`,
                }}>
                <Row gutter={[16, 0]}>
                  <Col {...responsiveColumn2}>
                    <FormInput
                      label="Reference No"
                      name="invoiceSoaReference"
                      rules={requiredField}
                      propsinput={{
                        placeholder: "Reference No",
                      }}
                    />
                  </Col>
                  <Col {...responsiveColumn2}>
                    <FormInput
                      label="Entity/Supplier/Patient"
                      name="entityName"
                      rules={requiredField}
                      propsinput={{
                        placeholder: "Entity/Supplier/Patient",
                      }}
                    />
                  </Col>
                  <Col span={24}>
                    <FormTextArea
                      label="Particulars"
                      name="particulars"
                      rules={requiredField}
                      propstextarea={{
                        rows: 3,
                        placeholder: "Particulars",
                      }}
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col span={24}>
              <div className="w-full dev-right">
                <FormSelect
                  label="Load Accounts from Templates"
                  propsselect={{
                    allowClear: true,
                    placeholder: "Select Templates",
                    style: { width: 500 },
                    options: templates ?? [],
                    onChange: (e) => {
                      onGetAccounts(e);
                    },
                  }}
                />
              </div>
            </Col>
          </>
        )}
        <Col span={24}>
          <Table
            rowKey="code"
            size="small"
            loading={loading || getLoadingAccounts}
            columns={columns}
            pagination={false}
            dataSource={ledger}
            summary={() => (
              <JournalEntriesSummary
                dataSource={ledger}
                autoEntries={!manual}
              />
            )}
          />
        </Col>
      </Row>
    </Modal>
  );
}
