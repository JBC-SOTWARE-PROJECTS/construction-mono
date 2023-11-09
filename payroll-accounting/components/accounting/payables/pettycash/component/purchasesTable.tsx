import React, { useState } from "react";
import { confirmDelete, useDialog } from "@/hooks";
import { currency, dateFormat, vatRate } from "@/utility/constant";
import {
  DateFormatter,
  NumberFormater,
  NumberFormaterNoDecimal,
  decimalRound2,
} from "@/utility/helper";
import { BarcodeOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Space,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import _ from "lodash";
import {
  ConfigVat,
  PettyCashItemDto,
} from "@/interface/payables/formInterfaces";
import ColumnTitle from "@/components/common/columnTitle/columnTitle";
import ItemSelector from "@/components/inventory/itemSelector";
import dayjs from "dayjs";
import { FormInputNumber } from "@/components/common";
import FormSwitch from "@/components/common/formSwitch/formSwitch";
import update from "immutability-helper";

import { useMutation } from "@apollo/client";
import { Mutation } from "@/graphql/gql/graphql";
import { REMOVE_PETTYCASH_ITEM } from "@/graphql/payables/petty-cash-queries";
import PettyPurchaseSummaryFooter from "../../common/pettyPurchaseSummary";

interface IProps {
  loading?: boolean;
  status?: boolean;
  isVoided?: boolean;
  dataSource: PettyCashItemDto[];
  setDataSource: React.Dispatch<React.SetStateAction<PettyCashItemDto[]>>;
  calculateUsedAmount: (e: number) => void;
  onRefetchData: () => void;
  config: ConfigVat;
  setConfig: React.Dispatch<React.SetStateAction<ConfigVat>>;
}

interface EditableProps {
  defaultValue?: number | string;
  defaultChecked?: boolean;
  type: string;
  record: PettyCashItemDto;
  element: string;
}

export default function PCVPurchaseTable(props: IProps) {
  const {
    loading,
    dataSource,
    status,
    isVoided,
    setDataSource,
    calculateUsedAmount,
    onRefetchData,
    config,
    setConfig,
  } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [editable, setEditable] = useState<any>({});
  // ===================== modal ====================================
  const showItems = useDialog(ItemSelector);
  // ====================== queries ==================================
  const [removeRecord] = useMutation<Mutation>(REMOVE_PETTYCASH_ITEM, {
    ignoreResults: false,
    onCompleted: (data) => {
      let result = data.removePettyCashItemById as PettyCashItemDto;
      if (!_.isEmpty(result?.id)) {
        onRefetchData();
        message.success("Successfully removed.");
      }
    },
  });
  // ======================== functions ===============================
  const onShowTransaction = () => {
    let payload = _.clone(dataSource ?? []) as PettyCashItemDto[];
    let itemSelected = _.map(payload, "item");
    let mapKeys: React.Key[] = _.map(itemSelected, "id");
    showItems(
      { defaultSelected: itemSelected, defaultKey: mapKeys },
      (newItems: PettyCashItemDto[]) => {
        if (!_.isEmpty(newItems)) {
          if (_.isEmpty(dataSource)) {
            setDataSource(newItems);
          } else {
            setDataSource((prev) => [...prev, ...newItems]);
          }
        }
      }
    );
  };

  // ===================== calculation here ===============================
  const onChangeCalculation = (
    value: number,
    el: string,
    record: PettyCashItemDto
  ) => {
    // ================ form data =========================
    const { getFieldsValue } = form;
    const {
      vatRate: vatPercent,
      vatInclusive,
    }: { vatRate: number; vatInclusive: boolean } = getFieldsValue();
    let vatRate = vatPercent / 100;
    //=========================================================
    let payload = _.clone(dataSource) as PettyCashItemDto[];
    let key = _.findIndex(payload, ["id", record.id]);
    let data = [] as PettyCashItemDto[];
    if (el === "qty") {
      let inputValue = Math.floor(Number(value));
      let totalAmount = inputValue * record.unitCost;
      let discount = totalAmount * (record.discRate / 100);
      let net_amount = totalAmount;
      let tax = 0;
      if (vatInclusive) {
        tax = ((totalAmount - discount) / (vatRate + 1)) * vatRate;
        net_amount = totalAmount - (record.isVat ? tax : 0) - discount;
      } else {
        tax = (totalAmount - discount) * vatRate;
        net_amount = totalAmount + (record.isVat ? tax : 0) - discount;
      }
      let net_of_discount = totalAmount - discount;
      // ================= update list ==============================
      data = update(payload, {
        [key]: {
          [el]: {
            $set: inputValue,
          },
          grossAmount: {
            $set: decimalRound2(totalAmount),
          },
          netDiscount: {
            $set: decimalRound2(net_of_discount),
          },
          vatAmount: {
            $set: decimalRound2(record.isVat ? tax : 0),
          },
          netAmount: {
            $set: decimalRound2(net_amount),
          },
          discAmount: {
            $set: decimalRound2(discount),
          },
        },
      });
    } else if (el === "unitCost") {
      let inputValue = Number(value);
      let totalAmount = inputValue * Number(record.qty);
      let discount = totalAmount * (record.discRate / 100);
      let discountItemCost = inputValue * (record.discRate / 100);
      let net_amount = totalAmount;
      let tax = 0;
      let unitCostDiscounted = inputValue - discountItemCost;
      let unitCostVat = unitCostDiscounted;
      if (vatInclusive) {
        tax = ((totalAmount - discount) / (vatRate + 1)) * vatRate;
        net_amount = totalAmount - (record.isVat ? tax : 0) - discount;
        unitCostVat = unitCostDiscounted / (vatRate + 1);
      } else {
        tax = (totalAmount - discount) * vatRate;
        net_amount = totalAmount + (record.isVat ? tax : 0) - discount;
        unitCostVat = unitCostDiscounted * vatRate + inputValue;
      }
      let net_of_discount = totalAmount - discount;
      data = update(payload, {
        [key]: {
          [el]: {
            $set: decimalRound2(inputValue),
          },
          inventoryCost: {
            $set: decimalRound2(
              record.isVat ? unitCostVat : unitCostDiscounted
            ),
          },
          grossAmount: {
            $set: decimalRound2(totalAmount),
          },
          vatAmount: {
            $set: decimalRound2(record.isVat ? tax : 0),
          },
          netDiscount: {
            $set: decimalRound2(net_of_discount),
          },
          netAmount: {
            $set: decimalRound2(net_amount),
          },
          discAmount: {
            $set: decimalRound2(discount),
          },
        },
      });
    } else if (el === "discRate") {
      // ========== validate max only 100% =============================
      let inputValue = Number(value);
      if (Number(value) > 100) {
        inputValue = 100;
      }
      let discount = record.grossAmount * (inputValue / 100);
      let rate = inputValue / 100;
      let discountUnitCost = 0;
      if (rate) {
        discountUnitCost = record.unitCost * rate;
      }
      let netAmount = 0;
      let unitCostDiscounted = record.unitCost - discountUnitCost;
      let invCost = unitCostDiscounted;
      let inputTax = 0;
      if (vatInclusive) {
        inputTax = ((record.grossAmount - discount) / (vatRate + 1)) * vatRate;
      } else {
        inputTax = (record.grossAmount - discount) * vatRate;
      }
      if (record.isVat) {
        if (vatInclusive) {
          netAmount = record.grossAmount - inputTax - discount;
          invCost = unitCostDiscounted / (vatRate + 1);
        } else {
          netAmount = record.grossAmount + inputTax - discount;
          invCost = unitCostDiscounted * vatRate + unitCostDiscounted;
        }
      } else {
        netAmount = record.grossAmount - discount;
      }
      let net_of_discount = record.grossAmount - discount;
      data = update(payload, {
        [key]: {
          [el]: {
            $set: inputValue,
          },
          discAmount: {
            $set: decimalRound2(discount),
          },
          inventoryCost: {
            $set: decimalRound2(invCost),
          },
          netDiscount: {
            $set: decimalRound2(net_of_discount),
          },
          netAmount: {
            $set: decimalRound2(netAmount),
          },
          vatAmount: {
            $set: decimalRound2(record.isVat ? inputTax : 0),
          },
        },
      });
    } else if (el === "discAmount") {
      let discount = Number(value) ?? 0;
      const lprice = record.grossAmount;
      const sprice = record.grossAmount - discount;
      let discountRate = ((lprice - sprice) / lprice) * 100;
      let decimalRate = (lprice - sprice) / lprice;
      let netAmount = 0;
      let discountUnitCost = 0;
      if (decimalRate) {
        discountUnitCost = record.unitCost * decimalRate;
      }
      let unitCostDiscounted = record.unitCost - discountUnitCost;
      let invCost = unitCostDiscounted;
      let inputTax = 0;
      if (vatInclusive) {
        inputTax = ((record.grossAmount - discount) / (vatRate + 1)) * vatRate;
      } else {
        inputTax = (record.grossAmount - discount) * vatRate;
      }

      if (record.isVat) {
        if (vatInclusive) {
          netAmount = record.grossAmount - inputTax - discount;
          invCost = unitCostDiscounted / (vatRate + 1);
        } else {
          netAmount = record.grossAmount + inputTax - discount;
          invCost = unitCostDiscounted * vatRate + unitCostDiscounted;
        }
      } else {
        netAmount = record.grossAmount - discount;
      }
      let net_of_discount = record.grossAmount - discount;
      data = update(payload, {
        [key]: {
          discAmount: {
            $set: decimalRound2(discount),
          },
          inventoryCost: {
            $set: decimalRound2(invCost),
          },
          discRate: {
            $set: discountRate,
          },
          netDiscount: {
            $set: decimalRound2(net_of_discount),
          },
          netAmount: {
            $set: decimalRound2(netAmount),
          },
          vatAmount: {
            $set: decimalRound2(record.isVat ? inputTax : 0),
          },
        },
      });
    }
    // ================== set updated data =========================
    setDataSource(data);
    calculateAmount(data);
  };

  const onChangeVat = async (value: boolean, record: PettyCashItemDto) => {
    // ================ form data =========================
    const { getFieldsValue } = form;
    const {
      vatRate: vatPercent,
      vatInclusive,
    }: { vatRate: number; vatInclusive: boolean } = getFieldsValue();
    let vatRate = vatPercent / 100;
    //=========================================================
    let payload = _.clone(dataSource) as PettyCashItemDto[];
    let key = _.findIndex(payload, ["id", record.id]);
    let data = [] as PettyCashItemDto[];

    let inputTax = 0;
    if (vatInclusive) {
      inputTax =
        ((record.grossAmount - record.discAmount) / (vatRate + 1)) * vatRate;
    } else {
      inputTax = (record.grossAmount - record.discAmount) * vatRate;
    }
    let netAmount = 0;
    let discountUnitCost = 0;
    let decimalRate = record.discRate / 100;
    if (decimalRate) {
      discountUnitCost = record.unitCost * decimalRate;
    }
    let unitCostDiscounted = record.unitCost - discountUnitCost;
    let unitCostVat = unitCostDiscounted;
    if (value) {
      if (vatInclusive) {
        netAmount = record.grossAmount - inputTax - record.discAmount;
        unitCostVat = unitCostDiscounted / (vatRate + 1);
      } else {
        netAmount = record.grossAmount + inputTax - record.discAmount;
        unitCostVat = unitCostDiscounted * vatRate + unitCostDiscounted;
      }
    } else {
      netAmount = record.grossAmount - record.discAmount;
    }
    let net_of_discount = record.grossAmount - record.discAmount;
    data = update(payload, {
      [key]: {
        inventoryCost: {
          $set: decimalRound2(value ? unitCostVat : unitCostDiscounted),
        },
        vatAmount: {
          $set: decimalRound2(value ? inputTax : 0.0),
        },
        netDiscount: {
          $set: decimalRound2(net_of_discount),
        },
        netAmount: {
          $set: decimalRound2(netAmount),
        },
        isVat: {
          $set: value,
        },
      },
    });
    // ================== set updated data =========================
    setDataSource(data);
    calculateAmount(data);
  };

  const onChangeOthers = (value: any, el: string, record: PettyCashItemDto) => {
    // ================  data =========================
    let payload = _.clone(dataSource) as PettyCashItemDto[];
    let key = _.findIndex(payload, ["id", record.id]);
    let data = [] as PettyCashItemDto[];
    //=========================================================
    if (el === "expirationDate") {
      data = update(payload, {
        [key]: {
          [el]: {
            $set: value ? DateFormatter(value as string) : null,
          },
        },
      });
    } else if (el === "lotNo") {
      data = update(payload, {
        [key]: {
          [el]: {
            $set: value as string,
          },
        },
      });
    }
    // ================== set updated data =========================
    setDataSource(data);
  };

  const calculateAmount = async (data: PettyCashItemDto[]) => {
    // ================ form data =========================
    const { getFieldsValue } = form;
    const { vatInclusive }: { vatInclusive: boolean } = getFieldsValue();
    //=========================================================
    if (!_.isEmpty(data)) {
      let netOfDiscount: number = decimalRound2(_.sumBy(data, "netDiscount"));
      let netAmount: number = decimalRound2(_.sumBy(data, "netAmount"));
      if (vatInclusive) {
        calculateUsedAmount(netOfDiscount);
      } else {
        calculateUsedAmount(netAmount);
      }
    }
  };

  const calculateVatRate = (rate: number) => {
    // ================ form data =========================
    const { getFieldsValue } = form;
    const { vatInclusive }: { vatInclusive: boolean } = getFieldsValue();
    //================================
    setConfig((prev) => ({ ...prev, vatRate: rate }));
    onVatChangeCalculate(vatInclusive, rate);
  };

  const calculateVatInclusive = (value: boolean) => {
    // ================ form data =========================
    const { getFieldsValue } = form;
    const { vatRate }: { vatRate: number } = getFieldsValue();
    //================================
    setConfig((prev) => ({ ...prev, vatInclusive: value }));
    onVatChangeCalculate(value, vatRate);
  };

  const onVatChangeCalculate = (vatInc: boolean, vat: number) => {
    let payload = _.clone(dataSource) as PettyCashItemDto[];
    let vatRate = vat / 100;
    if (!_.isEmpty(payload)) {
      let updatedPayload: PettyCashItemDto[] = payload.map(
        (obj: PettyCashItemDto) => {
          let inputTax = 0;
          let net_amount = 0;
          let unitCost = 0;
          let discountCost = 0;
          let discountUnitCost = 0;
          let decimalRate = obj.discRate / 100;
          if (decimalRate) {
            discountUnitCost = obj.unitCost * decimalRate;
          }
          discountCost = obj.unitCost - discountUnitCost;
          unitCost = discountCost;
          if (vatInc) {
            inputTax =
              ((obj.grossAmount - obj.discAmount) / (vatRate + 1)) * vatRate;
            net_amount = 0;
            if (obj.isVat) {
              net_amount = obj.grossAmount - inputTax - obj.discAmount;
            } else {
              net_amount = obj.grossAmount - obj.discAmount;
            }
            unitCost = discountCost / (vatRate + 1);
          } else {
            inputTax = (obj.grossAmount - obj.discAmount) * vatRate;
            net_amount = 0;
            if (obj.isVat) {
              net_amount = obj.grossAmount + inputTax - obj.discAmount;
            } else {
              net_amount = obj.grossAmount - obj.discAmount;
            }
            unitCost = discountCost * vatRate + discountCost;
          }
          return {
            ...obj,
            netAmount: decimalRound2(net_amount),
            inventoryCost: decimalRound2(obj.isVat ? unitCost : discountCost),
            vatAmount: decimalRound2(obj.isVat ? inputTax : 0.0),
          };
        }
      );
      // ================== set updated data =========================
      setDataSource(updatedPayload);
      calculateAmount(updatedPayload);
    }
  };

  const inputComponent = (props: EditableProps) => {
    const { type, defaultValue, defaultChecked, record, element } = props;
    const { id } = record;
    if (type === "number") {
      return (
        <InputNumber
          autoFocus
          defaultValue={defaultValue}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          placeholder="Enter Value"
          className="w-full"
          onBlur={(e) => {
            let value = e?.target?.value as string;
            let valueNumber = value.replaceAll(",", "");
            let formatted = Number(valueNumber) ?? 0;
            onChangeCalculation(formatted, element, record);
            setEditable((prev: any) => ({
              ...prev,
              [`${id}${element}`]: false,
            }));
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              let value = e.currentTarget.value as string;
              let valueNumber = value.replaceAll(",", "");
              let formatted = Number(valueNumber) ?? 0;
              onChangeCalculation(formatted, element, record);
              setEditable((prev: any) => ({
                ...prev,
                [`${id}${element}`]: false,
              }));
            }
          }}
        />
      );
    } else if (type === "string") {
      return (
        <Input
          autoFocus
          defaultValue={defaultValue}
          placeholder="Enter Value"
          className="w-full"
          onBlur={(e) => {
            let value = e?.target?.value as string;
            onChangeOthers(value, element, record);
            setEditable((prev: any) => ({
              ...prev,
              [`${id}${element}`]: false,
            }));
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              let value = e.currentTarget.value as string;
              onChangeOthers(value, element, record);
              setEditable((prev: any) => ({
                ...prev,
                [`${id}${element}`]: false,
              }));
            }
          }}
        />
      );
    } else if (type === "date") {
      return (
        <DatePicker
          autoFocus
          defaultValue={
            defaultValue ? dayjs(defaultValue, dateFormat) : dayjs()
          }
          format={dateFormat}
          placeholder="Enter Value"
          className="w-full"
          onBlur={(e) => {
            let value = e?.target?.value as string;
            onChangeOthers(value, element, record);
            setEditable((prev: any) => ({
              ...prev,
              [`${id}${element}`]: false,
            }));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              let value = e.currentTarget.value as string;
              onChangeOthers(value, element, record);
              setEditable((prev: any) => ({
                ...prev,
                [`${id}${element}`]: false,
              }));
            }
          }}
        />
      );
    } else if (type === "checkbox") {
      return (
        <Checkbox
          defaultChecked={defaultChecked}
          onChange={(e) => onChangeVat(e.target.checked, record)}
        />
      );
    } else {
      return null;
    }
  };
  //====================== end calculation here ===========================

  const onRemove = (e?: PettyCashItemDto) => {
    let payload = _.clone(e ?? {}) as PettyCashItemDto;
    if (payload?.id) {
      confirmDelete("Click Yes if you want to proceed", () => {
        let status = e?.isNew ?? false;
        removeItem(e?.id, status);
      });
    }
  };

  const removeItem = (id: string, isNew: boolean) => {
    let data = _.clone(dataSource);
    if (isNew) {
      //remove array
      let payload = _.filter(data, (e) => {
        return e.id !== id;
      });
      setDataSource(payload);
      message.success("Sucessfully Removed");
    } else {
      //remove database then refecth
      removeRecord({
        variables: {
          id: id,
        },
      });
    }
  };

  // ======================== columns ================================
  const columns: ColumnsType<PettyCashItemDto> = [
    {
      title: "Item Description",
      dataIndex: "descLong",
      key: "descLong",
      width: 350,
    },
    {
      title: (
        <ColumnTitle
          descripton="Unit Measurement (UoP/UoU)"
          popup="(Unit of Purchase / Unit of Usage)"
        />
      ),
      dataIndex: "unitMeasurement",
      key: "unitMeasurement",
      width: 180,
    },
    {
      title: <ColumnTitle descripton="Unit (UoU)" popup="Unit of Usage" />,
      dataIndex: "uou",
      key: "uou",
      width: 100,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Office",
      dataIndex: "office.officeDescription",
      key: "office.officeDescription",
      width: 200,
      render: (_, record) => <span>{record?.office?.officeDescription}</span>,
    },
    {
      title: (
        <ColumnTitle descripton="Qty (UoU)" popup="Unit of Usage" editable />
      ),
      dataIndex: "qty",
      key: "qty",
      width: 130,
      align: "right",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (status) {
              message.error(
                "This transaction is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({ ...prev, [e.id + "qty"]: true }));
            }
          }, // double click row
        };
      },
      render: (qty, record) => {
        let inputProps = {
          type: "number",
          defaultValue: record?.qty ?? 1,
          record: record,
          element: "qty",
        };
        return editable[record.id + "qty"] ? (
          inputComponent(inputProps)
        ) : (
          <span>{NumberFormaterNoDecimal(qty)}</span>
        );
      },
    },
    {
      title: <ColumnTitle descripton="Unit Cost (UoU)" popup="Unit of Usage" />,
      dataIndex: "unitCost",
      key: "unitCost",
      width: 130,
      align: "right",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (status) {
              message.error(
                "This transaction is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({
                ...prev,
                [e.id + "unitCost"]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (amount, record) => {
        let inputProps = {
          type: "number",
          defaultValue: record?.unitCost ?? 0,
          record: record,
          element: "unitCost",
        };
        return editable[record.id + "unitCost"] ? (
          inputComponent(inputProps)
        ) : (
          <span>
            <small>{currency} </small>
            {NumberFormater(amount)}
          </span>
        );
      },
    },
    {
      title: "Inventory Cost",
      dataIndex: "inventoryCost",
      key: "inventoryCost",
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
      title: "Gross Amount",
      dataIndex: "grossAmount",
      key: "grossAmount",
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
      title: <ColumnTitle descripton="Discount Rate" editable />,
      dataIndex: "discRate",
      key: "discRate",
      width: 130,
      align: "right",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (status) {
              message.error(
                "This transaction is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({
                ...prev,
                [e.id + "discRate"]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (amount, record) => {
        let inputProps = {
          type: "number",
          defaultValue: record?.discRate ?? 0,
          record: record,
          element: "discRate",
        };
        return editable[record.id + "discRate"] ? (
          inputComponent(inputProps)
        ) : (
          <span>{NumberFormater(amount)}</span>
        );
      },
    },
    {
      title: <ColumnTitle descripton="Discount Amount" editable />,
      dataIndex: "discAmount",
      key: "discAmount",
      width: 130,
      align: "right",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (status) {
              message.error(
                "This transaction is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({
                ...prev,
                [e.id + "discAmount"]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (amount, record) => {
        let inputProps = {
          type: "number",
          defaultValue: record?.discAmount ?? 0,
          record: record,
          element: "discAmount",
        };
        return editable[record.id + "discAmount"] ? (
          inputComponent(inputProps)
        ) : (
          <span>
            <small>{currency} </small>
            {NumberFormater(amount)}
          </span>
        );
      },
    },
    {
      title: "Net Discount",
      dataIndex: "netDiscount",
      key: "netDiscount",
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
      title: <ColumnTitle descripton="Expiration Date" editable />,
      dataIndex: "expirationDate",
      key: "expirationDate",
      width: 120,
      align: "center",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (status) {
              message.error(
                "This transaction is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({
                ...prev,
                [e.id + "expirationDate"]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (date: string, record) => {
        let inputProps = {
          type: "date",
          defaultValue: record?.expirationDate ?? null,
          record: record,
          element: "expirationDate",
        };
        return editable[record.id + "expirationDate"] ? (
          inputComponent(inputProps)
        ) : (
          <span>{date ? DateFormatter(date) : "--"}</span>
        );
      },
    },
    {
      title: <ColumnTitle descripton="Lot No" editable />,
      dataIndex: "lotNo",
      key: "lotNo",
      width: 150,
      align: "center",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (status) {
              message.error(
                "This transaction is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({
                ...prev,
                [e.id + "lotNo"]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (lotNo: string, record) => {
        let inputProps = {
          type: "string",
          defaultValue: record?.lotNo ?? "",
          record: record,
          element: "lotNo",
        };
        return editable[record.id + "lotNo"] ? (
          inputComponent(inputProps)
        ) : (
          <span>{lotNo ? lotNo : "--"}</span>
        );
      },
    },
    {
      title: "Vatable?",
      dataIndex: "isVat",
      key: "isVat",
      width: 70,
      align: "center",
      onCell: (e) => {
        return {
          onDoubleClick: () => {
            if (status) {
              message.error(
                "This transaction is already posted/voided. Editing is disabled."
              );
            } else {
              setEditable((prev: any) => ({
                ...prev,
                [e.id + "isVat"]: true,
              }));
            }
          }, // double click row
        };
      },
      render: (isVat: boolean, record) => {
        let inputProps = {
          type: "checkbox",
          defaultChecked: isVat,
          record: record,
          element: "isVat",
        };
        return inputComponent(inputProps);
      },
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
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
      align: "right",
      width: 130,
      fixed: "right",
      render: (amount) => <span>{NumberFormater(amount)}</span>,
    },

    {
      title: "#",
      dataIndex: "action",
      key: "action",
      width: 60,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
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
        <Form
          form={form}
          name="configForm"
          layout="vertical"
          initialValues={{
            vatRate: config.vatRate,
            vatInclusive: config.vatInclusive,
          }}>
          <Space>
            <FormInputNumber
              label="Vat Rate"
              name="vatRate"
              propsinputnumber={{
                placeholder: "Vat Rate",
                onChange: (e) => {
                  let value = Number(e) ?? 0;
                  calculateVatRate(value);
                },
              }}
            />
            <FormSwitch
              label="Vat Inclusive?"
              name="vatInclusive"
              valuePropName="checked"
              switchprops={{
                checkedChildren: "Yes",
                unCheckedChildren: "No",
                onChange: (e) => {
                  calculateVatInclusive(e);
                },
              }}
            />
            <Button
              type="primary"
              icon={<BarcodeOutlined />}
              style={{ marginTop: 17 }}
              disabled={status}
              onClick={() => onShowTransaction()}>
              Add Items
            </Button>
          </Space>
        </Form>
      </div>
      <Table
        rowKey="id"
        size="small"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        scroll={{ x: 3100 }}
        pagination={{
          pageSize: 8,
          showSizeChanger: false,
        }}
        summary={() => <PettyPurchaseSummaryFooter dataSource={dataSource} />}
      />
    </div>
  );
}
