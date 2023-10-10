import { EmployeeLoanCategory, PaymentTerm } from "@/graphql/gql/graphql";
import useGetEmployeeLoanConfig from "@/hooks/employee-loans/useGetEmployeeLoanConfig";
import useGetLoanBalance from "@/hooks/employee-loans/useGetLoanBalance";
import useUpsertEmployeeLoanConfig from "@/hooks/employee-loans/useUpsertEmployeeLoanConfig";
import NumeralFormatter from "@/utility/numeral-formatter";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Divider, Input, InputNumber, Radio, Spin } from "antd";
import { round } from "lodash";
import React, { useState } from "react";

function LoanConfiguration() {
  const [cashAdvance, setCashAdvance] = useState<number | null>(null);
  const [equipmentLoan, setEquipmentLoan] = useState<number | null>(null);

  const [config, loadingConfig, refetch] = useGetEmployeeLoanConfig();
  const [cashAdvanceBalance, loadingCashAdvance, refetchCashAdvance] =
    useGetLoanBalance(EmployeeLoanCategory.CashAdvance);
  const [equipmentLoanBalance, loadingEquipmentLoan, refetchEquipmentLoan] =
    useGetLoanBalance(EmployeeLoanCategory.EquipmentLoan);
  const [upsert, loadingUpsert] = useUpsertEmployeeLoanConfig(() => {
    refetch();
    refetchCashAdvance();
    refetchEquipmentLoan();
  });
  const saveAmount = (category: EmployeeLoanCategory) => {
    if (category === EmployeeLoanCategory.CashAdvance) {
      upsert({ ...config, cashAdvanceAmount: cashAdvance });
      setCashAdvance(null);
    }
    if (category === EmployeeLoanCategory.EquipmentLoan) {
      upsert({ ...config, equipmentLoanAmount: equipmentLoan });
      setEquipmentLoan(null);
    }
  };

  const saveTerm = (term: PaymentTerm, category: EmployeeLoanCategory) => {
    if (category === EmployeeLoanCategory.CashAdvance) {
      upsert({ ...config, cashAdvanceTerm: term });
      setCashAdvance(null);
    }
    if (category === EmployeeLoanCategory.EquipmentLoan) {
      upsert({ ...config, equipmentLoanTerm: term });
      setEquipmentLoan(null);
    }
  };

  const getNoOfPayments = (balance: number, deduction: number) => {
    const val = round(equipmentLoanBalance / config?.equipmentLoanAmount);
    if (isNaN(val)) return 0;
    else return val;
  };
  return (
    <Spin
      spinning={
        loadingConfig ||
        loadingUpsert ||
        loadingCashAdvance ||
        loadingEquipmentLoan
      }
    >
      <b>Cash Advance </b>
      <table style={{ borderSpacing: 10 }}>
        <tr>
          <td> Term of Payment</td>
          <td> : </td>
          <td>
            <Radio.Group
              buttonStyle="solid"
              onChange={(e) =>
                saveTerm(
                  e.target.value as PaymentTerm,
                  EmployeeLoanCategory.CashAdvance
                )
              }
              value={config?.cashAdvanceTerm}
            >
              <Radio.Button value={"MONTHLY"}>
                Monthly (Every 30th)
              </Radio.Button>
              <Radio.Button value={"SEMI_MONTHLY"}>
                Semi-monthly (Every cutoff)
              </Radio.Button>
            </Radio.Group>
          </td>
        </tr>
        <tr>
          <td>Deduction Amount</td> <td> : </td>
          <td>
            {cashAdvance !== null ? (
              <div style={{ display: "flex" }}>
                <InputNumber
                  min={1}
                  defaultValue={config?.cashAdvanceAmount}
                  onChange={(value) => setCashAdvance(value)}
                />
                <span style={{ paddingLeft: 5 }}>
                  <Button
                    icon={<SaveOutlined />}
                    onClick={() => saveAmount(EmployeeLoanCategory.CashAdvance)}
                  />
                </span>
              </div>
            ) : (
              <Button
                type="text"
                onClick={() => {
                  setCashAdvance(config?.cashAdvanceAmount || 0);
                }}
              >
                {<NumeralFormatter value={config?.cashAdvanceAmount || 0} />}{" "}
                {<EditOutlined />}
              </Button>
            )}
          </td>
        </tr>
        <tr>
          <td>
            <b>Total Balance</b>
          </td>
          <td> : </td>
          <td style={{ paddingLeft: 16 }}>
            {
              <b>
                <NumeralFormatter value={cashAdvanceBalance} />
              </b>
            }
          </td>
        </tr>
        <tr>
          <td>
            <b>Estimated No. of Payments</b>
          </td>{" "}
          <td> : </td>
          <td style={{ paddingLeft: 16 }}>
            <b>
              {getNoOfPayments(cashAdvanceBalance, config?.cashAdvanceAmount)}
            </b>
          </td>
        </tr>
      </table>

      <Divider />
      <b> Equipment Loan </b>
      <table style={{ borderSpacing: 10 }}>
        <tr>
          <td> Term of Payment</td>
          <td> : </td>
          <td>
            <Radio.Group
              buttonStyle="solid"
              onChange={(e) =>
                saveTerm(
                  e.target.value as PaymentTerm,
                  EmployeeLoanCategory.EquipmentLoan
                )
              }
              value={config?.equipmentLoanTerm}
            >
              <Radio.Button value={"MONTHLY"}>
                Monthly (Every 30th)
              </Radio.Button>
              <Radio.Button value={"SEMI_MONTHLY"}>
                Semi-monthly (Every cutoff)
              </Radio.Button>
            </Radio.Group>
          </td>
        </tr>
        <tr>
          <td>Deduction Amount</td> <td> : </td>
          <td>
            {equipmentLoan !== null ? (
              <div style={{ display: "flex" }}>
                <InputNumber
                  min={1}
                  defaultValue={config?.equipmentLoanAmount}
                  onChange={(value) => setEquipmentLoan(value)}
                />
                <span style={{ paddingLeft: 5 }}>
                  <Button
                    icon={<SaveOutlined />}
                    onClick={() =>
                      saveAmount(EmployeeLoanCategory.EquipmentLoan)
                    }
                  />
                </span>
              </div>
            ) : (
              <Button
                type="text"
                onClick={() => {
                  setEquipmentLoan(config?.equipmentLoanAmount || 0);
                }}
              >
                {<NumeralFormatter value={config?.equipmentLoanAmount || 0} />}{" "}
                {<EditOutlined />}
              </Button>
            )}
          </td>
        </tr>
        <tr>
          <td>
            <b>Total Balance</b>
          </td>
          <td> : </td>
          <td style={{ paddingLeft: 16 }}>
            {
              <b>
                <NumeralFormatter value={equipmentLoanBalance} />
              </b>
            }
          </td>
        </tr>
        <tr>
          <td>
            <b>Estimated No. of Payments</b>
          </td>
          <td> : </td>
          <td style={{ paddingLeft: 16 }}>
            <b>
              {getNoOfPayments(
                equipmentLoanBalance,
                config?.equipmentLoanAmount
              )}
            </b>
          </td>
        </tr>
      </table>
    </Spin>
  );
}

export default LoanConfiguration;
